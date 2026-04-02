"""
KrishiMitra AI - Configuration Settings
Pydantic settings for environment-based configuration
"""

from typing import List, Optional
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="allow",
    )

    # Application
    APP_NAME: str = "KrishiMitra AI"
    VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, description="Debug mode")
    ENV: str = Field(default="development", description="Environment")

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4

    # Security
    SECRET_KEY: str = Field(default="insecure-default-key-for-dev-only", description="JWT secret key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ALGORITHM: str = "HS256"

    # CORS
    ALLOWED_HOSTS: List[str] = Field(
        default=["*"],
        description="Allowed CORS origins",
    )

    # Database — SQLite by default for local/edge (DPDP Act compliant)
    # Swap to postgresql+asyncpg://... for production
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./krishimitra.db",
        description="Async DB connection string (SQLite or PostgreSQL)",
    )
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10

    # Redis (optional for local dev — cache degrades gracefully)
    REDIS_URL: Optional[str] = Field(
        default="redis://localhost:6379/0",
        description="Redis connection string",
    )
    REDIS_POOL_SIZE: int = 50

    # Celery
    CELERY_BROKER_URL: str = Field(
        default="redis://localhost:6379/1",
        description="Celery broker URL",
    )
    CELERY_RESULT_BACKEND: str = Field(
        default="redis://localhost:6379/2",
        description="Celery result backend",
    )

    # AIKosh API
    AIKOSH_API_KEY: Optional[str] = Field(
        default=None,
        description="AIKosh API key",
    )
    AIKOSH_BASE_URL: str = "https://aikosha.indiaai.gov.in/api/v1"

    # AI4Bharat Models
    AI4BHARAT_ASR_URL: Optional[str] = None
    AI4BHARAT_TTS_URL: Optional[str] = None
    SARVAM_API_KEY: Optional[str] = None

    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen3-coder"

    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    S3_BUCKET: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None

    # ML Model Configuration
    MODEL_CACHE_DIR: str = "./models/cache"
    DEFAULT_MODEL_DEVICE: str = "cpu"
    BATCH_SIZE: int = 32
    MAX_SEQUENCE_LENGTH: int = 512

    # Voice Processing
    VOICE_MAX_DURATION: int = 60  # seconds
    SUPPORTED_LANGUAGES: List[str] = Field(
        default=[
            "hi", "bn", "te", "ta", "mr", "gu",
            "kn", "ml", "pa", "ur", "or", "as",
            "ne", "si", "en"
        ]
    )
    DEFAULT_LANGUAGE: str = "hi"

    # External APIs
    IMD_API_KEY: Optional[str] = None
    AGMARKNET_API_KEY: Optional[str] = None

    # Monitoring
    SENTRY_DSN: Optional[str] = None
    PROMETHEUS_MULTIPROC_DIR: Optional[str] = None

    # Feature Flags
    ENABLE_VOICE_AI: bool = True
    ENABLE_PREDICTIONS: bool = True
    ENABLE_GEOSPATIAL: bool = True
    ENABLE_OFFLINE_SYNC: bool = True

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.ENV == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.ENV == "production"

    @property
    def database_async_url(self) -> str:
        """Get async database URL, ensuring it uses the asyncpg driver for PostgreSQL."""
        url = str(self.DATABASE_URL).strip()
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql+asyncpg://", 1)
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        if url.startswith("postgresql+psycopg2://"):
            return url.replace("postgresql+psycopg2://", "postgresql+asyncpg://", 1)
        return url

    @property
    def is_sqlite(self) -> bool:
        """True if using SQLite backend."""
        return self.DATABASE_URL.startswith("sqlite")


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
