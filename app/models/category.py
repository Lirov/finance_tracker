from sqlalchemy import Column, Integer, String
from app.db.session import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    type = Column(String(20), nullable=False)  # "expense" / "income" / "saving"
