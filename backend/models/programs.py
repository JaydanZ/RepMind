from typing import Annotated
from pydantic import BaseModel, Field, StringConstraints, field_validator
from .programRules import (
    Weekday,
    MAX_DAYS,
    MAX_EXERCISES_PER_DAY,
    MIN_SETS_OR_REPS,
    MAX_SETS_OR_REPS,
    MAX_PROGRAM_NAME_LENGTH,
    MAX_FOCUS_LENGTH,
    MAX_EXERCISE_NAME_LENGTH,
    MAX_EXERCISE_TIP_LENGTH,
)

## Field types shared by saved programs and AI generated programs

ProgramName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_PROGRAM_NAME_LENGTH)]
Focus = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_FOCUS_LENGTH)]
ExerciseName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=MAX_EXERCISE_NAME_LENGTH)]
ExerciseTip = Annotated[str, StringConstraints(strip_whitespace=True, max_length=MAX_EXERCISE_TIP_LENGTH)]
SetsOrReps = Annotated[int, Field(ge=MIN_SETS_OR_REPS, le=MAX_SETS_OR_REPS)]

def check_unique_days(workouts):
    days = [workout.day for workout in workouts]
    if len(days) != len(set(days)):
        raise ValueError("Each weekday can only be scheduled once")
    return workouts

class Exercise(BaseModel):
    exercise_tip:ExerciseTip
    name:ExerciseName
    sets:SetsOrReps
    reps:SetsOrReps

class Workout(BaseModel):
    day:Weekday
    focus:Focus
    exercises:Annotated[list[Exercise], Field(min_length=1, max_length=MAX_EXERCISES_PER_DAY)]

class ProgramImport(BaseModel):
    program_name:ProgramName
    program_structure:Annotated[list[Workout], Field(min_length=1, max_length=MAX_DAYS)]

    @field_validator("program_structure")
    @classmethod
    def unique_days(cls, workouts):
        return check_unique_days(workouts)

class WorkoutProgram(BaseModel):
    created_at:str
    description:str | None
    id:str
    program_name:str
    program_structure:list[Workout]
    updated_at:str
    user_id:str
