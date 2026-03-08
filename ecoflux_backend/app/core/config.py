from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):

    OPENWEATHER_API_KEY: str
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    SUPABASE_URL: str
    SUPABASE_KEY: str
    ELECTRICITY_MAPS_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
