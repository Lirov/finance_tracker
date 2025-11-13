from pydantic import BaseModel


class BudgetBase(BaseModel):
    year: int
    month: int
    category_id: int
    amount: float


class BudgetCreate(BudgetBase):
    pass


class BudgetRead(BudgetBase):
    id: int

    class Config:
        orm_mode = True
