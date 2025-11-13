try:
    from pydantic_settings import BaseSettings
except ImportError:  # pragma: no cover
    from pydantic import BaseSettings  # type: ignore[attr-defined]


class Settings(BaseSettings):
    APP_NAME: str = "Personal Finance Tracker"

    # This will be overridden in Docker by env var
    DATABASE_URL: str = "sqlite:///./finance.db"

    class Config:
        env_file = ".env"


settings = Settings()
