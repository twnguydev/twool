from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime, func
from datetime import datetime

Base = declarative_base()

class TimeStampMixin:
    """Mixin pour ajouter automatiquement created_at et updated_at aux modèles"""
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)