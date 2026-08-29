import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "CivicPulse AI Service"
    API_V1_STR: str = "/api/v1"
    
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # Models
    EMBEDDING_MODEL: str = "mistral-embed"
    REASONING_MODEL: str = "mistral-large-latest"
    EMBEDDING_DIMENSION: int = 1024

    class Config:
        case_sensitive = True

settings = Settings()
