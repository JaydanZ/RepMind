from fastapi.testclient import TestClient

from backend.main import app
from backend.tests.conftest import TEST_ENV

ALLOWED_ORIGIN = TEST_ENV["CLIENT_URL"]
PROTECTED_PATH = "/api/v1/users/me"

client = TestClient(app)


def test_auth_401_carries_cors_headers_for_allowed_origin():
    # The frontend refreshes tokens on 401, which it can only see if CORS allows the response
    response = client.get(PROTECTED_PATH, headers={"Origin": ALLOWED_ORIGIN})

    assert response.status_code == 401
    assert response.headers["access-control-allow-origin"] == ALLOWED_ORIGIN
    assert response.headers["access-control-allow-credentials"] == "true"


def test_auth_401_has_no_cors_headers_for_other_origins():
    response = client.get(PROTECTED_PATH, headers={"Origin": "https://evil.example"})

    assert response.status_code == 401
    assert "access-control-allow-origin" not in response.headers


def test_preflight_to_protected_route_succeeds_without_token():
    response = client.options(PROTECTED_PATH, headers={
        "Origin": ALLOWED_ORIGIN,
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Authorization",
    })

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == ALLOWED_ORIGIN
