from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import UnderwritingSubmission, SubmissionRisk, SubmissionLineOfBusiness
from app.repositories.base import BaseRepository

class SubmissionRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(UnderwritingSubmission, db)

    def create_submission(self, tenant_id: UUID, broker_id: str,
                          applicant_name: str, line_of_business: str,
                          status: str = "submitted") -> UnderwritingSubmission:
        return self.create(
            tenant_id=tenant_id,
            broker_id=broker_id,
            applicant_name=applicant_name,
            line_of_business=line_of_business,
            status=status
        )

    def list_submissions(self, tenant_id: UUID, status: Optional[str] = None,
                         limit: int = 50, offset: int = 0) -> List[UnderwritingSubmission]:
        query = self.db.query(UnderwritingSubmission).filter(
            UnderwritingSubmission.tenant_id == tenant_id
        )
        if status:
            query = query.filter(UnderwritingSubmission.status == status)
        return query.order_by(desc(UnderwritingSubmission.created_at)).limit(limit).offset(offset).all()

    def add_risk(self, submission_id: UUID, risk_factor: str, severity: str, evidence: str = None) -> SubmissionRisk:
        risk = SubmissionRisk(
            submission_id=submission_id,
            risk_factor=risk_factor,
            severity=severity,
            evidence=evidence
        )
        self.db.add(risk)
        self.db.commit()
        self.db.refresh(risk)
        return risk

    def get_risks(self, submission_id: UUID) -> List[SubmissionRisk]:
        return self.db.query(SubmissionRisk).filter(
            SubmissionRisk.submission_id == submission_id
        ).all()
