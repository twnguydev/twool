from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.simulation import Simulation, SimulationStatus
from app.models.workflow import Workflow
from app.services.database import DatabaseService

class SimulationService:
    """Service pour gérer les opérations spécifiques aux simulations"""
    
    @staticmethod
    def create_simulation(db: Session, data: Dict[str, Any]) -> Simulation:
        """
        Crée une nouvelle simulation
        
        Args:
            db: Session SQLAlchemy
            data: Données de la simulation à créer
        
        Returns:
            La simulation créée
        """
        if 'status' not in data:
            data['status'] = SimulationStatus.PENDING
            
        return DatabaseService.create(db, Simulation, data)
    
    @staticmethod
    def get_simulation(db: Session, simulation_id: str) -> Optional[Simulation]:
        """
        Récupère une simulation par son ID
        
        Args:
            db: Session SQLAlchemy
            simulation_id: ID de la simulation
        
        Returns:
            La simulation trouvée ou None
        """
        return DatabaseService.get_by_id(db, Simulation, simulation_id)
    
    @staticmethod
    def get_simulations_by_workflow(db: Session, workflow_id: str, skip: int = 0, limit: int = 100) -> List[Simulation]:
        """
        Récupère toutes les simulations pour un workflow donné
        
        Args:
            db: Session SQLAlchemy
            workflow_id: ID du workflow
            skip: Nombre d'éléments à ignorer
            limit: Nombre maximum d'éléments à récupérer
        
        Returns:
            Liste des simulations
        """
        filters = {'workflow_id': workflow_id}
        return DatabaseService.get_all(db, Simulation, skip, limit, filters)
    
    @staticmethod
    def update_simulation_status(db: Session, simulation_id: str, status: SimulationStatus, 
                                 metrics: Dict[str, Any] = None, details: Dict[str, Any] = None,
                                 error_message: str = None) -> Optional[Simulation]:
        """
        Met à jour le statut d'une simulation
        
        Args:
            db: Session SQLAlchemy
            simulation_id: ID de la simulation
            status: Nouveau statut
            metrics: Métriques de la simulation (si terminée)
            details: Détails de la simulation (si terminée)
            error_message: Message d'erreur (si échouée)
        
        Returns:
            La simulation mise à jour ou None
        """
        simulation = SimulationService.get_simulation(db, simulation_id)
        if not simulation:
            return None
        
        data = {'status': status}
        if metrics:
            data['metrics'] = metrics
        if details:
            data['details'] = details
        if error_message:
            data['error_message'] = error_message
            
        return DatabaseService.update(db, simulation, data)
    
    @staticmethod
    def delete_simulation(db: Session, simulation_id: str) -> bool:
        """
        Supprime une simulation
        
        Args:
            db: Session SQLAlchemy
            simulation_id: ID de la simulation à supprimer
        
        Returns:
            True si suppression réussie, False sinon
        """
        simulation = SimulationService.get_simulation(db, simulation_id)
        if simulation:
            return DatabaseService.delete(db, simulation)
        return False
    
    @staticmethod
    def simulation_to_dict(simulation: Simulation) -> Dict[str, Any]:
        """
        Convertit une simulation en dictionnaire
        
        Args:
            simulation: Simulation à convertir
        
        Returns:
            Dictionnaire représentant la simulation
        """
        result = DatabaseService.to_dict(simulation)
        
        # Convertir l'enum en string
        if 'status' in result and isinstance(result['status'], SimulationStatus):
            result['status'] = result['status'].value
            
        return result