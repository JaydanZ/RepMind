import redis
from ..config import get_settings

## ENV Vars
envVars = get_settings()
redis_host = envVars.REDIS_HOST

## Setup redis client
redis_client = redis.Redis(host=redis_host, port=6379, decode_responses=True)