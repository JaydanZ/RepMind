import jwt
from ..config import get_settings

envVars = get_settings()
JWT_REFRESH_SECRET = envVars.JWT_REFRESH_SECRET
ALGORITHM = 'HS256'

def validateRefreshToken(token: str):
    return jwt.decode(token, JWT_REFRESH_SECRET, algorithms=ALGORITHM)