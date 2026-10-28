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

    def run_submission_workflow(self, tenant_id: UUID, submission_id: UUID, submission_data: dict) -> dict:
        from agents.submission.workflow import submission_workflow
        # Initialize or fetch workflow record
        workflow = self.repo.get_by_entity(tenant_id, str(submission_id))
        if not workflow:
            workflow = self.create_workflow(tenant_id, "submission", str(submission_id))

        self.update_status(workflow.id, status="in_progress", current_step="agents_evaluating")
        results = submission_workflow(submission_data)
        
        final_status = "pending_approval" if not results["ready_for_decision"] else "completed"
        self.update_status(workflow.id, status=final_status, current_step="decision_prepared")
        return {
            "workflow_id": str(workflow.id),
            "status": final_status,
            "results": results
        }

