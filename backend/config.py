from __future__ import annotations

from typing import List
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application configuration loaded from environment or .env file."""

    OPENAI_API_KEY: str = Field(..., env="OPENAI_API_KEY")
    PORT: int = Field(8000, env="PORT")
    ALLOWED_ORIGINS: List[str] = Field(default_factory=lambda: ["*"], env="ALLOWED_ORIGINS")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

OPENAI_API_KEY = settings.OPENAI_API_KEY
PORT = settings.PORT
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS
