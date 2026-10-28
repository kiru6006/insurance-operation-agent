from uuid import UUID
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import KnowledgeDocument, KnowledgeChunk
from app.repositories.base import BaseRepository

class KnowledgeRepository(BaseRepository):
    def __init__(self, db: Session):
        super().__init__(KnowledgeDocument, db)

    def create_document(
        self,
        tenant_id: UUID,
        title: str,
        doc_type: str,
        content: str,
        version: str = "1.0"
    ) -> KnowledgeDocument:
        doc = self.create(
            tenant_id=tenant_id,
            title=title,
            doc_type=doc_type,
            content=content,
            version=version
        )
        # Automatic chunking (paragraphs/sections)
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        for idx, p in enumerate(paragraphs):
            chunk = KnowledgeChunk(
                document_id=doc.id,
                chunk_index=idx,
                chunk_text=p,
                metadata_={"source_title": title, "doc_type": doc_type, "version": version}
            )
            self.db.add(chunk)
        self.db.commit()
        return doc

    def list_documents(self, tenant_id: UUID, doc_type: Optional[str] = None) -> List[KnowledgeDocument]:
        query = self.db.query(KnowledgeDocument).filter(KnowledgeDocument.tenant_id == tenant_id)
        if doc_type:
            query = query.filter(KnowledgeDocument.doc_type == doc_type)
        return query.all()

    def search_chunks(self, tenant_id: UUID, query: str, limit: int = 5) -> List[dict]:
        # Keyword-based retrieval with metadata citations
        terms = [t.lower() for t in query.split() if len(t) > 2]
        all_chunks = (
            self.db.query(KnowledgeChunk, KnowledgeDocument)
            .join(KnowledgeDocument, KnowledgeChunk.document_id == KnowledgeDocument.id)
            .filter(KnowledgeDocument.tenant_id == tenant_id)
            .all()
        )
        scored = []
        for chunk, doc in all_chunks:
            text_lower = chunk.chunk_text.lower()
            score = sum(1 for t in terms if t in text_lower)
            if score > 0 or not terms:
                scored.append({
                    "document_id": str(doc.id),
                    "document_title": doc.title,
                    "doc_type": doc.doc_type,
                    "version": doc.version,
                    "chunk_index": chunk.chunk_index,
                    "content": chunk.chunk_text,
                    "relevance_score": min(0.98, round(score * 0.25, 2)) if terms else 0.5
                })

        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored[:limit]
