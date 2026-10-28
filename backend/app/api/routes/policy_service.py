from typing import List, Optional
from uuid import UUID
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.schemas.policy_service import (
    PolicyServiceCreate, PolicyServiceResponse, PolicyServiceResolveRequest
)
from app.repositories.policy_service import PolicyServiceRepository
from app.services.workflow import WorkflowService
from app.infrastructure.mock_systems import policy_service_system, policy_system

router = APIRouter()

@router.post("", response_model=PolicyServiceResponse)
async def create_service_request(
    payload: PolicyServiceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = PolicyServiceRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    req = repo.create_request(
        tenant_id=tenant_id,
        policy_id=payload.policy_id,
        customer_id=payload.customer_id,
        request_type=payload.request_type,
        description=payload.description,
        requested_changes=json.dumps(payload.requested_changes) if payload.requested_changes else None,
        status="pending"
    )
    return req

@router.get("", response_model=List[PolicyServiceResponse])
async def list_service_requests(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = PolicyServiceRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    db_requests = repo.list_requests(tenant_id, status=status, limit=limit, offset=offset)
    if not db_requests:
        mock_reqs = policy_service_system.list_requests()
        import uuid
        res = []
        for mr in mock_reqs[:limit]:
            res.append({
                "id": uuid.uuid4(),
                "tenant_id": tenant_id,
                "policy_id": mr["policy_id"],
                "customer_id": mr["customer_id"],
                "request_type": mr["request_type"],
                "description": mr.get("description", ""),
                "requested_changes": json.dumps(mr.get("requested_changes", {})),
                "status": mr["status"],
                "created_at": mr["created_at"],
                "updated_at": mr["updated_at"]
            })
        return res
    return db_requests

@router.get("/{id}")
async def get_service_request(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = PolicyServiceRepository(db)
    try:
        req_uuid = UUID(id)
        req = repo.get_by_id(req_uuid)
        if req:
            return {
                "id": str(req.id),
                "tenant_id": str(req.tenant_id),
                "policy_id": req.policy_id,
                "customer_id": req.customer_id,
                "request_type": req.request_type,
                "description": req.description,
                "requested_changes": req.requested_changes,
                "status": req.status,
                "created_at": req.created_at,
                "updated_at": req.updated_at
            }
    except Exception:
        pass

    mock_req = policy_service_system.get_request(id)
    if mock_req:
        policy = policy_system.get_policy(mock_req["policy_id"])
        return {
            **mock_req,
            "policy_details": policy
        }
    raise HTTPException(status_code=404, detail="Service request not found")

@router.post("/{id}/process")
async def process_service_request(
    id: str,
    payload: Optional[PolicyServiceResolveRequest] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    mock_req = policy_service_system.get_request(id) or {
        "id": id,
        "policy_id": "POL-001",
        "request_type": "address_change",
        "description": "Commercial relocation address update",
        "requested_changes": {"new_address": "850 Logistics Blvd, Joliet, IL"}
    }

    workflow_service = WorkflowService(db)
    req_uuid = UUID(int=3)
    try:
        req_uuid = UUID(id)
    except Exception:
        pass

    outcome = workflow_service.run_policy_service_workflow(
        tenant_id=tenant_id,
        request_id=req_uuid,
        service_data={
            "policy_id": mock_req.get("policy_id", "POL-001"),
            "request_type": mock_req.get("request_type", "address_change"),
            "description": mock_req.get("description", ""),
            "requested_changes": mock_req.get("requested_changes", {}),
            "execute_update": payload.execute_update if payload else True
        }
    )

    if outcome["status"] == "resolved":
        policy_service_system.update_status(id, "resolved")

    return outcome

@router.get("/{id}/workflow-status")
async def get_service_workflow_status(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return {
        "request_id": id,
        "status": "completed",
        "current_step": "servicing_resolution",
        "agents_completed": ["policy_intent", "policy_eligibility", "policy_execution"]
    }
