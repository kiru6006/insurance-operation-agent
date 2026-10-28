from pydantic import BaseModel
from typing import Optional, Dict, Any

class AgentResponse(BaseModel):
    id: str
    name: str
    agent_type: str
    risk_level: str
    status: str

    class Config:
        from_attributes = True

class AgentRunResponse(BaseModel):
    id: str
    agent_id: str
    status: str
    latency_ms: int
    tokens_used: Optional[int] = 0

    class Config:
        from_attributes = True
