from fastapi import FastAPI
from app.core.config import settings
from app.db.session import engine
from app.db import base as models_base

from app.api.routes import categories, transactions, budgets, summaries

# Create tables (for dev; later use Alembic)
models_base.Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)


app.include_router(categories.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(summaries.router)
