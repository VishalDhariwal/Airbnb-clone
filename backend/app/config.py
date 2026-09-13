from pathlib import Path
from typing import List
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "Airbnb Clone API"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    ENABLE_DEMO_ACCOUNTS: bool = True
    SECRET_KEY: str  # Required from environment, no default fallback
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]
    DATABASE_URL: str = "postgresql://localhost:5432/airbnb_clone"

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key_length(cls, v: str) -> str:
        if not v or len(v.strip()) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v.strip()

    @model_validator(mode="after")
    def validate_environment_and_secrets(self) -> "Settings":
        if self.ENVIRONMENT == "production":
            if self.SECRET_KEY == "supersecretdevelopmentjwtkey1234567890":
                raise ValueError(
                    "The published development SECRET_KEY placeholder cannot be used in a production environment."
                )
        return self

    @property
    def is_demo_enabled(self) -> bool:
        if self.ENVIRONMENT == "production":
            return False
        return self.ENABLE_DEMO_ACCOUNTS

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()

