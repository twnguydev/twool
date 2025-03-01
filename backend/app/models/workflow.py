from sqlalchemy import Column, String, Text, Boolean, ForeignKey, Integer, DateTime
from sqlalchemy.dialects.mysql import JSON as MySQLJSON
from sqlalchemy.orm import relationship
from app.models.base import Base, TimeStampMixin
from datetime import datetime

class Workflow(Base, TimeStampMixin):
    __tablename__ = "workflows"
    
    id = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    company_id = Column(String(50), ForeignKey("companies.id"), nullable=True)
    
    # Contenu direct du workflow (nodes et edges)
    nodes = Column(MySQLJSON, nullable=False)
    edges = Column(MySQLJSON, nullable=False)
    
    # Date de création du workflow client (différent de created_at qui est la date d'insertion en DB)
    client_created_at = Column(DateTime, nullable=True)
    
    # Partage et état
    is_shared = Column(Boolean, default=False, nullable=False)
    is_template = Column(Boolean, default=False, nullable=False)
    
    # Statistiques
    storage_size = Column(Integer, default=0, nullable=False)  # En KB
    
    # Relations
    owner = relationship("User", back_populates="workflows")
    simulations = relationship("Simulation", back_populates="workflow", cascade="all, delete-orphan")
    optimizations = relationship("Optimization", back_populates="workflow", cascade="all, delete-orphan")
    flow_ia_analyses = relationship("FlowIAAnalysis", back_populates="workflow", cascade="all, delete-orphan")