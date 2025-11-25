from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .routes import auth_router, profile_router

app = FastAPI()

## Routes
app.include_router(auth_router)
app.include_router(profile_router)


client_url = get_settings()
origins = [client_url.CLIENT_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE","PATCH"],
    allow_headers=["content-type","x-requested-with", "Authorization"]
)

@app.get("/")
async def root():
    return {"message": "Backend hit..."}
