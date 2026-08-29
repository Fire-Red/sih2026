import psycopg
from psycopg.rows import dict_row
from pgvector.psycopg import register_vector
from app.config import settings

def get_db_connection():
    if not settings.DATABASE_URL:
        raise ValueError("DATABASE_URL is not set in environment settings")
    
    conn = psycopg.connect(settings.DATABASE_URL, row_factory=dict_row)
    register_vector(conn)
    return conn
