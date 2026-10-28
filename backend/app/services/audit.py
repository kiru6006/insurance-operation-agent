from uuid import UUID
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.repositories.audit import AuditRepository

class AuditService:
    def __init__(self, db: Session):
        self.repo = AuditRepository(db)
    
    def log_action(self, tenant_id: UUID, actor_type: str, actor_id: str,
                   action: str, entity_type: str, entity_id: str, 
                   result: str, metadata: Optional[Dict[str, Any]] = None):
        return self.repo.log(tenant_id, actor_type, actor_id, action,
                           entity_type, entity_id, result, metadata)
