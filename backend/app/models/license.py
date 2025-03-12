from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin
import enum
from datetime import datetime, timezone

class LicenseStatus(enum.Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"

class License(Base, TimeStampMixin):
    __tablename__ = "licenses"
    
    id = Column(String(50), primary_key=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    subscription_id = Column(String(50), ForeignKey("subscriptions.id"), nullable=False)
    status = Column(Enum(LicenseStatus), default=LicenseStatus.ACTIVE, nullable=False)
    
    # Dates
    expiration_date = Column(DateTime, nullable=False)
    
    # Attributs
    is_admin = Column(Boolean, default=False, nullable=False)
    
    # Relations
    subscription = relationship("Subscription", back_populates="licenses")
    
    @property
    def is_active(self):
        return (self.status == LicenseStatus.ACTIVE and 
                self.expiration_date > datetime.now(timezone.utc))