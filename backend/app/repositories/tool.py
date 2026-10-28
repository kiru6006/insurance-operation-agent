from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Tool, ToolPermission
from app.repositories.base import BaseRepository

class ToolRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(Tool, db)
    
    def get_by_name(self, name: str) -> Optional[Tool]:
        return self.db.query(Tool).filter(Tool.name == name).first()

    def is_tool_allowed(self, agent_id: UUID, tool_id: UUID) -> bool:
        perm = self.db.query(ToolPermission).filter(
            ToolPermission.agent_id == agent_id,
            ToolPermission.tool_id == tool_id
        ).first()
        return perm.allowed if perm else False

    def grant_permission(self, agent_id: UUID, tool_id: UUID, allowed: bool = True) -> ToolPermission:
        perm = self.db.query(ToolPermission).filter(
            ToolPermission.agent_id == agent_id,
            ToolPermission.tool_id == tool_id
        ).first()
        if perm:
            perm.allowed = allowed
        else:
            perm = ToolPermission(agent_id=agent_id, tool_id=tool_id, allowed=allowed)
            self.db.add(perm)
        self.db.commit()
        self.db.refresh(perm)
        return perm
