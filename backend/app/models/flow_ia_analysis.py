from sqlalchemy import Column, String, Float, JSON, ForeignKey, Text
from sqlalchemy.dialects.mysql import JSON as MySQLJSON
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin

class FlowIAAnalysis(Base, TimeStampMixin):
    __tablename__ = "flow_ia_analyses"
    
    id = Column(String(50), primary_key=True)
    workflow_id = Column(String(50), ForeignKey("workflows.id"), nullable=False)
    model_analysis = Column(MySQLJSON, nullable=True)
    flow_analysis = Column(MySQLJSON, nullable=True)
    critical_variables = Column(MySQLJSON, nullable=True)
    bottlenecks = Column(MySQLJSON, nullable=True)
    optimizations = Column(MySQLJSON, nullable=True)
    alternative_scenarios = Column(MySQLJSON, nullable=True)
    resilience_assessment = Column(MySQLJSON, nullable=True)
    confidence_score = Column(Float, nullable=True)
    visualization_suggestions = Column(MySQLJSON, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relations
    workflow = relationship("Workflow", back_populates="flow_ia_analyses")