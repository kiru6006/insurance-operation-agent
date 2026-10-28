from typing import Dict, Any, List
from agents.claims.intake import claims_intake_agent
from agents.claims.validation import claims_coverage_validation_agent
from agents.claims.fraud import claims_fraud_agent

def claims_workflow(claim_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    Orchestrates the Claims Adjudication Pipeline:
    1. Claims Intake Agent: Parses FNOL email / description, damages, location.
    2. Coverage Validation Agent: Checks active policy terms, limits, deductible.
    3. Fraud & Duplicate Detection Agent: Scans for duplicate invoices, excessive estimates, anomalies.
    4. Adjudication Synthesis: Computes final payout estimate, automated fast-track vs manual adjuster approval.
    """
    # Step 1: Intake
    intake_result = claims_intake_agent(claim_input)

    combined_input = {
        **claim_input,
        **intake_result
    }

    # Step 2: Coverage Validation
    coverage_result = claims_coverage_validation_agent(combined_input)

    # Step 3: Fraud & Duplicate Check
    fraud_result = claims_fraud_agent(combined_input)

    # Step 4: Adjudication Decision Synthesis
    requires_approval = (
        fraud_result["risk_tier"] in ["MEDIUM", "HIGH"] or
        coverage_result["requires_manual_review"] or
        combined_input.get("amount_claimed", 0.0) >= 10000.0
    )

    if fraud_result["risk_tier"] == "HIGH":
        decision = "REFERRED_TO_SIU"
        status = "investigation_required"
    elif not coverage_result["coverage_verified"]:
        decision = "DENIED_POLICY_INACTIVE"
        status = "denied"
    elif requires_approval:
        decision = "PENDING_ADJUSTER_APPROVAL"
        status = "under_review"
    else:
        decision = "AUTO_APPROVED_FAST_TRACK"
        status = "approved"

    return {
        "status": status,
        "decision": decision,
        "intake": intake_result,
        "coverage_validation": coverage_result,
        "fraud_assessment": fraud_result,
        "approved_payout_amount": coverage_result["net_payable_estimate"] if decision != "DENIED_POLICY_INACTIVE" else 0.0,
        "requires_human_approval": requires_approval
    }
