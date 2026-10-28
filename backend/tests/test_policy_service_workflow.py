import pytest
from agents.policy_service.intent import policy_intent_agent
from agents.policy_service.eligibility import policy_eligibility_agent
from agents.policy_service.execution import policy_execution_agent
from agents.policy_service.workflow import policy_service_workflow

def test_policy_intent_agent_address():
    res = policy_intent_agent({
        "policy_id": "POL-001",
        "description": "We moved our warehouse facility to 850 Logistics Blvd, Joliet, IL"
    })
    assert res["intent"] == "address_change"
    assert res["intake_status"] == "complete"

def test_policy_eligibility_agent_autonomy_levels():
    # Low risk -> EXECUTE (Straight-Through Processing)
    low_res = policy_eligibility_agent({
        "policy_id": "POL-001",
        "intent": "address_change"
    })
    assert low_res["risk_tier"] == "LOW"
    assert low_res["autonomy_level"] == "EXECUTE"
    assert low_res["requires_human_approval"] is False

    # High risk -> ASSIST (Human sign-off required)
    high_res = policy_eligibility_agent({
        "policy_id": "POL-001",
        "intent": "endorsement"
    })
    assert high_res["risk_tier"] == "HIGH"
    assert high_res["autonomy_level"] == "ASSIST"
    assert high_res["requires_human_approval"] is True

def test_policy_service_workflow_straight_through():
    workflow_res = policy_service_workflow({
        "policy_id": "POL-001",
        "request_type": "address_change",
        "description": "Commercial relocation address update",
        "requested_changes": {"new_address": "850 Logistics Blvd, Joliet, IL"}
    })
    assert workflow_res["status"] == "resolved"
    assert workflow_res["autonomy_level"] == "EXECUTE"
    assert workflow_res["execution_outcome"]["updates_applied"] is True

def test_policy_service_workflow_human_approval():
    workflow_res = policy_service_workflow({
        "policy_id": "POL-001",
        "request_type": "endorsement",
        "description": "Add $5M excess umbrella liability coverage limit",
        "requested_changes": {"rider": "Umbrella_5M"}
    })
    assert workflow_res["status"] == "pending_approval"
    assert workflow_res["requires_human_approval"] is True
    assert workflow_res["execution_outcome"]["updates_applied"] is False

def test_policy_service_api_endpoints(client):
    # Obtain auth token
    login_res = client.post("/api/v1/auth/login", json={"username": "demo", "password": "demo"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List requests
    list_res = client.get("/api/v1/policy-service", headers=headers)
    assert list_res.status_code == 200
    requests = list_res.json()
    assert len(requests) > 0

    # Get single service request
    first_id = "PSR-001"
    get_res = client.get(f"/api/v1/policy-service/{first_id}", headers=headers)
    assert get_res.status_code == 200
    req_data = get_res.json()
    assert req_data["id"] == first_id

    # Process service request
    process_res = client.post(
        f"/api/v1/policy-service/{first_id}/process",
        json={"execute_update": True},
        headers=headers
    )
    assert process_res.status_code == 200
    proc_data = process_res.json()
    assert "status" in proc_data
    assert "autonomy_level" in proc_data["results"]

    # Check workflow status endpoint
    status_res = client.get(f"/api/v1/policy-service/{first_id}/workflow-status", headers=headers)
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "completed"
