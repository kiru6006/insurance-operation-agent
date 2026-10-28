import pytest
from app.core.security import create_access_token
from uuid import uuid4

def test_operations_intelligence_process_maps(client):
    token = create_access_token(data={"sub": "test_user", "tenant_id": str(uuid4())})
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/operations-intelligence/process-maps", headers=headers)
    assert res.status_code == 200
    data = res.json()

    # Verify Commercial Underwriting process map has 14 manual steps compared with AI
    assert "commercial_underwriting" in data
    uw = data["commercial_underwriting"]
    assert uw["benchmark_summary"]["manual_steps_before"] == 14
    assert len(uw["steps_comparison"]) == 14
    assert uw["benchmark_summary"]["manual_reduction_pct"] > 70.0

    # Verify Claims Adjudication process map
    assert "claims_adjudication" in data
    assert data["claims_adjudication"]["benchmark_summary"]["manual_reduction_pct"] == 80.0
