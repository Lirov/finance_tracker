from app.db.session import Base  # noqa

# Import models here so they are registered on the Base
from app.models.category import Category  # noqa
from app.models.transaction import Transaction  # noqa
from app.models.budget import Budget  # noqa
