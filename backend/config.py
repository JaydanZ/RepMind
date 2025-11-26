from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    CLIENT_URL: str
    REDIS_HOST: str
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    model_config = SettingsConfigDict(env_file=".env")

## NON AUTHENTICATED ROUTES GO HERE
non_auth_routes = ["/auth"]

@lru_cache
def get_settings():
    return Settings()