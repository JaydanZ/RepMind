from pydantic import BaseModel, EmailStr

class CreateUser(BaseModel):
    model_config = {"extra": "forbid"}

    username: str
    email: EmailStr
    password: str