from fastapi import APIRouter, HTTPException
from ..models.programGeneration import ProgramOptions
from ..utils.programGenerator import generate_program


## Endpoint to handle ai program generation without authentication / is user logged in status
program_generation_router = APIRouter(
    prefix="/programs",
    tags=["programs"]
)

@program_generation_router.post('/', status_code=201)
def handleProgramGeneration(programInput: ProgramOptions):
    ## Check if free limit is enabled -> means user is not logged in
    if(programInput.freeLimitEnabled == True):
        raise HTTPException(status_code=401, detail="User must login to continue using API")
    content = generate_program(programInput)
    return content