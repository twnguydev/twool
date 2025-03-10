from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.optimization import Optimization, OptimizationStatus
from app.services.database import DatabaseService

class OptimizationService:
    """Service pour gérer les opérations spécifiques aux optimisations"""
    
    @staticmethod
    def create_optimization(db: Session, data: Dict[str, Any]) -> Optimization:
        """
        Crée une nouvelle optimisation
        
        Args:
            db: Session SQLAlchemy
            data: Données de l'optimisation à créer
        
        Returns:
            L'optimisation créée
        """
        if 'status' not in data:
            data['status'] = OptimizationStatus.PENDING
            
        return DatabaseService.create(db, Optimization, data)
    
    @staticmethod
    def get_optimization(db: Session, optimization_id: str) -> Optional[Optimization]:
        """
        Récupère une optimisation par son ID
        
        Args:
            db: Session SQLAlchemy
            optimization_id: ID de l'optimisation
        
        Returns:
            L'optimisation trouvée ou None
        """
        return DatabaseService.get_by_id(db, Optimization, optimization_id)
    
    @staticmethod
    def get_optimizations_by_workflow(db: Session, workflow_id: str, skip: int = 0, limit: int = 100) -> List[Optimization]:
        """
        Récupère toutes les optimisations pour un workflow donné
        
        Args:
            db: Session SQLAlchemy
            workflow_id: ID du workflow
            skip: Nombre d'éléments à ignorer
            limit: Nombre maximum d'éléments à récupérer
        
        Returns:
            Liste des optimisations
        """
        filters = {'workflow_id': workflow_id}
        return DatabaseService.get_all(db, Optimization, skip, limit, filters)
    
    @staticmethod
    def get_optimizations_by_simulation(db: Session, simulation_id: str, skip: int = 0, limit: int = 100) -> List[Optimization]:
        """
        Récupère toutes les optimisations pour une simulation donnée
        
        Args:
            db: Session SQLAlchemy
            simulation_id: ID de la simulation
            skip: Nombre d'éléments à ignorer
            limit: Nombre maximum d'éléments à récupérer
        
        Returns:
            Liste des optimisations
        """
        filters = {'simulation_id': simulation_id}
        return DatabaseService.get_all(db, Optimization, skip, limit, filters)
    
    @staticmethod
    def update_optimization_status(db: Session, optimization_id: str, status: OptimizationStatus, 
                                  suggestions: List[Dict[str, Any]] = None, 
                                  error_message: str = None) -> Optional[Optimization]:
        """
        Met à jour le statut d'une optimisation
        
        Args:
            db: Session SQLAlchemy
            optimization_id: ID de l'optimisation
            status: Nouveau statut
            suggestions: Suggestions d'optimisation (si terminée)
            error_message: Message d'erreur (si échouée)
        
        Returns:
            L'optimisation mise à jour ou None
        """
        optimization = OptimizationService.get_optimization(db, optimization_id)
        if not optimization:
            return None
        
        data = {'status': status}
        if suggestions:
            data['suggestions'] = suggestions
        if error_message:
            data['error_message'] = error_message
            
        return DatabaseService.update(db, optimization, data)
    
    @staticmethod
    def delete_optimization(db: Session, optimization_id: str) -> bool:
        """
        Supprime une optimisation
        
        Args:
            db: Session SQLAlchemy
            optimization_id: ID de l'optimisation à supprimer
        
        Returns:
            True si suppression réussie, False sinon
        """
        optimization = OptimizationService.get_optimization(db, optimization_id)
        if optimization:
            return DatabaseService.delete(db, optimization)
        return False
    
    @staticmethod
    def optimization_to_dict(optimization: Optimization) -> Dict[str, Any]:
        """
        Convertit une optimisation en dictionnaire
        
        Args:
            optimization: Optimisation à convertir
        
        Returns:
            Dictionnaire représentant l'optimisation
        """
        result = DatabaseService.to_dict(optimization)
        
        # Convertir l'enum en string
        if 'status' in result and isinstance(result['status'], OptimizationStatus):
            result['status'] = result['status'].value
            
        return result