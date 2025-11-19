from supabase import create_client, Client
from ..config import get_settings

envVars = get_settings()

url: str = envVars.SUPABASE_URL
key: str = envVars.SUPABASE_KEY

supabase: Client = create_client(url,key)