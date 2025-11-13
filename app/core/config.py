try:
    from pydantic_settings import BaseSettings
except ImportError:  # pragma: no cover - fallback for Pydantic v1
    from pydantic import BaseSettings  # type: ignore[attr-defined]


class Settings(BaseSettings):
    APP_NAME: str = "Personal Finance Tracker"
    # For dev: SQLite file; later replace with Postgres
    DATABASE_URL: str = "sqlite:///./finance.db"

    class Config:
        env_file = ".env"


settings = Settings()
