from datetime import date
from pydantic import BaseModel, Field
from app.schemas.category import CategoryRead


class TransactionBase(BaseModel):
    date: date
    amount: float = Field(..., description="Positive for income, negative for expense")
    category_id: int
    description: str | None = None


class TransactionCreate(TransactionBase):
    pass


class TransactionRead(TransactionBase):
    id: int
    category: CategoryRead

    class Config:
        orm_mode = True
