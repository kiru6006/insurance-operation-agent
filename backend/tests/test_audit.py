import pytest
from uuid import uuid4
from app.core.security import create_access_token
from app.models import AuditEvent

def test_audit_list_and_summary(client, db):
    tenant_id = uuid4()
    token = create_access_token(data={"sub": "test_user", "tenant_id": str(tenant_id)})
    headers = {"Authorization": f"Bearer {token}"}

    # Seed an event in test DB
    event = AuditEvent(
        tenant_id=tenant_id,
        actor_type="agent",
        actor_id="AGENT-UW-COMPLETE",
        action="execute_completeness_audit",
        entity_type="submission",
        entity_id="SUB-999",
        result="success",
        metadata_={"score": 95, "missing": []}
    )
    db.add(event)
    db.commit()

    # Query events
    res = client.get("/api/v1/audit", headers=headers)
    assert res.status_code == 200
    events = res.json()
    assert isinstance(events, list)
    assert len(events) >= 1
    assert any(e["entity_id"] == "SUB-999" for e in events)

    # Query summary
    summary_res = client.get("/api/v1/audit/summary", headers=headers)
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["compliance_score"] >= 95.0
    assert "agent" in summary["by_actor"]
