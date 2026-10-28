from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class WorkflowCreate(BaseModel):
    workflow_type: str  # submission, claim, service_request
    entity_id: str

class WorkflowResponse(BaseModel):
    id: str
    workflow_type: str
    entity_id: str
    status: str
    current_step: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
