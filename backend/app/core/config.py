from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Insurance Operation Agent"
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "postgresql://insureops:insureops_dev@localhost:5432/insureops"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    JWT_SECRET: str = "dev_jwt_secret_change_in_prod_12345"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # LLM
    LLM_PROVIDER: str = "mock"  # mock, gemini, openai, anthropic
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
