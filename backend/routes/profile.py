from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from ..Database.programs import get_user_programs, get_program_by_id
from ..Database.users import find_user_by_id
from ..middleware.authenticateToken import get_current_user
from ..models.programs import WorkoutProgram
from ..Database.users import set_users_active_program
import ast

profile_router = APIRouter(
    prefix="/profile",
    tags=['profile']
)

@profile_router.get("/",status_code=200)
async def get_profile_data(current_user_id: str = Depends(get_current_user)):
    programs_response = get_user_programs(current_user_id)

    if(programs_response["success"] == False):
        raise HTTPException(status_code=404, detail="User not found")
    
    programs = programs_response["data"]

    user_data = ast.literal_eval(str(find_user_by_id(current_user_id)))

    active_program_data = get_program_by_id(user_data["active_program"])
    active_program = []
    if(active_program_data["success"] == True):
        active_program = active_program_data["data"]

    profile_data = {
        "user_id": user_data["id"],
        "username": user_data["username"],
        "email": user_data["email"],
        "workout_streak": user_data["current_streak"],
        "programs": programs,
        "active_program": active_program,
    }

    return profile_data

@profile_router.post("/active", status_code=200)
async def set_active_program(program: WorkoutProgram, user_id: str = Depends(get_current_user)):
    update_response = set_users_active_program(program.id, user_id)
    formatted_response = ast.literal_eval(str(update_response))

    return {
        "message": "active program set",
        "program_id": formatted_response[0]["active_program"],
        "status": 201
    }