from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class AuthorizedReturn(BaseModel):
    token_data: Token
    refresh_token_data: str
    username: str
    email: EmailStr