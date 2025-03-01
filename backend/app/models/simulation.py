from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum
from sqlalchemy.dialects.mysql import JSON as MySQLJSON
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin
import enum

class SimulationStatus(enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class Simulation(Base, TimeStampMixin):
    __tablename__ = "simulations"
    
    id = Column(String(50), primary_key=True)
    workflow_id = Column(String(50), ForeignKey("workflows.id"), nullable=False)
    status = Column(Enum(SimulationStatus), default=SimulationStatus.PENDING, nullable=False)
    parameters = Column(MySQLJSON, nullable=True)
    metrics = Column(MySQLJSON, nullable=True)
    details = Column(MySQLJSON, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relations
    workflow = relationship("Workflow", back_populates="simulations")