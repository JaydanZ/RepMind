from fastapi import APIRouter, HTTPException, Depends
from ..models.programGeneration import ProgramOptions
from ..utils.programGenerator import generate_program
from ..models.programs import ProgramImport
from ..Database.programs import insert_program_from_import
from ..middleware.authenticateToken import get_current_user

## Endpoint to handle ai program generation without authentication / is user logged in status
programs_router = APIRouter(
    prefix="/programs",
    tags=["programs"]
)

@programs_router.post('/generation', status_code=201)
def handleProgramGeneration(programInput: ProgramOptions):
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
    try:
        # Insert the program into the database
        result = insert_program_from_import(programImport, current_user_id)
        
        if result["success"]:
            return {
                "message": result["message"],
                "program_id": result["program_id"],
                "status": 201
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Unknown error occurred"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to import program: {str(e)}")
