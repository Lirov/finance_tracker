from datetime import date
from calendar import monthrange
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.transaction import Transaction
from app.models.budget import Budget
from app.models.category import Category


def get_month_summary(db: Session, year: int, month: int):
    first_day = date(year, month, 1)
    last_day = date(year, month, monthrange(year, month)[1])

    # Total income & expenses
    total_amount = (
        db.query(func.sum(Transaction.amount))
        .filter(Transaction.date >= first_day, Transaction.date <= last_day)
        .scalar()
        or 0
    )

    # Per category
    rows = (
        db.query(
            Category.id,
            Category.name,
            Category.type,
            func.coalesce(func.sum(Transaction.amount), 0).label("spent"),
            func.coalesce(Budget.amount, 0).label("budget"),
        )
        .join(Transaction, Transaction.category_id == Category.id, isouter=True)
        .join(
            Budget,
            (Budget.category_id == Category.id)
            & (Budget.year == year)
            & (Budget.month == month),
            isouter=True,
        )
        .filter(Transaction.date >= first_day, Transaction.date <= last_day)
        .group_by(Category.id, Category.name, Category.type, Budget.amount)
    )

    categories = []
    income = 0.0
    expenses = 0.0

    for r in rows:
        spent = float(r.spent)
        if r.type == "income":
            income += spent
        else:
            expenses += spent
        categories.append(
            {
                "category_id": r.id,
                "name": r.name,
                "type": r.type,
                "spent": spent,
                "budget": float(r.budget),
                "remaining": float(r.budget) - spent,
            }
        )

    net = income + expenses  # expenses are negative

    return {
        "year": year,
        "month": month,
        "income": income,
        "expenses": expenses,
        "net": net,
        "categories": categories,
    }
