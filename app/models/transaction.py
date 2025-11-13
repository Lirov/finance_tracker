from sqlalchemy import Column, Integer, Date, Numeric, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.session import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)  # + = income, - = expense
    description = Column(String(255), nullable=True)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    category = relationship("Category")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
