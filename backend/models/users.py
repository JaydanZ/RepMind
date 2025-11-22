from pydantic import BaseModel, EmailStr

class CreateUser(BaseModel):
    model_config = {"extra": "forbid"}

    username: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    model_config = {"extra": "forbid"}

    email: EmailStr
    password: str