from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.schemas.knowledge import (
    KnowledgeDocumentCreate, KnowledgeDocumentResponse,
    KnowledgeSearchRequest, KnowledgeSearchResponse, CitationResult
)
from app.repositories.knowledge import KnowledgeRepository
from agents.core.llm_provider import get_llm_provider

router = APIRouter()

# Seed mock guidance docs on module import
_SEEDED_DOCS = [
    {
        "title": "Commercial Property Underwriting Guidelines",
        "doc_type": "underwriting_guideline",
        "version": "2026.2",
        "content": """Section 1: General Property Eligibility
Commercial property applications require complete 5-year verifiable loss runs for accounts generating over $500,000 Total Insured Value (TIV).
Structures built prior to 1980 require certified electrical wiring updates and plumbing overhaul inspections.

Section 2: High Hazard Occupancy Restrictions
Facilities with spray paint booths or solvent storage must have NFPA-compliant automated fire suppression systems installed.
Woodworking and metal machining operations are subject to a standard $10,000 fire deductible."""
    },
    {
        "title": "Commercial Auto & Collision Claims Standard Operating Procedure",
        "doc_type": "claims_manual",
        "version": "v4.1",
        "content": """Section 1: First Notice of Loss (FNOL) Protocol
Adjusters must verify policy active status at time of collision before authorizing initial rental vehicle coverage.
Claims involving commercial trucks with gross vehicle weight exceeding 26,000 lbs require mandatory electronic logging device (ELD) telematics retrieval.

Section 2: Fraud Indicator Thresholds
Repairs estimated over $50,000 or exhibiting body shop billing rates exceeding 250% of regional mean require SIU referral.
Duplicate invoice numbers or identical photos matching prior loss files trigger immediate forensic freeze."""
    },
    {
        "title": "Policy Servicing & Endorsement Governance Manual",
        "doc_type": "policy_form",
        "version": "1.0",
        "content": """Section 1: Straight-Through Processing (STP) Limits
Address modifications, phone/email contact updates, and routine certificates of insurance are eligible for automated execution without underwriter sign-off.
Vehicle schedule additions up to 2 commercial vehicles per policy term may be processed with algorithmic rating validation.

Section 2: Underwriter Referral Rules
Policy limit increases, territory expansions across state lines, and addition of hazardous operations require binding authority sign-off from a Senior Underwriter."""
    }
]

@router.post("/documents", response_model=KnowledgeDocumentResponse)
async def create_document(
    payload: KnowledgeDocumentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = KnowledgeRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    doc = repo.create_document(
        tenant_id=tenant_id,
        title=payload.title,
        doc_type=payload.doc_type,
        content=payload.content,
        version=payload.version
    )
    return doc

@router.get("/documents", response_model=List[KnowledgeDocumentResponse])
async def list_documents(
    doc_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = KnowledgeRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    docs = repo.list_documents(tenant_id, doc_type=doc_type)
    if not docs:
        # Seed default knowledge docs into DB for tenant
        for d in _SEEDED_DOCS:
            repo.create_document(
                tenant_id=tenant_id,
                title=d["title"],
                doc_type=d["doc_type"],
                content=d["content"],
                version=d["version"]
            )
        docs = repo.list_documents(tenant_id, doc_type=doc_type)
    return docs

@router.post("/search", response_model=KnowledgeSearchResponse)
async def search_knowledge(
    payload: KnowledgeSearchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = KnowledgeRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    # Ensure documents exist
    existing = repo.list_documents(tenant_id)
    if not existing:
        for d in _SEEDED_DOCS:
            repo.create_document(
                tenant_id=tenant_id,
                title=d["title"],
                doc_type=d["doc_type"],
                content=d["content"],
                version=d["version"]
            )

    citations_raw = repo.search_chunks(tenant_id, payload.query, limit=payload.limit)
    
    # Optional LLM synthesis over citations
    synthesis = None
    if citations_raw:
        llm = get_llm_provider()
        context = "\n---\n".join([f"[{c['document_title']} v{c['version']}] {c['content']}" for c in citations_raw[:3]])
        synthesis = llm.complete(f"Synthesize insurance guidance based on retrieved evidence:\n{context}\n\nQuestion: {payload.query}")
    else:
        synthesis = "Insufficient evidence to answer from policy guidelines."

    return {
        "query": payload.query,
        "citations": citations_raw,
        "summary_synthesis": synthesis
    }
