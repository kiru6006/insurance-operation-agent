from typing import Dict, Any
from agents.policy_service.intent import policy_intent_agent
from agents.policy_service.eligibility import policy_eligibility_agent
from agents.policy_service.execution import policy_execution_agent

def policy_service_workflow(request_input: Dict[str, Any]) -> Dict[str, Any]:
    """
    Orchestrates the Policy Servicing Pipeline:
    1. Intent Agent: Classifies requested action (address change, contact update, vehicle add, COI, endorsement).
    2. Eligibility Agent: Validates active policy standing and applies three-tier autonomy governance.
    3. Execution Agent: Mutates policy record via secure backend tool (Level 3 straight-through) or routes to Approvals (Level 1/2).
    """
    # Step 1: Detect intent and extract changes
    intent_result = policy_intent_agent(request_input)

    combined_input = {
        **request_input,
        "intent": intent_result["intent"],
        "summary": intent_result["summary"]
    }

    # Step 2: Validate eligibility and check autonomy boundaries
    eligibility_result = policy_eligibility_agent(combined_input)

    combined_input["requires_human_approval"] = eligibility_result["requires_human_approval"]
    combined_input["autonomy_level"] = eligibility_result["autonomy_level"]

    # Step 3: Execute policy change if straight-through eligible
    execution_result = policy_execution_agent(combined_input)

    final_status = "resolved" if execution_result["execution_status"] == "resolved" else "pending_approval"

    return {
        "status": final_status,
        "intent_classification": intent_result,
        "eligibility_validation": eligibility_result,
        "execution_outcome": execution_result,
        "requires_human_approval": eligibility_result["requires_human_approval"],
        "autonomy_level": eligibility_result["autonomy_level"]
    }
