# Import all models here so they are registered with SQLAlchemy
from .user import User
from .quote import Quote

__all__ = ['User', 'Quote']
