from uuid import UUID
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import AuditEvent
from app.repositories.base import BaseRepository

class AuditRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(AuditEvent, db)
    
    def log(self, tenant_id: UUID, actor_type: str, actor_id: str,
            action: str, entity_type: str, entity_id: str, 
            result: str, metadata: Optional[Dict[str, Any]] = None) -> AuditEvent:
        event = AuditEvent(
            tenant_id=tenant_id,
            actor_type=actor_type,
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            result=result,
            metadata_=metadata or {}
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def list_events(self, entity_type: Optional[str] = None, actor_type: Optional[str] = None, limit: int = 100) -> List[AuditEvent]:
        query = self.db.query(AuditEvent)
        if entity_type:
            query = query.filter(AuditEvent.entity_type == entity_type)
        if actor_type:
            query = query.filter(AuditEvent.actor_type == actor_type)
        return query.order_by(desc(AuditEvent.created_at)).limit(limit).all()
