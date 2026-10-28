from uuid import UUID
from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.workflow import WorkflowRepository
from app.models import Workflow

class WorkflowService:
    def __init__(self, db: Session):
        self.repo = WorkflowRepository(db)
    
    def create_workflow(self, tenant_id: UUID, workflow_type: str, entity_id: str):
        return self.repo.create(
            tenant_id=tenant_id,
            workflow_type=workflow_type,
            entity_id=entity_id,
            status="new",
            current_step=None
        )
    
    def get_workflow(self, workflow_id: UUID):
        return self.repo.get_by_id(workflow_id)
    
    def update_status(self, workflow_id: UUID, status: str, current_step: Optional[str] = None):
        return self.repo.update(workflow_id, status=status, current_step=current_step)
