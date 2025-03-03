from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.services.database import DatabaseService
from app.services.auth_service import AuthService

class UserService:
    """Service pour gérer les opérations liées aux utilisateurs"""
    
    @staticmethod
    def create_user(db: Session, data: Dict[str, Any]) -> User:
        """
        Crée un nouvel utilisateur
        
        Args:
            db: Session SQLAlchemy
            data: Données de l'utilisateur à créer
        
        Returns:
            L'utilisateur créé
        """
        # Hash du mot de passe (en utilisant AuthService)
        if 'password' in data:
            password = data.pop('password')
            password_hash = AuthService.get_password_hash(password)
            data['password_hash'] = password_hash
            
        # Si le rôle n'est pas spécifié, le mettre à SOLO par défaut
        if 'role' not in data:
            data['role'] = UserRole.SOLO
            
        return DatabaseService.create(db, User, data)
    
    @staticmethod
    def get_user(db: Session, user_id: str) -> Optional[User]:
        """
        Récupère un utilisateur par son ID
        
        Args:
            db: Session SQLAlchemy
            user_id: ID de l'utilisateur
        
        Returns:
            L'utilisateur trouvé ou None
        """
        return DatabaseService.get_by_id(db, User, user_id)
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """
        Récupère un utilisateur par son email
        
        Args:
            db: Session SQLAlchemy
            email: Email de l'utilisateur
        
        Returns:
            L'utilisateur trouvé ou None
        """
        users = DatabaseService.get_all(db, User, filters={"email": email}, limit=1)
        return users[0] if users else None
    
    @staticmethod
    def update_user(db: Session, user_id: str, data: Dict[str, Any]) -> Optional[User]:
        """
        Met à jour un utilisateur existant
        
        Args:
            db: Session SQLAlchemy
            user_id: ID de l'utilisateur à mettre à jour
            data: Données à mettre à jour
        
        Returns:
            L'utilisateur mis à jour ou None
        """
        user = UserService.get_user(db, user_id)
        if not user:
            return None
            
        # Hash du mot de passe si fourni (en utilisant AuthService)
        if 'password' in data:
            password = data.pop('password')
            password_hash = AuthService.get_password_hash(password)
            data['password_hash'] = password_hash
            
        return DatabaseService.update(db, user, data)
    
    @staticmethod
    def delete_user(db: Session, user_id: str) -> bool:
        """
        Supprime un utilisateur
        
        Args:
            db: Session SQLAlchemy
            user_id: ID de l'utilisateur à supprimer
        
        Returns:
            True si suppression réussie, False sinon
        """
        user = UserService.get_user(db, user_id)
        if not user:
            return False
            
        return DatabaseService.delete(db, user)
    
    @staticmethod
    def get_users(db: Session, 
                 skip: int = 0, 
                 limit: int = 100, 
                 filters: Dict[str, Any] = None) -> List[User]:
        """
        Récupère une liste d'utilisateurs avec pagination et filtres optionnels
        
        Args:
            db: Session SQLAlchemy
            skip: Nombre d'éléments à ignorer (pagination)
            limit: Nombre maximum d'éléments à récupérer
            filters: Dictionnaire de filtres {nom_colonne: valeur}
            
        Returns:
            Liste des utilisateurs correspondants
        """
        return DatabaseService.get_all(db, User, skip=skip, limit=limit, filters=filters)
    
    @staticmethod
    def count_users(db: Session, filters: Dict[str, Any] = None) -> int:
        """
        Compte le nombre d'utilisateurs avec filtres optionnels
        
        Args:
            db: Session SQLAlchemy
            filters: Dictionnaire de filtres {nom_colonne: valeur}
            
        Returns:
            Nombre d'utilisateurs correspondants
        """
        return DatabaseService.count(db, User, filters=filters)
    
    @staticmethod
    def user_to_dict(user: User) -> Dict[str, Any]:
        """
        Convertit un utilisateur en dictionnaire (sans le hash du mot de passe)
        
        Args:
            user: Utilisateur à convertir
        
        Returns:
            Dictionnaire représentant l'utilisateur
        """
        user_dict = DatabaseService.to_dict(user)
        
        # Supprimer les données sensibles
        if 'password_hash' in user_dict:
            del user_dict['password_hash']
            
        # Convertir l'enum en string
        if 'role' in user_dict and hasattr(user_dict['role'], 'value'):
            user_dict['role'] = user_dict['role'].value
            
        return user_dict