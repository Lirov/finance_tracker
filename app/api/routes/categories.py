from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=CategoryRead)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    cat = Category(name=payload.name, type=payload.type)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.get("/", response_model=List[CategoryRead])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()
