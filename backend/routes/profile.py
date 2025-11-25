from fastapi import APIRouter, HTTPException

profile_router = APIRouter(
    prefix="/profile",
    tags=['profile']
)

@profile_router.get("/",status_code=200)
async def get_profile_data():
    profile_data = {
        "username": "test",
        "email": "exampleemail@test.com"
    }
    return profile_data