from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models import Agent, AgentRun
from app.repositories.base import BaseRepository

class AgentRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(Agent, db)
    
    def get_by_name(self, tenant_id: UUID, name: str) -> Optional[Agent]:
        return self.db.query(Agent)\
            .filter(Agent.tenant_id == tenant_id, Agent.name == name)\
            .first()

    def record_run(self, tenant_id: UUID, agent_id: UUID, workflow_id: Optional[UUID] = None,
                   input_data: dict = None, output_data: dict = None,
                   status: str = "completed", error: str = None,
                   latency_ms: int = 0, tokens_used: int = 0) -> AgentRun:
        run = AgentRun(
            tenant_id=tenant_id,
            agent_id=agent_id,
            workflow_id=workflow_id,
            input_data=input_data or {},
            output_data=output_data or {},
            status=status,
            error=error,
            latency_ms=latency_ms,
            tokens_used=tokens_used
        )
        self.db.add(run)
        self.db.commit()
        self.db.refresh(run)
        return run

    def list_runs(self, tenant_id: UUID, limit: int = 50) -> List[AgentRun]:
        return (
            self.db.query(AgentRun)
            .filter(AgentRun.tenant_id == tenant_id)
            .order_by(desc(AgentRun.created_at))
            .limit(limit)
            .all()
        )

