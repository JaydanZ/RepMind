from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .routes import auth_router, profile_router
from .middleware import TokenAuthMiddleware

## ENV VARS
client_url = get_settings()
redis_host = client_url.REDIS_HOST
origins = [client_url.CLIENT_URL]

## Setup API
app = FastAPI()

## Routes
app.include_router(auth_router)
app.include_router(profile_router)

## Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE","PATCH"],
    allow_headers=["content-type","x-requested-with", "Authorization"]
)
app.add_middleware(TokenAuthMiddleware)

@app.get("/")
async def root():
    return {"message": "Backend hit..."}
