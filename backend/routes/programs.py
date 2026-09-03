from fastapi import APIRouter, HTTPException
from ..models.programGeneration import ProgramOptions
from ..utils.programGenerator import generate_program
from ..models.programs import ProgramImport


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
def handleProgramImport(programImport: ProgramImport):
    
    return