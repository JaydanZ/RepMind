import logging
import ast
from datetime import date, timedelta
from typing import Any, Dict
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from ..models.programGeneration import ProgramOptions
from ..utils.programGenerator import generate_program
from ..models.programs import ProgramImport
from ..Database.programs import (
    insert_program_from_import,
    get_user_programs,
    get_program_by_id,
    delete_program
)
from ..Database.users import find_user_by_id, set_users_active_program
from ..Database.workouts import get_workout_history
from ..middleware.authenticateToken import get_current_user
from ..utils.limiter import limiter

logger = logging.getLogger(__name__)

class ProgramIdRequest(BaseModel):
    program_id: UUID

## Endpoint to handle ai program generation with / without authentication
programs_router = APIRouter(
    prefix="/programs",
    tags=["programs"]
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

@programs_router.get("/", status_code=200)
async def get_programs_overview(current_user_id: str = Depends(get_current_user)):
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

@programs_router.post("/active", status_code=200)
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
        "program_id": update_response[0]["active_program"],
        "status": 201
    }

@programs_router.delete("/delete", status_code=200)
async def delete_program_route(payload: ProgramIdRequest, user_id: str = Depends(get_current_user)):
    program_id = str(payload.program_id)
    response = delete_program(program_id, user_id)
    if not response["success"]:
        logger.error("Failed to delete program: %s", response.get("error"))
        raise HTTPException(status_code=500, detail="Failed to delete program")

    if not response["data"]:
        raise HTTPException(status_code=404, detail="Program not found")

    # Soft deletes don't trigger the FK's ON DELETE SET NULL, so clear it here
    user_data_response = find_user_by_id(user_id) or {}
    user_data = ast.literal_eval(str(user_data_response))
    
    if user_data.get("active_program") == program_id:
        set_users_active_program(None, user_id)

    return {
        "message": "program deleted",
        "program_id": program_id,
        "status": 200
    }

@programs_router.post('/generation', status_code=201)
@limiter.limit("5/minute")
def handleProgramGeneration(request: Request, programInput: ProgramOptions):
    ## Check if free limit is enabled -> means user is not logged in
    if(programInput.freeLimitEnabled == True):
        raise HTTPException(status_code=401, detail="User must login to continue using API")
    content = generate_program(programInput)
    return content

@programs_router.post('/import', status_code=201)
def handleProgramImport(
    programImport: ProgramImport,
    current_user_id: str = Depends(get_current_user)
):
    # Insert the program into the database
    result = insert_program_from_import(programImport, current_user_id)

    if not result["success"]:
        # Log details server-side; don't leak database errors to the client
        logger.error("Failed to import program: %s", result.get("error"))
        raise HTTPException(status_code=500, detail="Failed to import program")

    return {
        "message": result["message"],
        "program_id": result["program_id"],
        "status": 201
    }
