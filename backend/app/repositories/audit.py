from uuid import UUID
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models import AuditEvent
from app.repositories.base import BaseRepository

class AuditRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(AuditEvent, db)
    
    def log(self, tenant_id: UUID, actor_type: str, actor_id: str,
            action: str, entity_type: str, entity_id: str, 
            result: str, metadata: Optional[Dict[str, Any]] = None) -> AuditEvent:
        return self.create(
            tenant_id=tenant_id,
            actor_type=actor_type,
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            result=result,
            metadata_=metadata or {}
        )
