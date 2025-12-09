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
non_auth_routes = ["/docs","/auth", "/auth/login", "/auth/logout", "/auth/createuser", "/auth/token","/programs/"]

@lru_cache
def get_settings():
    return Settings()