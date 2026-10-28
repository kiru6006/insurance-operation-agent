from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class PolicyServiceCreate(BaseModel):
    policy_id: str
    customer_id: str = "CUST-001"
    request_type: str  # address_change, contact_change, vehicle_addition, certificate, endorsement
    description: Optional[str] = None
    requested_changes: Optional[Dict[str, Any]] = None

class PolicyServiceResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    policy_id: str
    customer_id: str
    request_type: str
    description: Optional[str] = None
    requested_changes: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PolicyServiceResolveRequest(BaseModel):
    execute_update: bool = True
