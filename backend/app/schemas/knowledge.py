from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class KnowledgeDocumentCreate(BaseModel):
    title: str
    doc_type: str  # underwriting_guideline, claims_manual, policy_form
    content: str
    version: str = "1.0"

class KnowledgeDocumentResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    title: str
    doc_type: str
    version: str
    created_at: datetime

    class Config:
        from_attributes = True

class KnowledgeSearchRequest(BaseModel):
    query: str
    limit: int = 5

class CitationResult(BaseModel):
    document_id: str
    document_title: str
    doc_type: str
    version: str
    chunk_index: int
    content: str
    relevance_score: float

class KnowledgeSearchResponse(BaseModel):
    query: str
    citations: List[CitationResult]
    summary_synthesis: Optional[str] = None
