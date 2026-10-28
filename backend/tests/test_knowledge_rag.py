import pytest

def test_knowledge_base_crud_and_search(client):
    # Obtain auth token
    login_res = client.post("/api/v1/auth/login", json={"username": "demo", "password": "demo"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. List seeded knowledge documents
    docs_res = client.get("/api/v1/knowledge/documents", headers=headers)
    assert docs_res.status_code == 200
    docs = docs_res.json()
    assert len(docs) >= 3

    # 2. Add custom knowledge document
    create_payload = {
        "title": "Inland Marine Specialty Endorsement Guidelines",
        "doc_type": "underwriting_guideline",
        "version": "2026.1",
        "content": "Specialty cargo transit exceeding $250,000 requires GPS temperature and vibration tracking."
    }
    create_res = client.post("/api/v1/knowledge/documents", json=create_payload, headers=headers)
    assert create_res.status_code == 200
    new_doc = create_res.json()
    assert new_doc["title"] == create_payload["title"]

    # 3. Search knowledge base with citation retrieval
    search_res = client.post(
        "/api/v1/knowledge/search",
        json={"query": "What are fire suppression requirements for spray paint booths?"},
        headers=headers
    )
    assert search_res.status_code == 200
    search_data = search_res.json()
    assert len(search_data["citations"]) > 0
    # Top citation should be property underwriting guideline
    assert any("spray paint" in c["content"].lower() for c in search_data["citations"])
    assert search_data["summary_synthesis"] is not None
