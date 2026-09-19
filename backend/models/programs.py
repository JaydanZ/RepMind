from pydantic import BaseModel

class Exercise(BaseModel):
    exercise_tip:str
    name:str
    sets:int
    reps:int

class Workout(BaseModel):
    day:str
    focus:str
    exercises:list[Exercise]

class ProgramImport(BaseModel):
    program_name:str
    program_structure:list[Workout]

class WorkoutProgram(BaseModel):
    created_at:str
    description:str | None
    id:str
    program_name:str
    program_structure:list[Workout]
    updated_at:str
    user_id:str