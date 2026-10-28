import pytest
from agents.submission.intake import submission_intake_agent
from agents.submission.completeness import completeness_agent
from agents.submission.risk_summary import risk_summary_agent
from agents.submission.workflow import submission_workflow

def test_submission_intake_agent():
    state = {
        "email": "Submission: Apex Logistics Corp seeking COMMERCIAL_PROPERTY",
        "documents": [{"file_name": "acord125.pdf", "document_type": "application"}]
    }
    result = submission_intake_agent(state)
    assert result["applicant_name"] == "Apex Logistics Corp"
    assert result["line_of_business"] == "COMMERCIAL_PROPERTY"
    assert result["intake_status"] == "complete"

def test_completeness_agent():
    submission_data = {"line_of_business": "COMMERCIAL_PROPERTY"}
    # Only application provided, missing loss_runs and soval
    docs = [{"document_type": "application"}]
    result = completeness_agent(submission_data, docs)
    assert result["is_complete"] is False
    assert "loss_runs" in result["missing_documents"]

def test_risk_summary_agent():
    submission_data = {
        "applicant_name": "Pinnacle Construction LLC",
        "line_of_business": "COMMERCIAL_PROPERTY"
    }
    result = risk_summary_agent(submission_data, [])
    assert result["overall_severity"] == "high"
    assert len(result["risk_factors"]) >= 1

def test_full_workflow():
    payload = {
        "applicant_name": "Apex Logistics Corp",
        "line_of_business": "COMMERCIAL_PROPERTY",
        "email": "Apex Logistics Corp insurance submission for property",
        "documents": [
            {"document_type": "application"},
            {"document_type": "loss_runs"},
            {"document_type": "soval"}
        ]
    }
    wf_result = submission_workflow(payload)
    assert wf_result["status"] == "completed"
    assert wf_result["completeness"]["is_complete"] is True
    assert "ready_for_decision" in wf_result

def test_create_and_query_submission_api(client):
    # Obtain auth token
    login_res = client.post("/api/v1/auth/login", json={"username": "demo", "password": "demo"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List submissions
    list_res = client.get("/api/v1/submissions", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) > 0

    # Get single submission
    first_id = list_res.json()[0]["id"]
    get_res = client.get(f"/api/v1/submissions/{first_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == first_id

    # Test workflow status
    status_res = client.get(f"/api/v1/submissions/{first_id}/workflow-status", headers=headers)
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "completed"
