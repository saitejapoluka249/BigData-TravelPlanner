import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    """
    Application Settings
    """
    PROJECT_NAME: str = "Big Data Travel Planner"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str
    
    # Pydantic will automatically parse a JSON string like '["http://localhost:3000"]' into this list
    BACKEND_CORS_ORIGINS: List[str] 

    AMADEUS_CLIENT_ID: str 
    AMADEUS_CLIENT_SECRET: str 
    WEATHER_API_KEY: str 
    BDC_API_KEY: str  

    POSTGRES_URL: str 

    # 🌟 FIX: Use SettingsConfigDict for Pydantic V2 instead of the inner Config class
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        case_sensitive=True,
        extra="ignore" # This prevents crashes if your .env file has extra variables
    )

settings = Settings()