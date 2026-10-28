import pytest
from agents.claims.intake import claims_intake_agent
from agents.claims.validation import claims_coverage_validation_agent
from agents.claims.fraud import claims_fraud_agent
from agents.claims.workflow import claims_workflow

def test_claims_intake_agent():
    state = {
        "email_text": "From: claims@apex.com\nFNOL incident on loading dock. Forklift backed into warehouse shutter.",
        "amount_claimed": 5200.0,
        "policy_id": "POL-001",
        "claimant_name": "Apex Logistics Corp",
        "incident_location": "Chicago, IL",
        "documents": [{"file_name": "dock_damage.jpg"}]
    }
    result = claims_intake_agent(state)
    assert result["intake_status"] == "completed"
    assert result["estimated_damage"] == 5200.0
    assert result["document_count"] == 1

def test_claims_coverage_validation_agent():
    state = {
        "policy_id": "POL-001",
        "amount_claimed": 18250.0,
        "incident_date": "2026-10-15T08:30:00"
    }
    result = claims_coverage_validation_agent(state)
    assert result["coverage_verified"] is True
    assert result["net_payable_estimate"] == 17750.0  # 18250 - 500 deductible on POL-001
    assert result["coverage_status"] == "covered"

def test_claims_fraud_agent_low_risk():
    state = {
        "amount_claimed": 4500.0,
        "is_suspicious": False,
        "description": "Standard rear bumper replacement estimate",
        "documents": [{"file_name": "estimate.pdf"}]
    }
    result = claims_fraud_agent(state)
    assert result["risk_tier"] == "LOW"
    assert result["fast_track_eligible"] is True

def test_claims_fraud_agent_high_risk():
    state = {
        "amount_claimed": 65000.0,
        "is_suspicious": True,
        "description": "ANOMALY DETECTED: Similar invoice submitted under different policy",
        "documents": []
    }
    result = claims_fraud_agent(state)
    assert result["risk_tier"] == "HIGH"
    assert result["recommendation"] == "FLAG_FOR_SPECIAL_INVESTIGATION_UNIT"
    assert any(s["signal_type"] == "DUPLICATE_OR_INFLATED_INVOICE" for s in result["signals"])

def test_claims_workflow_auto_approval():
    claim_input = {
        "policy_id": "POL-001",
        "amount_claimed": 4500.0,
        "claim_type": "auto_collision",
        "description": "Minor dent repair",
        "documents": [{"file_name": "repair_quote.pdf"}]
    }
    wf = claims_workflow(claim_input)
    assert wf["status"] == "approved"
    assert wf["decision"] == "AUTO_APPROVED_FAST_TRACK"
    assert wf["requires_human_approval"] is False
    assert wf["approved_payout_amount"] > 0

def test_claims_workflow_referral():
    claim_input = {
        "policy_id": "POL-001",
        "amount_claimed": 85000.0,
        "claim_type": "fire_damage",
        "is_suspicious": True,
        "description": "ANOMALY DETECTED: Disproportionate loss statement",
        "documents": []
    }
    wf = claims_workflow(claim_input)
    assert wf["status"] == "investigation_required"
    assert wf["decision"] == "REFERRED_TO_SIU"
    assert wf["requires_human_approval"] is True

def test_claims_api_endpoints(client):
    # Obtain auth token
    login_res = client.post("/api/v1/auth/login", json={"username": "demo", "password": "demo"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List claims
    list_res = client.get("/api/v1/claims", headers=headers)
    assert list_res.status_code == 200
    claims = list_res.json()
    assert len(claims) > 0

    # Get single claim details
    get_res = client.get("/api/v1/claims/CLM-001", headers=headers)
    assert get_res.status_code == 200
    claim_detail = get_res.json()
    assert claim_detail["id"] == "CLM-001"
    assert len(claim_detail["documents"]) > 0

    # Run adjudication
    adj_res = client.post("/api/v1/claims/CLM-001/adjudicate", json={"run_fraud_check": True}, headers=headers)
    assert adj_res.status_code == 200
    adj_data = adj_res.json()
    assert "status" in adj_data
    assert "decision" in adj_data["results"]

    # Check workflow status endpoint
    status_res = client.get("/api/v1/claims/CLM-001/workflow-status", headers=headers)
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "completed"
