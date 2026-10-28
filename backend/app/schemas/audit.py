from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class AuditEventResponse(BaseModel):
    id: str
    actor_type: str
    actor_id: str
    action: str
    entity_type: str
    entity_id: str
    result: str
    created_at: datetime

    class Config:
        from_attributes = True
