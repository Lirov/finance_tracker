from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db
from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetRead

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.post("/", response_model=BudgetRead)
def create_budget(payload: BudgetCreate, db: Session = Depends(get_db)):
    budget = Budget(
        year=payload.year,
        month=payload.month,
        category_id=payload.category_id,
        amount=payload.amount,
    )
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.get("/", response_model=List[BudgetRead])
def list_budgets(db: Session = Depends(get_db)):
    return db.query(Budget).all()
