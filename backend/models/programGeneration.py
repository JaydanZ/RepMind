from pydantic import BaseModel, Field

class ProgramOptions(BaseModel):
    fitness_goal:str
    years_of_experience:str
    days_per_week:str
    age:int
    weight:int
    weight_unit:str
    gender:str
    isLoggedIn:bool
    freeLimitEnabled:bool

class Exercise(BaseModel):
    name: str = Field(description="Name of the exercise")
    sets: int = Field(description="Number of sets to perform for the exercise")
    reps: int = Field(description="Number of reps to perform per set for the exercise")
    exercise_tip: str = Field(description="Tip / Goal for the exercise to increase the users performance and ensure users safety when performing the exercise")
class Workout(BaseModel):
    day: str = Field(description="Name of the day the user will perform the workout (i.e. Monday, Tuesday, etc.)")
    focus: str = Field(description="Focus of the workout (i.e. Push day, Upper Day, etc.)")
    exercises: list[Exercise] = Field(description="A collection of exercises the user will perform for the day")
class ProgramResult(BaseModel):
    program_structure: list[Workout] = Field(description="A collection of workouts the user will perform for the week")
    program_tips_and_goals: list[str] = Field(description="A collection of workout tips / goals to help the user along their journey (Max 4 entries)")
