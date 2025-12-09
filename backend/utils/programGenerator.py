from langchain_openai import ChatOpenAI
from langchain_core.prompts.chat import (
    HumanMessagePromptTemplate,
    ChatPromptTemplate
)

from ..config import get_settings
from ..models.programGeneration import ProgramOptions

## Get OPEN API key
envVars = get_settings()
openai_api_key = envVars.OPENAI_API_KEY

## Chat model definition
OPENAI_MODEL = "gpt-5-nano"

open_ai_client = ChatOpenAI(api_key=openai_api_key, model=OPENAI_MODEL)

## Prompt Template
PROGRAM_GENERATION_PROMPT_TEMPLATE = """
    Assume you're a fitness trainer with over 10 years of experience with weightlifting, bodybuilding, strength training and
    assiting other people to achieve their fitness goals. Please generate a workout program following these arguments:
    User's fitness goal: {fitness_goal}
    User's years of experience working out: {years_of_experience}
    User's availability to workout during the week: {days_per_week}
    User's current age: {age}
    User's current weight: {weight} {weight_unit}
    User's gender: {gender}
"""

def generate_program(program: ProgramOptions):

    message = HumanMessagePromptTemplate.from_template(template=PROGRAM_GENERATION_PROMPT_TEMPLATE)
    chat_prompt = ChatPromptTemplate.from_messages(messages=[message])

    ## Insert data from user
    chat_prompt_with_user_data = chat_prompt.format_prompt(fitness_goal=program.fitness_goal, years_of_experience=program.years_of_experience, 
                                                           days_per_week=program.days_per_week, age=program.age, weight=program.weight, 
                                                           weight_unit=program.weight_unit, gender=program.gender)
    
    response = open_ai_client.invoke(chat_prompt_with_user_data.to_messages())
    print(response)

    return