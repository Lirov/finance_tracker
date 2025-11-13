from pydantic import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Personal Finance Tracker"
    # For dev: SQLite file; later replace with Postgres
    DATABASE_URL: str = "sqlite:///./finance.db"

    class Config:
        env_file = ".env"


settings = Settings()
