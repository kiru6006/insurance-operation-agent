from typing import Dict, Any, List

REQUIRED_DOCUMENTS_BY_LOB = {
    "COMMERCIAL_PROPERTY": ["application", "loss_runs", "soval"],
    "GENERAL_LIABILITY": ["application", "loss_runs"],
    "WORKERS_COMP": ["application", "loss_runs", "payroll_audit"],
    "CYBER_SECURITY": ["application", "cyber_questionnaire"],
    "COMMERCIAL_AUTO": ["application", "mvr_records", "vehicle_schedule"]
}

class CompletenessAgent:
    def evaluate(self, submission_data: Dict[str, Any], documents: List[Dict[str, Any]]) -> Dict[str, Any]:
        lob = submission_data.get("line_of_business", "GENERAL_LIABILITY")
        required_types = REQUIRED_DOCUMENTS_BY_LOB.get(lob, ["application", "loss_runs"])
        
        present_types = {d.get("document_type", "").lower() for d in documents}
        
        missing_docs = [req for req in required_types if req not in present_types]
        is_complete = len(missing_docs) == 0

        completeness_score = round(float(len(required_types) - len(missing_docs)) / len(required_types), 2)

        return {
            "is_complete": is_complete,
            "completeness_score": completeness_score,
            "required_documents": required_types,
            "missing_documents": missing_docs,
            "present_documents": list(present_types),
            "recommendation": "Ready for underwriting review" if is_complete else f"Request missing documents: {', '.join(missing_docs)}"
        }

_completeness_instance = CompletenessAgent()

def completeness_agent(submission_data: Dict[str, Any], documents: List[Dict[str, Any]]) -> Dict[str, Any]:
    return _completeness_instance.evaluate(submission_data, documents)
