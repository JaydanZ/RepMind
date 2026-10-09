import logging
import ast
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Request
from ..models.programGeneration import ProgramOptions
from ..utils.programGenerator import generate_program, ProgramGenerationError
from ..models.programs import ProgramImport
from ..models.programRules import PROGRAM_SAVE_RATE_LIMIT
from ..Database.programs import insert_program_from_import, delete_program, update_program
from ..Database.users import find_user_by_id, set_users_active_program
from ..middleware.authenticateToken import get_current_user
from ..utils.limiter import limiter, user_and_ip_key

logger = logging.getLogger(__name__)

## Endpoint to handle ai program generation with / without authentication
programs_router = APIRouter(
    prefix="/programs",
    tags=["programs"]
)

@programs_router.delete("/{program_id}", status_code=200)
async def delete_program_route(program_id: str, user_id: str = Depends(get_current_user)):
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
        "program_id": program_id
    }

@programs_router.put("/{program_id}", status_code=200)
@limiter.limit(PROGRAM_SAVE_RATE_LIMIT, key_func=user_and_ip_key)
async def update_program_route(
    request: Request,
    program_id: UUID,
    programImport: ProgramImport,
    user_id: str = Depends(get_current_user)
):
    response = update_program(str(program_id), user_id, programImport)
    if not response["success"]:
        logger.error("Failed to update program: %s", response.get("error"))
        raise HTTPException(status_code=500, detail="Failed to update program")

    if not response["data"]:
        raise HTTPException(status_code=404, detail="Program not found")

    return {
        "message": "program updated",
        "program_id": str(program_id)
    }

@programs_router.post('/generate', status_code=201)
@limiter.limit("5/minute")
def handleProgramGeneration(request: Request, programInput: ProgramOptions):
    ## Check if free limit is enabled -> means user is not logged in
    if(programInput.freeLimitEnabled == True):
        raise HTTPException(status_code=401, detail="User must login to continue using API")
    try:
        content = generate_program(programInput)
    except ProgramGenerationError:
        logger.exception("Program generation failed after retrying")
        raise HTTPException(status_code=502, detail="Couldn't generate a valid program")
    return content

@programs_router.post('/import', status_code=201)
@limiter.limit(PROGRAM_SAVE_RATE_LIMIT, key_func=user_and_ip_key)
def handleProgramImport(
    request: Request,
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
