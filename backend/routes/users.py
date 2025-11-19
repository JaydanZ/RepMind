from fastapi import APIRouter
from ..models.users import CreateUser

users_router = APIRouter(
    prefix="/users",
)

@users_router.post("/createuser")
def create_user(user: CreateUser):
    print(user)
    return {"message": "User successfully created"}