import logging
import ast
from datetime import date, timedelta
from typing import Any, Dict
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..Database.programs import get_user_programs, get_program_by_id
from ..Database.users import find_user_by_id, set_users_active_program
from ..Database.workouts import get_workout_history
from ..middleware.authenticateToken import get_current_user

logger = logging.getLogger(__name__)

class ProgramIdRequest(BaseModel):
    program_id: UUID

## Endpoints scoped to the authenticated user
users_router = APIRouter(
    prefix="/users",
    tags=["users"]
)

def _get_owned_program(program_id: str | None, user_id: str) -> Dict[str, Any] | None:
    if not program_id:
        return None
    result = get_program_by_id(str(program_id))
    if not result["success"]:
        return None
    program = result["data"]
    if program.get("user_id") != user_id or program.get("deleted_at") is not None:
        return None
    return program

@users_router.get("/me", status_code=200)
async def get_current_user_profile(current_user_id: str = Depends(get_current_user)):
    user_data_response = find_user_by_id(current_user_id)
    if not user_data_response:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = ast.literal_eval(str(user_data_response))

    programs_response = get_user_programs(current_user_id)
    if not programs_response["success"]:
        logger.error("Failed to load programs: %s", programs_response.get("error"))
        raise HTTPException(status_code=500, detail="Failed to load programs")

    active_program = _get_owned_program(user_data.get("active_program"), current_user_id)

    return {
        "user_id": user_data["id"],
        "username": user_data["username"],
        "email": user_data["email"],
        "workout_streak": user_data.get("current_streak") or 0,
        "programs": programs_response["data"],
        "active_program": [active_program] if active_program else [],
        "workout_history": get_workout_history(current_user_id, date.today() - timedelta(days=365)),
    }

@users_router.put("/me/active-program", status_code=200)
async def set_active_program(payload: ProgramIdRequest, user_id: str = Depends(get_current_user)):
    program = _get_owned_program(str(payload.program_id), user_id)
    if program is None:
        raise HTTPException(status_code=404, detail="Program not found")

    update_response_data = set_users_active_program(program["id"], user_id)
    if not isinstance(update_response_data, list) or not update_response_data:
        logger.error("Failed to set active program: %s", update_response_data)
        raise HTTPException(status_code=500, detail="Failed to set active program")

    update_response = ast.literal_eval(str(update_response_data))

    return {
        "message": "active program set",
        "program_id": update_response[0]["active_program"]
    }
