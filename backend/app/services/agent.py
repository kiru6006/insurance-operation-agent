from uuid import UUID
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from app.repositories.agent import AgentRepository

class AgentService:
    def __init__(self, db: Session):
        self.repo = AgentRepository(db)
    
    def register_agent(self, tenant_id: UUID, name: str, agent_type: str, 
                      risk_level: str = "low", config: Optional[Dict[str, Any]] = None):
        return self.repo.create(
            tenant_id=tenant_id,
            name=name,
            agent_type=agent_type,
            risk_level=risk_level,
            status="active",
            config=config or {}
        )
    
    def list_agents(self, tenant_id: UUID) -> List[Any]:
        return self.repo.list_by_tenant(tenant_id)
