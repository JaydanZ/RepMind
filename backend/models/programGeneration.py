from pydantic import BaseModel

class ProgramOptions(BaseModel):
    fitness_goal:str
    years_of_experience:str
    days_per_week:str
    age:int
    weight:int
    weight_unit:str
    gender:str