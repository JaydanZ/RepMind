from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser

from ..config import get_settings
from ..models.programGeneration import ProgramOptions, ProgramResult

## Get OPEN API key
envVars = get_settings()
openai_api_key = envVars.OPENAI_API_KEY

## Chat model definition
OPENAI_MODEL = "gpt-5-nano"

llm = ChatOpenAI(api_key=openai_api_key, model=OPENAI_MODEL)
parser = PydanticOutputParser(pydantic_object=ProgramResult)

## Prompt Template
PROGRAM_GENERATION_PROMPT_TEMPLATE = """
    You're a fitness trainer with over 10 years of experience with weightlifting, bodybuilding, strength training and
    assiting other people to achieve their fitness goals. Your objective is to generate a workout program for the user 
    following these arguments provided by the user:
    Only schedule workouts on weekdays (If days_per_week is less than 6),
    Ensure the user has enough recovery time during the week
    User's fitness goal: {fitness_goal}
    User's years of experience working out: {years_of_experience}
    User's availability to workout during the week: {days_per_week}
    User's current age: {age}
    User's current weight: {weight} {weight_unit}
    User's gender: {gender}
    {format_instructions}
"""

def generate_program(program: ProgramOptions):
    prompt = PromptTemplate(
        template=PROGRAM_GENERATION_PROMPT_TEMPLATE,
        input_variables=["fitness_goal","years_of_experience","days_per_week","age","weight","weight_unit","gender"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

    chain = prompt | llm | parser

    output = chain.invoke({"fitness_goal":program.fitness_goal, "years_of_experience": program.years_of_experience, 
                           "days_per_week": program.days_per_week, "age":program.age, "weight":program.weight, 
                           "weight_unit":program.weight_unit, "gender": program.gender})

    return output