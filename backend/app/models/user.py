from sqlalchemy import Column, String, Boolean, ForeignKey, Enum, Integer
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin
import enum

class UserRole(enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    CONSULTANT = "consultant"
    SOLO = "solo"

class User(Base, TimeStampMixin):
    __tablename__ = "users"
    
    id = Column(String(50), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.SOLO, nullable=False)
    company_id = Column(String(50), ForeignKey("companies.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_email_verified = Column(Boolean, default=False, nullable=False)
    storage_used = Column(Integer, default=0, nullable=False)  # En KB
    
    # Relations
    company = relationship("Company", back_populates="users")
    workflows = relationship("Workflow", back_populates="owner", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    @property
    def is_solo(self):
        return self.role == UserRole.SOLO
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"