from langchain_openai import ChatOpenAI

from ..config import get_settings
from ..models.programGeneration import ProgramOptions

## Get OPEN API key
envVars = get_settings()
openai_api_key = envVars.OPENAI_API_KEY

## Chat model definition
OPENAI_MODEL = "gpt-5-nano"

open_ai_client = ChatOpenAI(api_key=openai_api_key, model=OPENAI_MODEL)

def generate_program(program: ProgramOptions):
    return