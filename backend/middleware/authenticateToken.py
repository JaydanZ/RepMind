import jwt
from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response, JSONResponse
from ..config import non_auth_routes
from ..config import get_settings

## Setup env vars
envVars = get_settings()
JWT_SECRET_KEY = envVars.JWT_SECRET_KEY
ALGORITHM = 'HS256'

class TokenAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint ) -> Response:
        ## Check if route requires token
        if request.url.path in non_auth_routes:
            response = await call_next(request)
            return response

        ## Check if user has token or is valid
        access_token = request.headers.get("Authorization")

        if not access_token or not access_token.startswith("Bearer "):
            return JSONResponse(
                {"detail": "Authentication Required"},
                status_code=status.HTTP_401_UNAUTHORIZED
            )
    
        token = access_token.split(" ")[1]

        ## Validate the access token / check if it has expired
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=ALGORITHM)
            request.state.user_token = payload
        except jwt.ExpiredSignatureError:
            return JSONResponse(
                {"detail": "Token Expired"},
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        except jwt.InvalidTokenError:
            return JSONResponse(
                {"detail": "Invalid Token"},
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        response = await call_next(request)
        return response
