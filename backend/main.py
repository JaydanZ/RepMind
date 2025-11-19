from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .routes import users_router

app = FastAPI()

## Routes
app.include_router(users_router)


client_url = get_settings()
origins = [client_url.CLIENT_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE","PATCH"],
    allow_headers=["content-type","x-requested-with",]
)

@app.get("/")
async def root():
    return {"message": "Backend hit..."}
