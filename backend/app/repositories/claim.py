from uuid import UUID
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Claim, ClaimDocument, ClaimAssessment, FraudSignal
from app.repositories.base import BaseRepository

class ClaimRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(Claim, db)

    def create_claim(self, tenant_id: UUID, policy_id: str, customer_id: str,
                     incident_date: datetime, amount_claimed: float,
                     claim_type: str = "property_damage", description: str = None,
                     incident_location: str = None, status: str = "reported") -> Claim:
        return self.create(
            tenant_id=tenant_id,
            policy_id=policy_id,
            customer_id=customer_id,
            incident_date=incident_date,
            amount_claimed=amount_claimed,
            claim_type=claim_type,
            description=description,
            incident_location=incident_location,
            status=status
        )

    def list_claims(self, tenant_id: UUID, status: Optional[str] = None,
                    limit: int = 50, offset: int = 0) -> List[Claim]:
        query = self.db.query(Claim).filter(Claim.tenant_id == tenant_id)
        if status:
            query = query.filter(Claim.status == status)
        return query.order_by(desc(Claim.created_at)).limit(limit).offset(offset).all()

    def add_assessment(self, claim_id: UUID, assessment_type: str, result: str, confidence: float = 1.0) -> ClaimAssessment:
        assessment = ClaimAssessment(
            claim_id=claim_id,
            assessment_type=assessment_type,
            result=result,
            confidence=confidence
        )
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    def get_assessments(self, claim_id: UUID) -> List[ClaimAssessment]:
        return self.db.query(ClaimAssessment).filter(ClaimAssessment.claim_id == claim_id).all()

    def add_fraud_signal(self, claim_id: UUID, signal_type: str, severity: str, evidence: str = None) -> FraudSignal:
        signal = FraudSignal(
            claim_id=claim_id,
            signal_type=signal_type,
            severity=severity,
            evidence=evidence
        )
        self.db.add(signal)
        self.db.commit()
        self.db.refresh(signal)
        return signal

    def get_fraud_signals(self, claim_id: UUID) -> List[FraudSignal]:
        return self.db.query(FraudSignal).filter(FraudSignal.claim_id == claim_id).all()


class ClaimDocumentRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(ClaimDocument, db)

    def add_document(self, claim_id: UUID, file_name: str, file_path: str, document_type: str) -> ClaimDocument:
        doc = ClaimDocument(
            claim_id=claim_id,
            file_name=file_name,
            file_path=file_path,
            document_type=document_type
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)
        return doc

    def list_by_claim(self, claim_id: UUID) -> List[ClaimDocument]:
        return self.db.query(ClaimDocument).filter(ClaimDocument.claim_id == claim_id).all()
