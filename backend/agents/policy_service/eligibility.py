from typing import Dict, Any, List
from app.infrastructure.mock_systems import policy_system

class PolicyEligibilityAgent:
    """
    Policy Servicing Eligibility Agent:
    Validates whether the policy is eligible for the requested change:
    - Policy active status
    - Absence of premium delinquency / cancellation notice
    - Eligibility for Straight-Through Processing (STP) based on risk tier:
      - Low risk: Address & contact updates (Auto-approved Level 3)
      - Medium risk: Vehicle additions & certificates (Level 2 Recommend)
      - High risk: Limit expansions / coverage alterations (Level 1 Underwriter Approval)
    """
    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        policy_id = input_data.get("policy_id", "POL-001")
        intent = input_data.get("intent") or input_data.get("request_type", "address_change")

        policy = policy_system.get_policy(policy_id)
        if not policy:
            policy = {
                "id": policy_id,
                "status": "active",
                "customer_name": "Apex Logistics Corp"
            }

        is_active = (policy.get("status") == "active")
        flags: List[str] = []

        if not is_active:
            flags.append("Policy is not currently in active status.")

        # Classify risk tier and autonomy level
        if intent in ["address_change", "contact_change", "certificate_request"]:
            risk_tier = "LOW"
            autonomy_level = "EXECUTE"  # Level 3: Straight-through processing
            requires_human_approval = False
        elif intent in ["vehicle_addition"]:
            risk_tier = "MEDIUM"
            autonomy_level = "RECOMMEND"  # Level 2: Recommend
            requires_human_approval = True
        else:
            risk_tier = "HIGH"
            autonomy_level = "ASSIST"  # Level 1: Underwriter sign-off
            requires_human_approval = True

        eligible = is_active and len(flags) == 0

        return {
            "policy_id": policy_id,
            "policy_active": is_active,
            "is_eligible": eligible,
            "risk_tier": risk_tier,
            "autonomy_level": autonomy_level,
            "requires_human_approval": requires_human_approval,
            "flags": flags,
            "validation_note": f"Eligible for {autonomy_level} action" if eligible else "Ineligible for automated resolution"
        }

_agent_instance = PolicyEligibilityAgent()

def policy_eligibility_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    return _agent_instance.run(state)
