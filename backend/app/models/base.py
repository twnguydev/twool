from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime
from datetime import datetime, timezone

Base = declarative_base()

class TimeStampMixin:
    """Mixin pour ajouter automatiquement created_at et updated_at aux modèles"""
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)