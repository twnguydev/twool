from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.company import Company
from app.models.user import User, UserRole
from app.services.database import DatabaseService

class CompanyService:
    """Service pour gérer les opérations liées aux entreprises"""
    
    @staticmethod
    def create_company(db: Session, data: Dict[str, Any]) -> Company:
        """
        Crée une nouvelle entreprise
        
        Args:
            db: Session SQLAlchemy
            data: Données de l'entreprise à créer
        
        Returns:
            L'entreprise créée
        """
        return DatabaseService.create(db, Company, data)
    
    @staticmethod
    def get_company(db: Session, company_id: str) -> Optional[Company]:
        """
        Récupère une entreprise par son ID
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise
        
        Returns:
            L'entreprise trouvée ou None
        """
        return DatabaseService.get_by_id(db, Company, company_id)
    
    @staticmethod
    def update_company(db: Session, company_id: str, data: Dict[str, Any]) -> Optional[Company]:
        """
        Met à jour une entreprise existante
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise à mettre à jour
            data: Données à mettre à jour
        
        Returns:
            L'entreprise mise à jour ou None
        """
        company = CompanyService.get_company(db, company_id)
        if not company:
            return None
            
        return DatabaseService.update(db, company, data)
    
    @staticmethod
    def delete_company(db: Session, company_id: str) -> bool:
        """
        Supprime une entreprise
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise à supprimer
        
        Returns:
            True si suppression réussie, False sinon
        """
        company = CompanyService.get_company(db, company_id)
        if not company:
            return False
            
        return DatabaseService.delete(db, company)
    
    @staticmethod
    def add_user_to_company(db: Session, company_id: str, user_id: str, role: UserRole = UserRole.CONSULTANT) -> Optional[User]:
        """
        Ajoute un utilisateur à une entreprise
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise
            user_id: ID de l'utilisateur à ajouter
            role: Rôle de l'utilisateur dans l'entreprise
        
        Returns:
            L'utilisateur mis à jour ou None
        """
        company = CompanyService.get_company(db, company_id)
        user = db.query(User).filter(User.id == user_id).first()
        
        if not company or not user:
            return None
            
        # Mettre à jour l'utilisateur
        user.company_id = company_id
        user.role = role
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def remove_user_from_company(db: Session, company_id: str, user_id: str) -> Optional[User]:
        """
        Retire un utilisateur d'une entreprise
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise
            user_id: ID de l'utilisateur à retirer
        
        Returns:
            L'utilisateur mis à jour ou None
        """
        user = db.query(User).filter(
            User.id == user_id,
            User.company_id == company_id
        ).first()
        
        if not user:
            return None
            
        # Retirer l'utilisateur de l'entreprise
        user.company_id = None
        user.role = UserRole.SOLO  # Redevient un utilisateur solo
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def get_company_users(db: Session, company_id: str, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Récupère tous les utilisateurs d'une entreprise
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise
            skip: Nombre d'éléments à ignorer
            limit: Nombre maximum d'éléments à récupérer
        
        Returns:
            Liste des utilisateurs de l'entreprise
        """
        return db.query(User).filter(
            User.company_id == company_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    def company_to_dict(company: Company) -> Dict[str, Any]:
        """
        Convertit une entreprise en dictionnaire
        
        Args:
            company: Entreprise à convertir
        
        Returns:
            Dictionnaire représentant l'entreprise
        """
        return DatabaseService.to_dict(company)