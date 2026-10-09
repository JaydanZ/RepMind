import jwt
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.routes import programs as programs_routes
from backend.utils.limiter import limiter
from backend.utils.programGenerator import ProgramGenerationError

PROGRAM_ID = "6f1c2c1e-8d0a-4c6b-9a43-2f7d5c1b9e10"

VALID_PROGRAM = {
    "program_name": "Upper / Lower",
    "program_structure": [{
        "day": "Monday",
        "focus": "Upper",
        "exercises": [{"name": "Bench Press", "sets": 3, "reps": 8, "exercise_tip": ""}],
    }],
}


def auth_header(user_id):
    token = jwt.encode({"sub": user_id}, "test-jwt-secret-key-that-is-long-enough", algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def client(monkeypatch):
    saved = []

    def fake_update(program_id, user_id, program_import):
        saved.append(program_import)
        return {"success": True, "data": [{"id": program_id}]}

    def fake_insert(program_import, user_id):
        saved.append(program_import)
        return {"success": True, "message": "Program imported", "program_id": PROGRAM_ID}

    monkeypatch.setattr(programs_routes, "update_program", fake_update)
    monkeypatch.setattr(programs_routes, "insert_program_from_import", fake_insert)
    limiter.reset()

    test_client = TestClient(app)
    test_client.saved = saved
    return test_client


def put_program(client, body, user_id="user-1"):
    return client.put(f"/api/v1/programs/{PROGRAM_ID}", json=body, headers=auth_header(user_id))


def import_program(client, body, user_id="user-1"):
    return client.post("/api/v1/programs/import", json=body, headers=auth_header(user_id))


@pytest.mark.parametrize("save", [put_program, import_program], ids=["PUT", "import"])
def test_saves_a_valid_program(client, save):
    response = save(client, VALID_PROGRAM)

    assert response.status_code in (200, 201)
    assert len(client.saved) == 1


@pytest.mark.parametrize("save", [put_program, import_program], ids=["PUT", "import"])
def test_rejects_an_invalid_program_without_saving(client, save):
    duplicate_days = {
        **VALID_PROGRAM,
        "program_structure": VALID_PROGRAM["program_structure"] * 2,
    }

    response = save(client, duplicate_days)

    assert response.status_code == 422
    assert client.saved == []


@pytest.mark.parametrize("save", [put_program, import_program], ids=["PUT", "import"])
def test_limits_each_user_to_one_save_every_five_seconds(client, save):
    assert save(client, VALID_PROGRAM).status_code in (200, 201)
    assert save(client, VALID_PROGRAM).status_code == 429
    # A different user on the same network has their own limit
    assert save(client, VALID_PROGRAM, user_id="user-2").status_code in (200, 201)
    assert len(client.saved) == 2


def test_generation_failure_returns_502(client, monkeypatch):
    def failing_generator(program_input):
        raise ProgramGenerationError("invalid output")

    monkeypatch.setattr(programs_routes, "generate_program", failing_generator)

    response = client.post("/api/v1/programs/generate", json={
        "fitness_goal": "Strength",
        "years_of_experience": "1-2",
        "days_per_week": "3",
        "age": 25,
        "weight": 180,
        "weight_unit": "lb",
        "gender": "Male",
        "isLoggedIn": True,
        "freeLimitEnabled": False,
    })

    assert response.status_code == 502
    assert response.json()["detail"] == "Couldn't generate a valid program"
