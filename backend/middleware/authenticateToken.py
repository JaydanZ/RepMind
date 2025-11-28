import jwt
from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response, JSONResponse
from ..config import non_auth_routes
from ..config import get_settings

## Setup env vars
envVars = get_settings()
allowed_origin = envVars.CLIENT_URL
JWT_SECRET_KEY = envVars.JWT_SECRET_KEY
ALGORITHM = 'HS256'

def handleTokenError(detail: str):
    response = JSONResponse(
                content={"detail": detail},
                status_code=status.HTTP_401_UNAUTHORIZED
            )
    response.headers['Access-Control-Allow-Origin'] = allowed_origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

class TokenAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint ) -> Response:

        ## Check if route requires token
        if request.url.path in non_auth_routes:
            return await call_next(request)
        
        if request.method == "OPTIONS":
            return await call_next(request)

        ## Check if user has token or is valid
        access_token = request.headers.get("authorization")

        if not access_token or not access_token.startswith("Bearer "):
            return handleTokenError("Authentication Required")
    
        token = access_token.split(" ")[1]

        ## Validate the access token / check if it has expired
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=ALGORITHM)
            request.state.user_token = payload
        except jwt.ExpiredSignatureError:
            return handleTokenError("Token Expired")
        except jwt.InvalidTokenError:
            return handleTokenError("Invalid Token")

        response = await call_next(request)
        return response
    

