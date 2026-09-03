from pydantic import BaseModel

class Exercise(BaseModel):
    name:str
    sets:str

class Workout(BaseModel):
    day:str
    focus:str
    exercises:list[Exercise]

class ProgramImport(BaseModel):
    program_name:str
    program_structure:list[Workout]

