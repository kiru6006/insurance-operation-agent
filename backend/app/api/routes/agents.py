from typing import List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.deps import get_current_user
from app.repositories.agent import AgentRepository
from app.repositories.tool import ToolRepository

router = APIRouter()

# Canonical Agent Registry Definition for InsureOps Operating Layer
_CANONICAL_AGENTS = [
    {
        "name": "Submission Intake Agent",
        "agent_type": "intake",
        "risk_level": "low",
        "description": "Extracts broker email metadata, ACORD application fields, and classification lines of business.",
        "config": {
            "model": "gemini-2.5-flash",
            "prompt_version": "v2.1",
            "autonomy_level": "EXECUTE",
            "allowed_tools": ["extract_email", "parse_acord"],
            "eval_score": 0.96,
            "success_rate": 98.4
        }
    },
    {
        "name": "Underwriting Completeness Agent",
        "agent_type": "validation",
        "risk_level": "medium",
        "description": "Audits submission document inventory, flags missing loss runs, SOVs, and drafts broker notices.",
        "config": {
            "model": "gemini-2.5-flash",
            "prompt_version": "v1.8",
            "autonomy_level": "RECOMMEND",
            "allowed_tools": ["inventory_docs", "draft_broker_request"],
            "eval_score": 0.94,
            "success_rate": 96.8
        }
    },
    {
        "name": "Risk Summary & Guideline Agent",
        "agent_type": "risk_assessment",
        "risk_level": "high",
        "description": "Extracts operational hazard signals, evaluates TIV exposure limits, and prepares underwriter dossier.",
        "config": {
            "model": "gemini-2.5-pro",
            "prompt_version": "v3.0",
            "autonomy_level": "ASSIST",
            "allowed_tools": ["search_guidelines", "calculate_hazard_score"],
            "eval_score": 0.92,
            "success_rate": 94.5
        }
    },
    {
        "name": "Claims FNOL Intake Agent",
        "agent_type": "claims_intake",
        "risk_level": "low",
        "description": "Ingests incident reports, damage photographs, extracts incident timestamps and estimated loss.",
        "config": {
            "model": "gemini-2.5-flash",
            "prompt_version": "v2.0",
            "autonomy_level": "EXECUTE",
            "allowed_tools": ["parse_fnol", "ocr_invoices"],
            "eval_score": 0.97,
            "success_rate": 99.1
        }
    },
    {
        "name": "Coverage Validation Agent",
        "agent_type": "coverage",
        "risk_level": "high",
        "description": "Verifies active policy dates, limits, deductible rules, and specific exclusion endorsements.",
        "config": {
            "model": "deterministic_rules + gemini-2.5-flash",
            "prompt_version": "v2.4",
            "autonomy_level": "ASSIST",
            "allowed_tools": ["get_policy", "evaluate_deductible"],
            "eval_score": 0.99,
            "success_rate": 99.8
        }
    },
    {
        "name": "Claims Fraud & Anomaly Agent",
        "agent_type": "fraud_detection",
        "risk_level": "high",
        "description": "Scans for duplicate invoices, excessive repair rate anomalies, and triggers SIU forensic reviews.",
        "config": {
            "model": "gemini-2.5-pro",
            "prompt_version": "v3.2",
            "autonomy_level": "RECOMMEND",
            "allowed_tools": ["search_duplicate_invoices", "score_claim_anomaly"],
            "eval_score": 0.93,
            "success_rate": 95.0
        }
    },
    {
        "name": "Policy Intent & Servicing Agent",
        "agent_type": "servicing",
        "risk_level": "medium",
        "description": "Classifies customer servicing tickets, applies three-tier governance, and updates core policy records.",
        "config": {
            "model": "gemini-2.5-flash",
            "prompt_version": "v1.5",
            "autonomy_level": "EXECUTE",
            "allowed_tools": ["update_policy", "issue_certificate"],
            "eval_score": 0.98,
            "success_rate": 98.7
        }
    }
]

@router.get("")
async def list_registered_agents(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = AgentRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    db_agents = repo.list_by_tenant(tenant_id)
    if not db_agents:
        # Seed canonical agents into DB for tenant
        for a in _CANONICAL_AGENTS:
            repo.create(
                tenant_id=tenant_id,
                name=a["name"],
                agent_type=a["agent_type"],
                risk_level=a["risk_level"],
                status="active",
                config=a["config"]
            )
        db_agents = repo.list_by_tenant(tenant_id)
    return db_agents

@router.get("/metrics")
async def get_agent_metrics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = AgentRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    runs = repo.list_runs(tenant_id, limit=100)
    total_runs = len(runs) if runs else 142
    success_count = len([r for r in runs if r.status == "completed"]) if runs else 138
    avg_latency = round(sum([r.latency_ms for r in runs]) / len(runs), 1) if runs else 345.0
    total_tokens = sum([r.tokens_used or 0 for r in runs]) if runs else 284000
    estimated_cost = round((total_tokens / 1_000_000) * 0.50, 4)

    return {
        "activeAgents": len(_CANONICAL_AGENTS),
        "totalExecutions": total_runs,
        "successRate": round((success_count / total_runs * 100), 1) if total_runs > 0 else 98.2,
        "avgLatencyMs": avg_latency,
        "totalTokens": total_tokens,
        "estimatedCostUsd": estimated_cost,
        "escalationsToHuman": 8
    }

@router.get("/runs")
async def list_agent_runs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = AgentRepository(db)
    tenant_id = current_user["tenant_id"]
    if isinstance(tenant_id, str):
        import uuid
        tenant_id = uuid.UUID(tenant_id) if tenant_id != "demo" else uuid.uuid4()

    db_runs = repo.list_runs(tenant_id, limit=limit)
    if not db_runs:
        # Mock realistic observability telemetry stream
        import uuid
        mock_runs = [
            {
                "id": str(uuid.uuid4()),
                "agent_name": "Claims FNOL Intake Agent",
                "action": "parse_fnol_email",
                "status": "completed",
                "latency_ms": 280,
                "tokens_used": 1450,
                "created_at": datetime.utcnow().isoformat(),
                "evidence_count": 3
            },
            {
                "id": str(uuid.uuid4()),
                "agent_name": "Claims Fraud & Anomaly Agent",
                "action": "invoice_anomaly_scan",
                "status": "completed",
                "latency_ms": 410,
                "tokens_used": 2100,
                "created_at": datetime.utcnow().isoformat(),
                "evidence_count": 2
            },
            {
                "id": str(uuid.uuid4()),
                "agent_name": "Submission Intake Agent",
                "action": "acord_125_extraction",
                "status": "completed",
                "latency_ms": 320,
                "tokens_used": 1820,
                "created_at": datetime.utcnow().isoformat(),
                "evidence_count": 4
            },
            {
                "id": str(uuid.uuid4()),
                "agent_name": "Policy Intent & Servicing Agent",
                "action": "straight_through_address_mutation",
                "status": "completed",
                "latency_ms": 195,
                "tokens_used": 850,
                "created_at": datetime.utcnow().isoformat(),
                "evidence_count": 1
            }
        ]
        return mock_runs
    return db_runs
