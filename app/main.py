from fastapi import FastAPI
from app.core.config import settings
from app.db.session import engine
from app.db import base as models_base

from app.api.routes import categories, transactions, budgets, summaries, setup

# Create tables (for dev; later use Alembic)
models_base.Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok"}


app.include_router(categories.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(summaries.router)
app.include_router(setup.router)