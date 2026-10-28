from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.core.db import get_db
from app.core.deps import get_current_user

router = APIRouter()

@router.get("/process-maps")
async def get_process_maps(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Returns step-by-step breakdown of manual vs AI automated workflows
    as specified in Section 58 of Plan.md.
    """
    return {
        "commercial_underwriting": {
            "title": "Commercial Insurance Submission → Underwriting Decision Preparation",
            "benchmark_summary": {
                "manual_steps_before": 14,
                "automated_steps_after": 4,
                "systems_touched_before": 5,
                "systems_touched_after": 2,
                "human_handoffs_before": 3,
                "human_handoffs_after": 1,
                "processing_time_before": "31 minutes",
                "processing_time_after": "7 minutes",
                "manual_reduction_pct": 77.4
            },
            "steps_comparison": [
                { "step": 1, "manual": "Employee opens inbox and receives broker submission email", "automated": "Email intake webhook triggers agent ingestion", "type": "automated" },
                { "step": 2, "manual": "Downloads 3-5 PDF attachments to desktop folder", "automated": "Agent parses attachments into cloud object storage", "type": "automated" },
                { "step": 3, "manual": "Manually reads ACORD 125/126 form pages", "automated": "Intake Agent extracts structured applicant data via OCR", "type": "automated" },
                { "step": 4, "manual": "Copies applicant name and tax ID into CRM", "automated": "Agent cross-references CRM via REST tool call", "type": "automated" },
                { "step": 5, "manual": "Searches Policy Admin System for prior policies", "automated": "Agent queries Policy Admin System API automatically", "type": "automated" },
                { "step": 6, "manual": "Checks loss runs PDF for prior claim count", "automated": "Completeness Agent analyzes loss frequency & severity", "type": "automated" },
                { "step": 7, "manual": "Audits document completeness against checklist", "automated": "Completeness Agent calculates 0-100% audit score", "type": "automated" },
                { "step": 8, "manual": "Drafts manual email back to broker for missing documents", "automated": "Agent auto-generates missing info deficiency letter", "type": "automated" },
                { "step": 9, "manual": "Looks up NAICS / ISO appetite classification guide", "automated": "Risk Agent performs semantic appetite matching in RAG", "type": "automated" },
                { "step": 10, "manual": "Calculates baseline commercial rating factors", "automated": "Deterministic rating rule engine computes premium band", "type": "automated" },
                { "step": 11, "manual": "Copies data from PDF into rating excel spreadsheet", "automated": "Eliminated (Zero manual data re-entry)", "type": "eliminated" },
                { "step": 12, "manual": "Compiles underwriting decision briefing document", "automated": "Risk Summary Agent prepares executive underwriter dossier", "type": "automated" },
                { "step": 13, "manual": "Underwriter reviews compiled dossier and signs off", "automated": "Underwriter performs single-click approval in Inbox", "type": "human" },
                { "step": 14, "manual": "Sends formal quote/decline letter to broker", "automated": "System dispatches formal binder notification", "type": "automated" }
            ]
        },
        "claims_adjudication": {
            "title": "First Notice of Loss (FNOL) → Claims Adjudication",
            "benchmark_summary": {
                "manual_steps_before": 18,
                "automated_steps_after": 3,
                "systems_touched_before": 6,
                "systems_touched_after": 2,
                "human_handoffs_before": 4,
                "human_handoffs_after": 1,
                "processing_time_before": "45 minutes",
                "processing_time_after": "9 minutes",
                "manual_reduction_pct": 80.0
            },
            "steps_comparison": [
                { "step": 1, "manual": "Claims representative reads FNOL intake email", "automated": "Claims Intake Agent extracts incident timestamp & loss type", "type": "automated" },
                { "step": 2, "manual": "Opens policy administration system to check coverage", "automated": "Coverage Agent checks active policy dates & deductibles", "type": "automated" },
                { "step": 3, "manual": "Opens CMS to check prior claim history for claimant", "automated": "Duplicate Agent searches past claims for collision overlap", "type": "automated" },
                { "step": 4, "manual": "Reviews police report and repair shop estimates", "automated": "Fraud Agent computes inflation anomaly score", "type": "automated" },
                { "step": 5, "manual": "Calculates payable amount minus deductible manually", "automated": "Deterministic rule engine computes exact payout amount", "type": "automated" },
                { "step": 6, "manual": "Senior adjuster manually drafts payment authorization", "automated": "Low severity auto-approves; high severity routes to Inbox", "type": "human" }
            ]
        },
        "policy_servicing": {
            "title": "Policy Servicing & Endorsement Requests",
            "benchmark_summary": {
                "manual_steps_before": 11,
                "automated_steps_after": 2,
                "systems_touched_before": 4,
                "systems_touched_after": 1,
                "human_handoffs_before": 2,
                "human_handoffs_after": 0,
                "processing_time_before": "24 minutes",
                "processing_time_after": "2 minutes",
                "manual_reduction_pct": 91.7
            },
            "steps_comparison": [
                { "step": 1, "manual": "Service rep reads policyholder request email", "automated": "Intent Agent classifies endorsement category & changes", "type": "automated" },
                { "step": 2, "manual": "Verifies caller identity and policy ownership", "automated": "Eligibility Agent validates customer ID against PAS", "type": "automated" },
                { "step": 3, "manual": "Navigates 6 screens in legacy policy system to edit address", "automated": "Execution Agent calls PAS API directly (Level 3 STP)", "type": "automated" },
                { "step": 4, "manual": "Generates Certificate of Insurance (COI) PDF manually", "automated": "COI Generator auto-renders PDF with certificate holder", "type": "automated" },
                { "step": 5, "manual": "Drafts email confirmation back to insured", "automated": "Confirmation notice dispatched and logged to audit trail", "type": "automated" }
            ]
        }
    }
