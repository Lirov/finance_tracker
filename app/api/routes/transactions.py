from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionRead

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=TransactionRead)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db)):
    tx = Transaction(
        date=payload.date,
        amount=payload.amount,
        category_id=payload.category_id,
        description=payload.description,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


@router.get("/", response_model=List[TransactionRead])
def list_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.date.desc()).all()
