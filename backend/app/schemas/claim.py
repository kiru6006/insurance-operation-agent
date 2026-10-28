from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

class ClaimCreate(BaseModel):
    policy_id: str
    customer_id: str
    incident_date: datetime
    amount_claimed: float
    claim_type: str = "property_damage"
    description: Optional[str] = None
    incident_location: Optional[str] = None

class ClaimDocumentCreate(BaseModel):
    file_name: str
    file_path: str
    document_type: str

class ClaimDocumentResponse(BaseModel):
    id: UUID
    claim_id: UUID
    file_name: str
    file_path: str
    document_type: str
    created_at: datetime

    class Config:
        from_attributes = True

class ClaimAssessmentResponse(BaseModel):
    id: UUID
    claim_id: UUID
    assessment_type: str
    result: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True

class FraudSignalResponse(BaseModel):
    id: UUID
    claim_id: UUID
    signal_type: str
    severity: str
    evidence: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ClaimResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    policy_id: str
    customer_id: str
    incident_date: datetime
    amount_claimed: float
    claim_type: Optional[str] = "property_damage"
    description: Optional[str] = None
    incident_location: Optional[str] = None
    status: str
    created_at: datetime
    documents: List[ClaimDocumentResponse] = []
    assessments: List[ClaimAssessmentResponse] = []
    fraud_signals: List[FraudSignalResponse] = []

    class Config:
        from_attributes = True

class ClaimAdjudicationRequest(BaseModel):
    run_fraud_check: bool = True
    run_coverage_validation: bool = True
