import json
from typing import Dict, Any
from agents.core.llm_provider import get_llm_provider

class PolicyIntentAgent:
    """
    Policy Service Intent & Entity Agent:
    Classifies incoming policy service requests into standard intents:
    - ADDRESS_CHANGE (low risk, eligible for straight-through processing)
    - CONTACT_CHANGE (low risk, straight-through processing)
    - VEHICLE_ADDITION (medium risk, endorsement pricing adjustment)
    - CERTIFICATE_REQUEST (low risk, instant automated generation)
    - COVERAGE_ENDORSEMENT (high risk, underwriter sign-off required)
    """
    def __init__(self):
        self.llm = get_llm_provider()

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        text = input_data.get("description") or input_data.get("request_text", "")
        policy_id = input_data.get("policy_id", "POL-001")
        request_type = input_data.get("request_type")

        # Deterministic inference or LLM classification
        inferred_type = request_type
        if not inferred_type or inferred_type == "general":
            lower_text = text.lower()
            if "address" in lower_text or "relocation" in lower_text or "move" in lower_text:
                inferred_type = "address_change"
            elif "contact" in lower_text or "email" in lower_text or "phone" in lower_text:
                inferred_type = "contact_change"
            elif "vehicle" in lower_text or "truck" in lower_text or "car" in lower_text:
                inferred_type = "vehicle_addition"
            elif "certificate" in lower_text or "coi" in lower_text:
                inferred_type = "certificate_request"
            else:
                inferred_type = "endorsement"

        prompt = f"""Analyze customer policy servicing request:
Policy ID: {policy_id}
Request: {text}
Classify intent into: address_change, contact_change, vehicle_addition, certificate_request, endorsement.
Provide JSON with intent, extracted_entities, and summary."""
        llm_response = self.llm.complete(prompt)
        try:
            parsed = json.loads(llm_response)
        except Exception:
            parsed = {}

        return {
            "policy_id": policy_id,
            "intent": parsed.get("intent", inferred_type),
            "summary": parsed.get("summary", text or f"Servicing request for {inferred_type}"),
            "confidence": 0.95,
            "intake_status": "complete"
        }

_agent_instance = PolicyIntentAgent()

def policy_intent_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    return _agent_instance.run(state)
