from uuid import UUID
from typing import Optional
from sqlalchemy.orm import Session
from app.models import Workflow
from app.repositories.base import BaseRepository

class WorkflowRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(Workflow, db)
    
    def get_by_entity(self, tenant_id: UUID, entity_id: str) -> Optional[Workflow]:
        return self.db.query(Workflow)\
            .filter(Workflow.tenant_id == tenant_id, Workflow.entity_id == entity_id)\
            .first()
