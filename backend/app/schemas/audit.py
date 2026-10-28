from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class AuditEventResponse(BaseModel):
    id: str
    tenant_id: str
    actor_type: str
    actor_id: str
    action: str
    entity_type: str
    entity_id: str
    result: str
    metadata_: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AuditSummaryResponse(BaseModel):
    total_events: int
    by_actor: Dict[str, int]
    by_entity: Dict[str, int]
    compliance_score: float
    regulatory_framework: str
