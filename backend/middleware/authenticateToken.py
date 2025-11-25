import jwt
from fastapi import Request, HTTPException
from ..config import non_auth_routes
from ..config import get_settings

## Setup env vars
envVars = get_settings()
JWT_SECRET_KEY = envVars.JWT_SECRET_KEY

async def authenticate_token(request: Request, call_next):
    ## Check if route requires token
    if request.url.path in non_auth_routes:
        response = await call_next(request)
        return response

    ## Check if user has token or is valid
    access_token = request.headers.get("Authorization")

    if not access_token or not access_token.startswith("Bearer "):
        return HTTPException(status_code=401,detail="Authentication required")
    
    token = access_token.split(" ")[1]
     ## Validate the access token / check if it has expired

    try:
       payload = jwt.decode(token, JWT_SECRET_KEY)
       request.state.user_token = payload
    except jwt.ExpiredSignatureError:
        return HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        return HTTPException(status_code=401, detail="Invalid token")

    response = await call_next(request)
    return response
