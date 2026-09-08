from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "Airbnb Clone API"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "supersecretdevelopmentjwtkey1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
    DATABASE_URL: str = "postgresql://localhost:5432/airbnb_clone"

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
