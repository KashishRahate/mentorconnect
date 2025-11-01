from supabase import create_client, Client
from config import Config
import os

_supabase_client = None

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        url = os.getenv('SUPABASE_URL')
        key = os.getenv('SUPABASE_KEY')
        _supabase_client = create_client(url, key)
    return _supabase_client
