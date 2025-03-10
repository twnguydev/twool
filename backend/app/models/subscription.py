from sqlalchemy import Column, String, ForeignKey, DateTime, Enum, Float, Integer
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin
import enum
from datetime import datetime, timezone

class SubscriptionType(enum.Enum):
    MONTHLY = "monthly"
    ANNUAL = "annual"
    
class SubscriptionTier(enum.Enum):
    SOLO = "solo"
    BUSINESS = "business"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(enum.Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    EXPIRED = "expired"
    PENDING = "pending"
    
class Subscription(Base, TimeStampMixin):
    __tablename__ = "subscriptions"
    
    id = Column(String(50), primary_key=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    company_id = Column(String(50), ForeignKey("companies.id"), nullable=True)
    type = Column(Enum(SubscriptionType), nullable=False)
    tier = Column(Enum(SubscriptionTier), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.PENDING, nullable=False)
    
    # Dates
    start_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    
    # Paiement
    payment_provider = Column(String(50), nullable=True)  # ex: "stripe", "paypal"
    payment_id = Column(String(255), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="EUR", nullable=False)
    
    # Limites
    max_workflows = Column(Integer, nullable=True)  # NULL pour illimité
    max_storage = Column(Integer, nullable=False)  # En KB
    max_users = Column(Integer, nullable=True)     # NULL pour illimité (solo = 1)
    
    # Relations
    user = relationship("User", back_populates="subscription")
    company = relationship("Company", back_populates="subscription")
    licenses = relationship("License", back_populates="subscription", cascade="all, delete-orphan")
    
    @property
    def is_active(self):
        return (self.status == SubscriptionStatus.ACTIVE and 
                self.end_date > datetime.now(timezone.utc))
                
    @property
    def days_remaining(self):
        if not self.is_active:
            return 0
        delta = self.end_date - datetime.now(timezone.utc)
        return max(0, delta.days)