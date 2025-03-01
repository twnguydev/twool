from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.workflow import Workflow
from app.models.user import User
from app.models.subscription import Subscription
from app.services.database import DatabaseService
from datetime import datetime
import json

class WorkflowService:
    """Service pour gérer les opérations liées aux workflows"""
    
    @staticmethod
    def create_workflow(db: Session, data: Dict[str, Any], user: User) -> Optional[Workflow]:
        """
        Crée un nouveau workflow
        
        Args:
            db: Session SQLAlchemy
            data: Données du workflow à créer
            user: Utilisateur qui crée le workflow
        
        Returns:
            Le workflow créé ou None si quota dépassé
        """
        # Vérifier si l'utilisateur a un abonnement actif
        subscription = db.query(Subscription).filter(
            (Subscription.user_id == user.id) |
            (Subscription.company_id == user.company_id if user.company_id else False)
        ).first()
        
        if not subscription or not subscription.is_active:
            return None
        
        # Pour les utilisateurs solo, vérifier le quota de workflows
        if user.is_solo and subscription.max_workflows is not None:
            # Compter les workflows existants
            workflow_count = db.query(Workflow).filter(Workflow.owner_id == user.id).count()
            
            if workflow_count >= subscription.max_workflows:
                return None  # Quota dépassé
        
        # Extraire les nœuds et arêtes du payload ou initialiser à vide si non fournis
        nodes = data.get('nodes', [])
        edges = data.get('edges', [])
        
        # Calculer la taille approximative du stockage (en KB)
        storage_size = len(json.dumps(nodes) + json.dumps(edges)) // 1024 + 1  # +1 pour éviter 0 sur petits workflows
        
        # Extraire le client_created_at s'il est fourni
        client_created_at = data.get('createdAt') or data.get('client_created_at')
        if client_created_at and isinstance(client_created_at, str):
            try:
                client_created_at = datetime.fromisoformat(client_created_at.replace('Z', '+00:00'))
            except ValueError:
                client_created_at = datetime.utcnow()
        
        # Préparer les données du workflow
        workflow_data = {
            'name': data.get('name', 'Nouveau Workflow'),
            'description': data.get('description'),
            'owner_id': user.id,
            'company_id': user.company_id,
            'nodes': nodes,
            'edges': edges,
            'client_created_at': client_created_at,
            'is_shared': data.get('is_shared', False),
            'is_template': data.get('is_template', False),
            'storage_size': storage_size
        }
        
        # Créer le workflow
        workflow = DatabaseService.create(db, Workflow, workflow_data)
        
        # Mettre à jour le stockage utilisé par l'utilisateur
        if workflow:
            user.storage_used += storage_size
            db.commit()
        
        return workflow
    
    @staticmethod
    def get_workflow(db: Session, workflow_id: str) -> Optional[Workflow]:
        """
        Récupère un workflow par son ID
        
        Args:
            db: Session SQLAlchemy
            workflow_id: ID du workflow
        
        Returns:
            Le workflow trouvé ou None
        """
        return DatabaseService.get_by_id(db, Workflow, workflow_id)
    
    @staticmethod
    def get_user_workflows(db: Session, user_id: str, skip: int = 0, limit: int = 100) -> List[Workflow]:
        """
        Récupère tous les workflows d'un utilisateur
        
        Args:
            db: Session SQLAlchemy
            user_id: ID de l'utilisateur
            skip: Nombre d'éléments à ignorer
            limit: Nombre maximum d'éléments à récupérer
        
        Returns:
            Liste des workflows de l'utilisateur
        """
        return db.query(Workflow).filter(Workflow.owner_id == user_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_company_workflows(db: Session, company_id: str, skip: int = 0, limit: int = 100) -> List[Workflow]:
        """
        Récupère tous les workflows d'une entreprise
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise
            skip: Nombre d'éléments à ignorer
            limit: Nombre maximum d'éléments à récupérer
        
        Returns:
            Liste des workflows de l'entreprise
        """
        return db.query(Workflow).filter(Workflow.company_id == company_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_workflow(db: Session, workflow_id: str, data: Dict[str, Any]) -> Optional[Workflow]:
        """
        Met à jour un workflow existant
        
        Args:
            db: Session SQLAlchemy
            workflow_id: ID du workflow à mettre à jour
            data: Données à mettre à jour
        
        Returns:
            Le workflow mis à jour ou None
        """
        workflow = WorkflowService.get_workflow(db, workflow_id)
        if not workflow:
            return None
            
        # Si on met à jour les nœuds ou les arêtes, recalculer la taille de stockage
        if 'nodes' in data or 'edges' in data:
            nodes = data.get('nodes', workflow.nodes)
            edges = data.get('edges', workflow.edges)
            
            # Calculer la nouvelle taille
            new_size = len(json.dumps(nodes) + json.dumps(edges)) // 1024 + 1
            
            # Mettre à jour le stockage utilisé par l'utilisateur
            user = db.query(User).filter(User.id == workflow.owner_id).first()
            if user:
                # Ajuster la différence
                size_diff = new_size - workflow.storage_size
                user.storage_used += size_diff
                db.commit()
                
            # Ajouter la taille aux données à mettre à jour
            data['storage_size'] = new_size
            
        return DatabaseService.update(db, workflow, data)
    
    @staticmethod
    def delete_workflow(db: Session, workflow_id: str) -> bool:
        """
        Supprime un workflow
        
        Args:
            db: Session SQLAlchemy
            workflow_id: ID du workflow à supprimer
        
        Returns:
            True si suppression réussie, False sinon
        """
        workflow = WorkflowService.get_workflow(db, workflow_id)
        if not workflow:
            return False
            
        # Récupérer l'utilisateur pour mettre à jour son stockage utilisé
        user = db.query(User).filter(User.id == workflow.owner_id).first()
        if user:
            user.storage_used -= workflow.storage_size
            if user.storage_used < 0:
                user.storage_used = 0
            db.commit()
            
        return DatabaseService.delete(db, workflow)
    
    @staticmethod
    def check_user_access(db: Session, workflow_id: str, user_id: str) -> bool:
        """
        Vérifie si un utilisateur a accès à un workflow
        
        Args:
            db: Session SQLAlchemy
            workflow_id: ID du workflow
            user_id: ID de l'utilisateur
        
        Returns:
            True si l'utilisateur a accès, False sinon
        """
        workflow = WorkflowService.get_workflow(db, workflow_id)
        if not workflow:
            return False
            
        # Propriétaire du workflow
        if workflow.owner_id == user_id:
            return True
            
        # Membre de l'entreprise (pour les workflows partagés)
        user = db.query(User).filter(User.id == user_id).first()
        if user and workflow.company_id and user.company_id == workflow.company_id and workflow.is_shared:
            return True
            
        return False
    
    @staticmethod
    def workflow_to_dict(workflow: Workflow) -> Dict[str, Any]:
        """
        Convertit un workflow en dictionnaire
        
        Args:
            workflow: Workflow à convertir
        
        Returns:
            Dictionnaire représentant le workflow
        """
        workflow_dict = DatabaseService.to_dict(workflow)
        
        # Convertir client_created_at en ISO format
        if workflow_dict.get('client_created_at'):
            workflow_dict['createdAt'] = workflow_dict['client_created_at']
            
        return workflow_dict