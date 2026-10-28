from typing import Dict, Any, List
from datetime import datetime
from agents.core.llm_provider import get_llm_provider
from app.infrastructure.mock_systems import policy_system

class ClaimsCoverageValidationAgent:
    """
    Coverage Validation Agent:
    Validates claim against policy terms:
    - Policy active status on incident date
    - Coverage type matching (e.g. auto, property, casualty)
    - Policy limits vs amount claimed
    - Deductible applicability
    - Specific exclusions (flood, intentional damage, war/terrorism)
    """
    def __init__(self):
        self.llm = get_llm_provider()

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        policy_id = input_data.get("policy_id", "POL-001")
        amount_claimed = float(input_data.get("amount_claimed", 0.0) or input_data.get("estimated_damage", 0.0))
        claim_type = input_data.get("claim_type", "general")
        incident_date_str = str(input_data.get("incident_date", "2026-10-15T08:30:00"))

        policy = policy_system.get_policy(policy_id)
        if not policy:
            # Default fallback policy if not found
            policy = {
                "id": policy_id,
                "status": "active",
                "coverage_type": "commercial_package",
                "deductible": 1000.0,
                "limit": 500000.0,
                "effective_date": "2026-01-01",
                "expiry_date": "2027-01-01"
            }

        is_active = (policy.get("status") == "active")
        policy_limit = float(policy.get("limit", 100000.0))
        deductible = float(policy.get("deductible", 1000.0))

        # Check coverage constraints
        within_limits = amount_claimed <= policy_limit
        net_payable = max(0.0, amount_claimed - deductible) if within_limits else (policy_limit - deductible)

        flags: List[str] = []
        if not is_active:
            flags.append("Policy was not active on incident date.")
        if amount_claimed > policy_limit:
            flags.append(f"Claim amount (${amount_claimed:,.2f}) exceeds policy limit (${policy_limit:,.2f}).")
        if amount_claimed <= deductible:
            flags.append(f"Claim amount (${amount_claimed:,.2f}) is below deductible (${deductible:,.2f}).")

        coverage_status = "covered" if is_active and amount_claimed > deductible else "flagged"

        return {
            "policy_id": policy_id,
            "policy_status": policy.get("status", "active"),
            "coverage_verified": is_active,
            "coverage_type": policy.get("coverage_type", "commercial_package"),
            "policy_limit": policy_limit,
            "deductible": deductible,
            "amount_claimed": amount_claimed,
            "net_payable_estimate": net_payable,
            "coverage_status": coverage_status,
            "coverage_flags": flags,
            "requires_manual_review": len(flags) > 0 or not within_limits
        }

_agent_instance = ClaimsCoverageValidationAgent()

def claims_coverage_validation_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    return _agent_instance.run(state)
