from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.deps import get_current_user
from app.infrastructure.mock_systems import submission_system, claims_system

router = APIRouter()

@router.get("/metrics")
async def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    submissions = submission_system.list_submissions()
    total_received = len(submissions)
    ai_processed = len([s for s in submissions if s.get("status") == "analyzed"])
    pending_review = len([s for s in submissions if s.get("status") == "submitted"])
    automation_rate = round((ai_processed / total_received * 100), 1) if total_received > 0 else 0.0

    claims = claims_system.list_claims()
    total_claims = len(claims)
    auto_adjudicated = len([c for c in claims if c.get("status") == "approved"])
    claims_under_review = len([c for c in claims if c.get("status") in ["reported", "under_review"]])

    return {
        "casesReceived": total_received,
        "aiProcessed": ai_processed,
        "pendingReview": pending_review,
        "automationRate": automation_rate,
        "totalClaims": total_claims,
        "claimsAutoAdjudicated": auto_adjudicated,
        "claimsUnderReview": claims_under_review
    }

