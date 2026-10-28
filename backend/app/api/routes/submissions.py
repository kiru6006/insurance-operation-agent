from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.schemas.submission import SubmissionCreate, SubmissionResponse
from app.repositories.submission import SubmissionRepository
from app.repositories.submission_document import SubmissionDocumentRepository
from app.services.workflow import WorkflowService
from app.infrastructure.mock_systems import submission_system

router = APIRouter()

@router.post("", response_model=SubmissionResponse)
async def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = SubmissionRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    submission = repo.create_submission(
        tenant_id=tenant_id,
        broker_id=payload.broker_id,
        applicant_name=payload.applicant_name,
        line_of_business=payload.line_of_business,
        status="submitted"
    )
    return submission

@router.get("", response_model=List[SubmissionResponse])
async def list_submissions(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = SubmissionRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()
    
    # Try fetching database submissions; fallback to mock seeded submissions if empty
    subs = repo.list_submissions(tenant_id, status=status, limit=limit, offset=offset)
    if not subs:
        mock_subs = submission_system.list_submissions()
        return mock_subs[:limit]
    return subs

@router.get("/{id}")
async def get_submission(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = SubmissionRepository(db)
    doc_repo = SubmissionDocumentRepository(db)
    try:
        sub_uuid = UUID(id)
        sub = repo.get_by_id(sub_uuid)
        if sub:
            docs = doc_repo.list_by_submission(sub_uuid)
            return {
                "id": str(sub.id),
                "tenant_id": str(sub.tenant_id),
                "broker_id": sub.broker_id,
                "applicant_name": sub.applicant_name,
                "line_of_business": sub.line_of_business,
                "status": sub.status,
                "created_at": sub.created_at,
                "updated_at": sub.updated_at,
                "documents": docs,
                "risks": repo.get_risks(sub_uuid)
            }
    except Exception:
        pass

    # Check mock system
    mock_sub = submission_system.get_submission(id)
    if mock_sub:
        return {
            **mock_sub,
            "documents": submission_system.get_documents(id),
            "risks": []
        }
    raise HTTPException(status_code=404, detail="Submission not found")

@router.post("/{id}/analyze")
async def analyze_submission(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    # Get submission data and documents
    sub_data = submission_system.get_submission(id) or {
        "id": id,
        "applicant_name": "Commercial Applicant",
        "line_of_business": "COMMERCIAL_PROPERTY"
    }
    docs = submission_system.get_documents(id)
    email_text = submission_system.get_email_text(id)

    workflow_service = WorkflowService(db)
    analysis = workflow_service.run_submission_workflow(
        tenant_id=tenant_id,
        submission_id=UUID(int=1),
        submission_data={
            "applicant_name": sub_data.get("applicant_name"),
            "line_of_business": sub_data.get("line_of_business"),
            "email": email_text,
            "documents": docs
        }
    )
    return analysis

@router.get("/{id}/workflow-status")
async def get_workflow_status(
    id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return {
        "submission_id": id,
        "status": "completed",
        "current_step": "decision_prepared",
        "agents_completed": ["intake", "completeness", "risk_summary"]
    }
