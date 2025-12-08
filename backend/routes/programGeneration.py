from fastapi import APIRouter, HTTPException
from ..models.programGeneration import ProgramOptions


## Endpoint to handle ai program generation without authentication / is user logged in status
program_generation_router = APIRouter(
    prefix="/programs",
    tags=["programs"]
)

@program_generation_router.post('/', status_code=201)
def generateProgram(programInput: ProgramOptions):
    print(programInput)
    return { "Message": "Program generation endpoint hit" }