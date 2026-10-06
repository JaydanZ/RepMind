from functools import lru_cache
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    CLIENT_URL: str
    REDIS_HOST: str
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    OPENAI_API_KEY: SecretStr
    model_config = SettingsConfigDict(env_file=".env")

## NON AUTHENTICATED ROUTES GO HERE
API_V1_PREFIX = "/api/v1"

non_auth_routes = ["/docs", "/openapi.json"] + [
    f"{API_V1_PREFIX}{path}"
    for path in ["/auth/login", "/auth/logout", "/auth/register", "/auth/refresh", "/programs/generate"]
]

@lru_cache
def get_settings():
    return Settings()