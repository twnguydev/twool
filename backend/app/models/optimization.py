from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum
from sqlalchemy.dialects.mysql import JSON as MySQLJSON
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin
import enum

class OptimizationStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Optimization(Base, TimeStampMixin):
    __tablename__ = "optimizations"
    
    id = Column(String(50), primary_key=True)
    workflow_id = Column(String(50), ForeignKey("workflows.id"), nullable=False)
    simulation_id = Column(String(50), ForeignKey("simulations.id"), nullable=True)
    status = Column(Enum(OptimizationStatus), default=OptimizationStatus.PENDING, nullable=False)
    parameters = Column(MySQLJSON, nullable=True)
    suggestions = Column(MySQLJSON, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relations
    workflow = relationship("Workflow", back_populates="optimizations")
    simulation = relationship("Simulation")