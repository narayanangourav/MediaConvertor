import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Media Converter API is running"}

@pytest.mark.skip(reason="Requires proper bcrypt backend configuration or database setup")
def test_signup_flow():
    # 1. Signup
    signup_data = {
        "email": "pytest_user@example.com",
        "password": "testpassword123"
    }
    response = client.post("/signup", json=signup_data)
    # If user exists from previous run, it might fail with 400, which is fine for now or we should clean up
    if response.status_code == 400:
        assert response.json()["detail"] == "Email already registered"
    else:
        assert response.status_code == 200
        assert "access_token" in response.json()

    # 2. Login
    login_data = {
        "username": "pytest_user@example.com",
        "password": "testpassword123"
    }
    response = client.post("/token", data=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]
    assert token is not None

    # 3. Access Protected Route
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/my-files", headers=headers)
    assert response.status_code == 200
    assert "files" in response.json()
