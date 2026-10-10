from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

## For authenticated routes: users sharing a network don't share a limit
def user_and_ip_key(request: Request) -> str:
    user_id = getattr(request.state, "current_user_id", None) or "anonymous"
    return f"{user_id}:{get_remote_address(request)}"


## For limits that must follow the account, not the network (e.g. password guessing)
def user_key(request: Request) -> str:
    return getattr(request.state, "current_user_id", None) or get_remote_address(request)
