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
    content = generate_program(programInput)
    return content