from typing import Optional
import datetime as dt

from pydantic import BaseModel, Field, ConfigDict

from app.schemas.category import CategoryRead


class TransactionBase(BaseModel):
    date: dt.date
    amount: float = Field(..., description="Positive for income, negative for expense")
    category_id: int
    description: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    date: Optional[dt.date] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None
    description: Optional[str] = None


class TransactionRead(TransactionBase):
    id: int
    category: CategoryRead

    model_config = ConfigDict(from_attributes=True)
