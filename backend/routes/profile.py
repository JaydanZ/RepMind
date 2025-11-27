from fastapi import APIRouter, Header
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer

profile_router = APIRouter(
    prefix="/profile",
    tags=['profile']
)

@profile_router.get("/",status_code=200)
async def get_profile_data():
    ## TEST RESPONSE
    profile_data = {
        "username": "test",
        "email": "exampleemail@test.com"
    }
    return profile_data