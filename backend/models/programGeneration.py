from pydantic import BaseModel, Field

class ProgramOptions(BaseModel):
    fitness_goal:str
    years_of_experience:str
    days_per_week:str
    age:int
    weight:int
    weight_unit:str
    gender:str


## List of days working out during the week
    ## What exercises is the user doing each day (i.e. the body section focus of the day)
        ## This would also include the ammount of reps and sets per exercise
        ## Any substitutional exercises
    ## Any additional tips for the user

class Exercise(BaseModel):
    name: str = Field(description="Name of the exercise")
    sets: int = Field(description="Number of sets to perform for the exercise")
    reps: int = Field(description="Number of reps to perform per set for the exercise")
class Workout(BaseModel):
    day: str = Field(description="Name of the day the user will perform the workout (i.e. Monday, Tuesday, etc.)")
    focus: str = Field(description="Focus of the workout (i.e. Push day, Upper Day, etc.)")
    exercises: list[Exercise] = Field(description="A collection of exercises the user will perform for the day")
class ProgramResult(BaseModel):
    program_frequency: int = Field(description="The number of days the user will workout during the week")
    program_structure: list[Workout] = Field(description="A collection of workouts the user will perform for the week")
    program_tips: list[str] = Field(description="A collection of workout tips to help the user along their journey")
