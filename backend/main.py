from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .routes import auth_router, profile_router, program_generation_router
from .middleware import TokenAuthMiddleware

## ENV VARS
client_url = get_settings()
redis_host = client_url.REDIS_HOST
origins = [client_url.CLIENT_URL]

## Setup API
app = FastAPI()

## Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
    max_age=3600
)

app.add_middleware(TokenAuthMiddleware)

## Routes
app.include_router(auth_router)
app.include_router(program_generation_router)
app.include_router(profile_router)

@app.get("/")
async def root():
    return {"message": "Backend hit..."}
