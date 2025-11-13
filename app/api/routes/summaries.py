from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.summaries import get_month_summary

router = APIRouter(prefix="/summaries", tags=["summaries"])


@router.get("/month")
def month_summary(year: int, month: int, db: Session = Depends(get_db)):
    """
    Example: GET /summaries/month?year=2025&month=11
    """
    return get_month_summary(db, year=year, month=month)
