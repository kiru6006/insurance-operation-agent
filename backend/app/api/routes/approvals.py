from typing import List, Optional
from datetime import datetime
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user

router = APIRouter()

class DecisionPayload(BaseModel):
    reason: Optional[str] = "Decision rendered by underwriter."

# In-memory approval storage for agile demo & local workflow approval state
_MOCK_APPROVALS = [
    {
        "id": "APP-001",
        "submission_id": "SUB-005",
        "applicant_name": "Pinnacle Construction LLC #5",
        "action_required": "High-risk fall exposure requires senior underwriter bind authority.",
        "status": "pending",
        "assigned_to": "Underwriter Team",
        "severity": "high",
        "created_at": datetime.utcnow().isoformat(),
        "decided_at": None,
        "decision_reason": None
    },
    {
        "id": "APP-002",
        "submission_id": "SUB-003",
        "applicant_name": "Beacon Hospitality Group #3",
        "action_required": "Rooftop lounge liquor liability warranty review.",
        "status": "pending",
        "assigned_to": "Underwriter Team",
        "severity": "medium",
        "created_at": datetime.utcnow().isoformat(),
        "decided_at": None,
        "decision_reason": None
    },
    {
        "id": "APP-003",
        "submission_id": "CLM-007",
        "applicant_name": "Apex Logistics Corp (Claim CLM-007)",
        "action_required": "Suspected duplicate repair invoice detected - SIU forensic investigator review required.",
        "status": "pending",
        "assigned_to": "Claims SIU Team",
        "severity": "high",
        "created_at": datetime.utcnow().isoformat(),
        "decided_at": None,
        "decision_reason": None
    }
]

@router.get("")
async def list_approvals(current_user: dict = Depends(get_current_user)):
    return _MOCK_APPROVALS

@router.post("/{id}/approve")
async def approve_request(id: str, payload: DecisionPayload = None, current_user: dict = Depends(get_current_user)):
    for app in _MOCK_APPROVALS:
        if app["id"] == id:
            app["status"] = "approved"
            app["decided_at"] = datetime.utcnow().isoformat()
            app["decision_reason"] = payload.reason if payload else "Approved."
            return {"status": "success", "approval": app}
    raise HTTPException(status_code=404, detail="Approval request not found")

@router.post("/{id}/reject")
async def reject_request(id: str, payload: DecisionPayload = None, current_user: dict = Depends(get_current_user)):
    for app in _MOCK_APPROVALS:
        if app["id"] == id:
            app["status"] = "rejected"
            app["decided_at"] = datetime.utcnow().isoformat()
            app["decision_reason"] = payload.reason if payload else "Declined."
            return {"status": "success", "approval": app}
    raise HTTPException(status_code=404, detail="Approval request not found")

@router.post("/{id}/request-info")
async def request_more_info(id: str, payload: DecisionPayload = None, current_user: dict = Depends(get_current_user)):
    for app in _MOCK_APPROVALS:
        if app["id"] == id:
            app["status"] = "info_requested"
            app["decided_at"] = datetime.utcnow().isoformat()
            app["decision_reason"] = payload.reason if payload else "Additional information requested from broker."
            return {"status": "success", "approval": app}
    raise HTTPException(status_code=404, detail="Approval request not found")
