from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin
import enum
from datetime import datetime

class LicenseStatus(enum.Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"

class License(Base, TimeStampMixin):
    __tablename__ = "licenses"
    
    id = Column(String(50), primary_key=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    subscription_id = Column(String(50), ForeignKey("subscriptions.id"), nullable=False)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)
    status = Column(Enum(LicenseStatus), default=LicenseStatus.ACTIVE, nullable=False)
    
    # Dates
    activation_date = Column(DateTime, nullable=True)
    expiration_date = Column(DateTime, nullable=False)
    
    # Attributs
    is_admin = Column(Boolean, default=False, nullable=False)
    device_id = Column(String(255), nullable=True)
    
    # Relations
    subscription = relationship("Subscription", back_populates="licenses")
    user = relationship("User")
    
    @property
    def is_active(self):
        return (self.status == LicenseStatus.ACTIVE and 
                self.expiration_date > datetime.utcnow())