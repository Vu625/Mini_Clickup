import os
from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "First_Project"
    SECRET_KEY: str = "your-super-secret-key-6969"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    DATABASE_URL : str
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # Bỏ qua các biến thừa trong .env nếu có
    )
    GEMINI_API_KEY: str

settings = Settings()