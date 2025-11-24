from fastapi import Request


async def authenticate_token(request: Request, call_next):
    ## Check if user has token or is valid

    response = await call_next(request)
    return response
