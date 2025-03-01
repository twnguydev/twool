from sqlalchemy import Column, String, Text, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin

class Company(Base, TimeStampMixin):
    __tablename__ = "companies"
    
    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relations
    users = relationship("User", back_populates="company", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="company", uselist=False, cascade="all, delete-orphan")