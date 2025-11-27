import bcrypt
from fastapi import APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from ..utils.createToken import create_access_token, create_refresh_token
from ..utils.validateToken import validateRefreshToken
from ..Database.users import insert_user, find_user_by_email
from ..models.users import CreateUser, LoginUser
from ..models.auth import Token, AuthorizedReturn, RefreshToken

from ..Database.redisClient import redis_client

##oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

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
    existing_user = find_user_by_email(user.email)
    if existing_user is not None:
        raise HTTPException(status_code=400, detail="User already exists")

    insert_user(user)
    print("user inserted...")
    
    return {"message": "User successfully created"}


@auth_router.post("/login", status_code=201)
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
    refresh_token = create_refresh_token(data={"sub": user.email})

    ## Store refresh token in redis
    redis_client.set(user.email, refresh_token)

    token_data = Token(access_token=token, generated_by_refresh_token=False)
    
    return AuthorizedReturn(token_data=token_data, refresh_token_data=refresh_token, username=existing_user["username"], email=existing_user["email"])


@auth_router.post("/logout", status_code=200)
def logout_user(refresh_token: RefreshToken):
    if refresh_token is None:
        raise HTTPException(status_code=401, detail="Invalid or no refresh token was provided")
    
    ## Need to validate refresh token 
    payload = validateRefreshToken(refresh_token.refresh_token)
    userEmail = payload["sub"]
    storedRefreshToken = redis_client.get(userEmail)

    if refresh_token.refresh_token != storedRefreshToken:
        raise HTTPException(status_code=401, detail="Refresh token does not exist")
    
    ## Now we can delete the refresh token from our redis cache
    redis_client.delete(userEmail)

    return { "Message": "User logged out successfully" }


@auth_router.post('/token', status_code=201)
def generate_new_access_token(refresh_token: RefreshToken):
    if refresh_token is None:
        raise HTTPException(status_code=401, detail="Invalid or no refresh token was provided")

    ## Need to validate refresh token 
    payload = validateRefreshToken(refresh_token.refresh_token)
    userEmail = payload["sub"]
    storedRefreshToken = redis_client.get(userEmail)

    if refresh_token.refresh_token != storedRefreshToken:
        raise HTTPException(status_code=401, detail="Refresh token does not exist")
    
    ## Token has been validated, generate new access token
    token = create_access_token(data={"sub": userEmail})

    return Token(access_token=token, generated_by_refresh_token=True)