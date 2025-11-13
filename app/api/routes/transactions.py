from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])


def _get_category(db: Session, category_id: int) -> Category:
    category = db.query(Category).get(category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")
    return category


def _normalize_amount(category: Category, amount: float | Decimal) -> Decimal:
    value = Decimal(str(amount))
    if category.type == "expense":
        return -abs(value)
    return abs(value)


@router.post("/", response_model=TransactionRead)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    category = _get_category(db, payload.category_id)
    tx = Transaction(
        date=payload.date,
        amount=_normalize_amount(category, payload.amount),
        category_id=payload.category_id,
        description=payload.description,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


@router.get("/", response_model=List[TransactionRead])
def list_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.date.desc(), Transaction.id.desc()).all()


@router.get("/{tx_id}", response_model=TransactionRead)
def get_transaction(tx_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).get(tx_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx


@router.put("/{tx_id}", response_model=TransactionRead)
def update_transaction(
    tx_id: int, payload: TransactionUpdate, db: Session = Depends(get_db)
):
    tx = db.query(Transaction).get(tx_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    data = payload.dict(exclude_unset=True)
    if "category_id" in data or "amount" in data:
        target_category_id = data.get("category_id", tx.category_id)
        category = _get_category(db, target_category_id)

        if "category_id" not in data:
            data["category_id"] = target_category_id

        if "amount" in data and data["amount"] is not None:
            data["amount"] = _normalize_amount(category, data["amount"])
        elif "category_id" in data and "amount" not in data:
            data["amount"] = _normalize_amount(category, tx.amount)

    for field, value in data.items():
        setattr(tx, field, value)

    db.commit()
    db.refresh(tx)
    return tx


@router.delete("/{tx_id}", status_code=204)
def delete_transaction(tx_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).get(tx_id)
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(tx)
    db.commit()
    return None
