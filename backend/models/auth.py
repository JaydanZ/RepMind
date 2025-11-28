from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    generated_by_refresh_token: bool

class AuthorizedReturn(BaseModel):
    token_data: Token
    refresh_token_data: str
    username: str
    email: EmailStr

class RefreshToken(BaseModel):
    refresh_token: str