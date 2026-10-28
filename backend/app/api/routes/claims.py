from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.schemas.claim import ClaimCreate, ClaimResponse, ClaimAdjudicationRequest
from app.repositories.claim import ClaimRepository, ClaimDocumentRepository
from app.services.workflow import WorkflowService
from app.infrastructure.mock_systems import claims_system

router = APIRouter()

@router.post("", response_model=ClaimResponse)
async def create_claim(
    payload: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ClaimRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    claim = repo.create_claim(
        tenant_id=tenant_id,
        policy_id=payload.policy_id,
        customer_id=payload.customer_id,
        incident_date=payload.incident_date,
        amount_claimed=payload.amount_claimed,
        claim_type=payload.claim_type,
        description=payload.description,
        incident_location=payload.incident_location,
        status="reported"
    )
    return claim

@router.get("", response_model=List[ClaimResponse])
async def list_claims(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ClaimRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    db_claims = repo.list_claims(tenant_id, status=status, limit=limit, offset=offset)
    if not db_claims:
        # Fallback to mock seeded claims
        mock_claims = claims_system.list_claims()
        # Add tenant_id default for Pydantic response compatibility
        import uuid
        res = []
        for mc in mock_claims[:limit]:
            res.append({
                "id": uuid.uuid4(),
                "tenant_id": tenant_id,
                "policy_id": mc["policy_id"],
                "customer_id": mc["customer_id"],
                "incident_date": mc["incident_date"],
                "amount_claimed": mc["amount_claimed"],
                "claim_type": mc.get("claim_type", "property_damage"),
                "description": mc.get("description", ""),
                "incident_location": mc.get("incident_location", ""),
                "status": mc["status"],
                "created_at": mc["created_at"],
                "documents": [],
                "assessments": [],
                "fraud_signals": []
            })
        return res
    return db_claims

@router.get("/{id}")
async def get_claim(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ClaimRepository(db)
    doc_repo = ClaimDocumentRepository(db)
    try:
        c_uuid = UUID(id)
        claim = repo.get_by_id(c_uuid)
        if claim:
            docs = doc_repo.list_by_claim(c_uuid)
            assessments = repo.get_assessments(c_uuid)
            fraud_signals = repo.get_fraud_signals(c_uuid)
            return {
                "id": str(claim.id),
                "tenant_id": str(claim.tenant_id),
                "policy_id": claim.policy_id,
                "customer_id": claim.customer_id,
                "incident_date": claim.incident_date,
                "amount_claimed": claim.amount_claimed,
                "claim_type": claim.claim_type,
                "description": claim.description,
                "incident_location": claim.incident_location,
                "status": claim.status,
                "created_at": claim.created_at,
                "documents": docs,
                "assessments": assessments,
                "fraud_signals": fraud_signals
            }
    except Exception:
        pass

    # Check mock system
    mock_c = claims_system.get_claim(id)
    if mock_c:
        return {
            **mock_c,
            "documents": claims_system.get_documents(id),
            "fnol_email": claims_system.get_fnol_email(id),
            "assessments": [],
            "fraud_signals": []
        }
    raise HTTPException(status_code=404, detail="Claim not found")

@router.post("/{id}/adjudicate")
async def adjudicate_claim(
    id: str,
    payload: Optional[ClaimAdjudicationRequest] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    mock_c = claims_system.get_claim(id) or {
        "id": id,
        "policy_id": "POL-001",
        "amount_claimed": 4500.0,
        "claim_type": "auto_collision",
        "description": "Vehicle collision claim"
    }
    docs = claims_system.get_documents(id)
    fnol_email = claims_system.get_fnol_email(id)

    workflow_service = WorkflowService(db)
    claim_id_uuid = UUID(int=2)
    try:
        claim_id_uuid = UUID(id)
    except Exception:
        pass

    adjudication_result = workflow_service.run_claims_workflow(
        tenant_id=tenant_id,
        claim_id=claim_id_uuid,
        claim_data={
            "policy_id": mock_c.get("policy_id", "POL-001"),
            "amount_claimed": mock_c.get("amount_claimed", 4500.0),
            "claim_type": mock_c.get("claim_type", "auto_collision"),
            "description": mock_c.get("description", fnol_email),
            "email_text": fnol_email,
            "incident_location": mock_c.get("incident_location", "Unknown"),
            "documents": docs,
            "is_suspicious": mock_c.get("is_suspicious", False)
        }
    )
    return adjudication_result

@router.get("/{id}/workflow-status")
async def get_claim_workflow_status(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return {
        "claim_id": id,
        "status": "completed",
        "current_step": "adjudication_evaluated",
        "agents_completed": ["claims_intake", "coverage_validation", "fraud_detection"]
    }
