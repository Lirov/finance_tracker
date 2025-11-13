from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.category import Category

router = APIRouter(prefix="/setup", tags=["setup"])


@router.post("/default-categories")
def create_default_categories(db: Session = Depends(get_db)):
    """
    One-time helper to create basic categories.
    You can call this from Swagger or curl.
    """
    defaults = [
        ("Salary", "income"),
        ("Bonus", "income"),
        ("Groceries", "expense"),
        ("Rent", "expense"),
        ("Restaurants", "expense"),
        ("Transport", "expense"),
        ("Kids", "expense"),
        ("Hobbies", "expense"),
        ("Savings", "saving"),
        ("Emergency Fund", "saving"),
    ]

    created = []
    skipped = []

    for name, ctype in defaults:
        existing = db.query(Category).filter(Category.name == name).first()
        if existing:
            skipped.append(name)
            continue
        cat = Category(name=name, type=ctype)
        db.add(cat)
        created.append(name)

    db.commit()
    return {"created": created, "skipped": skipped}
