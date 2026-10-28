from typing import Dict, Any
from app.infrastructure.mock_systems import policy_system

class PolicyExecutionAgent:
    """
    Policy Execution & Endorsement Tool Agent:
    Applies authorized modifications to the policy system safely through deterministic API tools:
    - Mutates core policy data only if approved or straight-through eligible
    - Produces transaction receipt and confirmation notification payload
    """
    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        policy_id = input_data.get("policy_id", "POL-001")
        intent = input_data.get("intent") or input_data.get("request_type", "address_change")
        requested_changes = input_data.get("requested_changes", {})
        execute_direct = input_data.get("execute_update", True)
        requires_approval = input_data.get("requires_human_approval", False)

        updates_applied = False
        execution_status = "pending_approval" if requires_approval else "executed"

        if not requires_approval and execute_direct:
            # Execute tool mutation safely
            patch_data = {}
            if "new_address" in requested_changes:
                patch_data["address"] = requested_changes["new_address"]
            elif "contact_email" in requested_changes:
                patch_data["contact_email"] = requested_changes["contact_email"]
            elif "vehicle" in requested_changes:
                current_p = policy_system.get_policy(policy_id) or {}
                veh_list = list(current_p.get("vehicles", []))
                veh_list.append(requested_changes["vehicle"])
                patch_data["vehicles"] = veh_list

            if patch_data:
                policy_system.update_policy(policy_id, patch_data)
                updates_applied = True
            execution_status = "resolved"

        return {
            "policy_id": policy_id,
            "intent": intent,
            "execution_status": execution_status,
            "updates_applied": updates_applied,
            "confirmation_message": f"Policy modification [{intent}] processed successfully." if updates_applied else "Request queued for authorized review.",
            "transaction_timestamp": "2026-10-28T17:49:00Z"
        }

_agent_instance = PolicyExecutionAgent()

def policy_execution_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    return _agent_instance.run(state)
