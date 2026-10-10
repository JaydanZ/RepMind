import bcrypt
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.routes import auth as auth_routes

TOO_LONG = "x" * 73


@pytest.fixture
def client(monkeypatch):
    inserted = []
    monkeypatch.setattr(auth_routes, "find_user_by_email", lambda email: None)
    monkeypatch.setattr(auth_routes, "insert_user", inserted.append)
    test_client = TestClient(app)
    test_client.inserted = inserted  # type: ignore[attr-defined]
    return test_client


def test_register_rejects_passwords_over_72_bytes(client):
    response = client.post("/api/v1/auth/register", json={
        "username": "lifter", "email": "lifter@example.com", "password": TOO_LONG,
    })

    assert response.status_code == 400
    assert client.inserted == []


def test_register_counts_bytes_not_characters(client):
    # 24 three-byte characters = 72 bytes is allowed; 25 = 75 bytes is not
    ok = client.post("/api/v1/auth/register", json={
        "username": "lifter", "email": "lifter@example.com", "password": "€" * 24,
    })
    too_long = client.post("/api/v1/auth/register", json={
        "username": "lifter", "email": "lifter@example.com", "password": "€" * 25,
    })

    assert ok.status_code == 201
    assert too_long.status_code == 400


def test_login_with_password_over_72_bytes_is_invalid_credentials(client, monkeypatch):
    user = {"id": "user-1", "email": "lifter@example.com", "username": "lifter",
            "password": bcrypt.hashpw(b"real-password", bcrypt.gensalt(4)).decode()}
    monkeypatch.setattr(auth_routes, "find_user_by_email", lambda email: user)

    response = client.post("/api/v1/auth/login", json={"email": "lifter@example.com", "password": TOO_LONG})

    assert response.status_code == 401
