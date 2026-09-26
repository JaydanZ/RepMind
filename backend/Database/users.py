import bcrypt
import json
from postgrest.exceptions import APIError
from ..models.users import CreateUser
from .supabase import supabase

def insert_user(user: CreateUser):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'),bcrypt.gensalt()).decode('utf-8')

    response = supabase.table('users').insert({
        'username': user.username,
        'email': user.email,
        'password': hashed_password
    }).execute()

def find_user_by_id(id: str):
    try:
        response = (supabase.table('users').select('*').eq('id',id).single()).execute()
        return response.data
    except APIError as error:
        if error.code == "PGRST116":
            return None
        else:
            raise error


def find_user_by_username(username: str):
    try: 
        response = supabase.table('users').select("*").eq('username',username).single().execute()
        return response.data
    except APIError as error:
        if error.code == "PGRST116":
            return None
        else:
            raise error

    
def find_user_by_email(email: str):
    try: 
        response = supabase.table('users').select("*").eq('email',email).single().execute()
        return response.data
    except APIError as error:
        if error.code == "PGRST116":
            return None
        else:
            raise error

def update_user_streak(user_id: str, streak: int):
    try:
        response = supabase.table('users').update({"current_streak": streak}).eq('id', user_id).execute()
        return response.data
    except Exception as e:
        return {"success": False, "error": str(e)}

def set_users_active_program(program_id: str, user_id: str):
    try:
        response = supabase.table('users').update({"active_program":program_id}).eq('id',user_id).execute()
        return response.data
    except Exception as e:
        return {"success": False, "error": str(e)}