from pydantic_settings import BaseSettings
from typing import List
import os
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
  VERSION: str = "0.1.0"
  API_V1_STR: str = "/api/v1"
  DEBUG: bool = os.getenv("DEBUG", False)
  ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 heures
  JWT_SECRET: str = os.getenv("JWT_SECRET", "secret")
  JWT_ALGORITHM: str = "HS256"
  JWT_EXPIRATION: int = 60 * 24  # 24 heures
  DB_HOST: str = os.getenv("DB_HOST", "localhost")
  DB_USER: str = os.getenv("DB_USER", "twool")
  DB_PASSWORD: str = os.getenv("DB_PASSWORD", "twool")
  DB_NAME: str = os.getenv("DB_NAME", "twool")
  DATABASE_URL: str = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:8889/{DB_NAME}"
  OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
  
  # Configuration CORS
  BACKEND_CORS_ORIGINS: List[str] = [
      "http://localhost:3000",
      "http://127.0.0.1:3000"
  ]
  
  # Préfixe pour les identifiants
  USER_ID_PREFIX: str = "usr"
  COMPANY_ID_PREFIX: str = "com"
  SUBSCRIPTION_ID_PREFIX: str = "sub"
  LICENSE_ID_PREFIX: str = "lic"
  WORKFLOW_ID_PREFIX: str = "wfl"
  
  class Config:
      case_sensitive = True
      env_file = ".env"
      
@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
  