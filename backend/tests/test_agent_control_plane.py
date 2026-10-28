import pytest

def test_agent_control_plane_registry_and_metrics(client):
    login_res = client.post("/api/v1/auth/login", json={"username": "demo", "password": "demo"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. List registered agents in control plane
    agents_res = client.get("/api/v1/agents", headers=headers)
    assert agents_res.status_code == 200
    agent_list = agents_res.json()
    assert len(agent_list) >= 7
    # Verify core attributes from control plane specification
    first_agent = agent_list[0]
    assert "name" in first_agent
    assert "risk_level" in first_agent
    assert "config" in first_agent

    # 2. Agent control plane observability metrics
    metrics_res = client.get("/api/v1/agents/metrics", headers=headers)
    assert metrics_res.status_code == 200
    metrics = metrics_res.json()
    assert "activeAgents" in metrics
    assert "successRate" in metrics
    assert "avgLatencyMs" in metrics

    # 3. Agent execution run stream
    runs_res = client.get("/api/v1/agents/runs", headers=headers)
    assert runs_res.status_code == 200
    runs = runs_res.json()
    assert len(runs) > 0
    assert "agent_name" in runs[0] or "agent_id" in runs[0]
