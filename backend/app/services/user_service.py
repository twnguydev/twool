from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.services.database import DatabaseService
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration JWT
JWT_SECRET = os.getenv("JWT_SECRET", "default_secret_key_change_in_production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION = 24  # heures

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
        # Hash du mot de passe
        if 'password' in data:
            password = data.pop('password')
            password_hash = UserService.hash_password(password)
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
        return db.query(User).filter(User.email == email).first()
    
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
            
        # Hash du mot de passe si fourni
        if 'password' in data:
            password = data.pop('password')
            password_hash = UserService.hash_password(password)
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
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Vérifie si un mot de passe correspond au hash stocké
        
        Args:
            plain_password: Mot de passe en clair
            hashed_password: Hash du mot de passe
        
        Returns:
            True si le mot de passe correspond, False sinon
        """
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash un mot de passe avec bcrypt
        
        Args:
            password: Mot de passe à hasher
        
        Returns:
            Hash du mot de passe
        """
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def create_access_token(user_id: str, expiration: int = JWT_EXPIRATION) -> str:
        """
        Crée un token JWT pour l'authentification
        
        Args:
            user_id: ID de l'utilisateur
            expiration: Durée de validité en heures
        
        Returns:
            Token JWT
        """
        payload = {
            "sub": user_id,
            "exp": datetime.utcnow() + timedelta(hours=expiration),
            "iat": datetime.utcnow()
        }
        
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    @staticmethod
    def verify_token(token: str) -> Optional[str]:
        """
        Vérifie la validité d'un token JWT et extrait l'ID utilisateur
        
        Args:
            token: Token JWT
        
        Returns:
            ID de l'utilisateur si le token est valide, None sinon
        """
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload.get("sub")
        except jwt.PyJWTError:
            return None
    
    @staticmethod
    def get_current_user(db: Session, token: str) -> Optional[User]:
        """
        Récupère l'utilisateur actuel à partir d'un token
        
        Args:
            db: Session SQLAlchemy
            token: Token JWT
        
        Returns:
            L'utilisateur si le token est valide, None sinon
        """
        user_id = UserService.verify_token(token)
        if not user_id:
            return None
            
        return UserService.get_user(db, user_id)
    
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