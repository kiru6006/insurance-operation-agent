def test_login_demo(client):
    response = client.post("/api/v1/auth/login", json={
        "username": "demo",
        "password": "demo"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid(client):
    response = client.post("/api/v1/auth/login", json={
        "username": "wrong",
        "password": "wrong"
    })
    assert response.status_code == 401
