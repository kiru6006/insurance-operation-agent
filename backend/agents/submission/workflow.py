from typing import Dict, Any, List
from agents.submission.intake import submission_intake_agent
from agents.submission.completeness import completeness_agent
from agents.submission.risk_summary import risk_summary_agent

def submission_workflow(submission_input: Dict[str, Any]) -> Dict[str, Any]:
    """Chains submission_intake -> completeness -> risk_summary agents."""
    # Step 1: Intake Agent (extracts structured entities)
    intake_result = submission_intake_agent({
        "email": submission_input.get("email", ""),
        "documents": submission_input.get("documents", [])
    })

    combined_data = {
        **submission_input,
        **intake_result
    }

    # Step 2: Completeness Agent (evaluates documentation requirements)
    documents = submission_input.get("documents", [])
    completeness_result = completeness_agent(combined_data, documents)

    # Step 3: Risk Summary Agent (evaluates underwriting risk vectors)
    risk_result = risk_summary_agent(combined_data, documents)

    return {
        "status": "completed",
        "intake": intake_result,
        "completeness": completeness_result,
        "risk_summary": risk_result,
        "ready_for_decision": completeness_result["is_complete"] and risk_result["overall_severity"] != "high"
    }
