import bcrypt
from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from ..utils.createAccessToken import create_access_token
from ..Database.users import insert_user, find_user_by_email, find_user_by_username
from ..models.users import CreateUser, LoginUser
from ..models.auth import Token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

auth_router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

MIN_USERNAME_LENGTH = 4
MIN_PASSWORD_LENGTH = 8

@auth_router.post("/createuser", status_code=201)
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

@auth_router.post("/login", status_code=200)
def login_user(user: LoginUser):

    ## Validate user info
    if user.email is None or user.password is None:
        raise HTTPException(status_code=404, detail="Required user data not found")
    
    if len(user.password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(status_code=400, detail="User data failed to meet requirements")
    
    ## Check if user exists
    existing_user = find_user_by_email(user.email)
    if existing_user is None:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    ## Check if passwords match
    if not bcrypt.checkpw(user.password.encode('utf-8'), existing_user["password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    ## Generate token for user
    token = create_access_token(data={"sub": user.email})
    
    return Token(access_token=token, token_type="bearer")

