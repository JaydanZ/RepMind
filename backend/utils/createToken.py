import jwt
from datetime import datetime, timedelta, timezone
from ..config import get_settings

## Load ENV Vars
envVars = get_settings()
JWT_SECRET_KEY = envVars.JWT_SECRET_KEY
JWT_REFRESH_SECRET = envVars.JWT_REFRESH_SECRET
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 1

def create_access_token(data: dict):
    data_to_encode = data.copy()
    expire_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    data_to_encode.update({ "exp": expire_time })
    encoded_jwt = jwt.encode(data_to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    data_to_encode = data.copy()
    refresh_token = jwt.encode(data_to_encode,JWT_REFRESH_SECRET, algorithm=ALGORITHM)
    return refresh_token