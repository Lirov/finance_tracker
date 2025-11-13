from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    type: str  # "expense" / "income" / "saving"


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int

    class Config:
        orm_mode = True
