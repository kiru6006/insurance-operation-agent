from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentResponse(BaseModel):
    id: str
    submission_id: str
    file_name: str
    file_path: str
    document_type: str
    created_at: datetime

    class Config:
        from_attributes = True

class RiskResponse(BaseModel):
    id: str
    risk_factor: str
    severity: str
    evidence: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    broker_id: str
    applicant_name: str
    line_of_business: str
    initial_email_text: Optional[str] = None

class SubmissionResponse(BaseModel):
    id: str
    tenant_id: str
    broker_id: str
    applicant_name: str
    line_of_business: str
    status: str
    created_at: datetime
    updated_at: datetime
    documents: Optional[List[DocumentResponse]] = []
    risks: Optional[List[RiskResponse]] = []

    class Config:
        from_attributes = True
