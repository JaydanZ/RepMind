from fastapi import APIRouter, HTTPException
from ..Database.users import insert_user, find_user_by_id, find_user_by_username
from ..models.users import CreateUser

users_router = APIRouter(
    prefix="/users",
)

MIN_USERNAME_LENGTH = 4
MIN_PASSWORD_LENGTH = 8

@users_router.post("/createuser", status_code=201)
def create_user(user: CreateUser):

    ## Validate user info
    if user.username is None or user.email is None or user.password is None:
        raise HTTPException(status_code=404, detail="Required user data not found")
    
    if len(user.username) < MIN_USERNAME_LENGTH or len(user.password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(status_code=400, detail="User data failed to meet requirements")
    
    ## Check if user already exists
    existing_user = find_user_by_username(user.username)
    if existing_user is None:
        raise HTTPException(status_code=400, detail="User already exists")

    insert_user(user)
    print("user inserted...")
    
    return {"message": "User successfully created"}