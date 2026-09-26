from datetime import date
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field

class SetLog(BaseModel):
    exercise_name:str = Field(min_length=1, max_length=200)
    exercise_order:int = Field(ge=0)
    set_number:int = Field(ge=1, le=50)
    reps:int = Field(ge=0, le=999)
    weight:Decimal | None = Field(default=None, ge=0, le=2000, decimal_places=2)
    weight_unit:Literal['lb', 'kg'] = 'lb'
    notes:str | None = Field(default=None, max_length=280)

class WorkoutSubmission(BaseModel):
    program_id:str
    day:str = Field(min_length=1, max_length=50)
    focus:str = Field(max_length=200)
    performed_on:date
    is_completed:bool
    sets:list[SetLog] = Field(min_length=1, max_length=500)
