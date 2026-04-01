"""
KrishiMitra AI - Database Base
SQLAlchemy base class and utilities
"""

from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase


class Base(AsyncAttrs, DeclarativeBase):
    """Base class for all database models."""
    pass
