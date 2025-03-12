from sqlalchemy.orm import Session
from typing import TypeVar, Type, List, Dict, Any, Optional
import uuid
from datetime import datetime

T = TypeVar('T')

class DatabaseService:
    """
    Service générique pour gérer les opérations CRUD sur les modèles SQLAlchemy
    """
    
    @staticmethod
    def generate_id(prefix: str = "") -> str:
        """Génère un ID unique avec un préfixe optionnel"""
        return f"{prefix}{uuid.uuid4()}"
    
    @staticmethod
    def create(db: Session, model_class: Type[T], data: Dict[str, Any]) -> T:
        """
        Crée une nouvelle instance d'un modèle et la sauvegarde en base
        
        Args:
            db: Session SQLAlchemy
            model_class: Classe du modèle à créer
            data: Dictionnaire de données pour créer l'instance
            
        Returns:
            L'instance créée
        """
        # Si l'ID n'est pas fourni, en générer un
        if 'id' not in data:
            prefix = model_class.__tablename__.rstrip('s')[0:3] + '-'
            data['id'] = DatabaseService.generate_id(prefix)
        
        instance = model_class(**data)
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance
    
    @staticmethod
    def get_by_id(db: Session, model_class: Type[T], id: str) -> Optional[T]:
        """
        Récupère une instance par son ID
        
        Args:
            db: Session SQLAlchemy
            model_class: Classe du modèle à récupérer
            id: ID de l'instance
            
        Returns:
            L'instance trouvée ou None si non trouvée
        """
        return db.query(model_class).filter(model_class.id == id).first()
    
    @staticmethod
    def get_by(db: Session, model_class: Type[T], filters: Dict[str, Any]) -> Optional[T]:
        """
        Récupère une instance par des filtres
        
        Args:
            db: Session SQLAlchemy
            model_class: Classe du modèle à récupérer
            filters: Dictionnaire de filtres {nom_colonne: valeur}
            
        Returns:
            L'instance trouvée ou None si non trouvée
        """
        query = db.query(model_class)

        for key, value in filters.items():
            if hasattr(model_class, key):
                query = query.filter(getattr(model_class, key) == value)
        
        return query.first()
    
    @staticmethod
    def get_all(db: Session, model_class: Type[T], 
                skip: int = 0, limit: int = 100, 
                filters: Dict[str, Any] = None) -> List[T]:
        """
        Récupère toutes les instances d'un modèle avec pagination et filtres optionnels
        
        Args:
            db: Session SQLAlchemy
            model_class: Classe du modèle à récupérer
            skip: Nombre d'éléments à ignorer (pagination)
            limit: Nombre maximum d'éléments à récupérer
            filters: Dictionnaire de filtres {nom_colonne: valeur}
            
        Returns:
            Liste des instances correspondantes
        """
        query = db.query(model_class)
        
        # Appliquer les filtres
        if filters:
            for key, value in filters.items():
                if hasattr(model_class, key):
                    query = query.filter(getattr(model_class, key) == value)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update(db: Session, instance: T, data: Dict[str, Any]) -> T:
        """
        Met à jour une instance existante
        
        Args:
            db: Session SQLAlchemy
            instance: Instance à mettre à jour
            data: Dictionnaire de données à mettre à jour
            
        Returns:
            L'instance mise à jour
        """
        # Mise à jour des attributs
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        
        db.commit()
        db.refresh(instance)
        return instance
    
    @staticmethod
    def delete(db: Session, instance: T) -> bool:
        """
        Supprime une instance
        
        Args:
            db: Session SQLAlchemy
            instance: Instance à supprimer
            
        Returns:
            True si suppression réussie
        """
        db.delete(instance)
        db.commit()
        return True
    
    @staticmethod
    def to_dict(instance: T) -> Dict[str, Any]:
        """
        Convertit une instance en dictionnaire
        
        Args:
            instance: Instance à convertir
            
        Returns:
            Dictionnaire représentant l'instance
        """
        result = {}
        for column in instance.__table__.columns:
            value = getattr(instance, column.name)
            
            # Conversion des types non sérialisables
            if isinstance(value, datetime):
                value = value.isoformat()
                
            result[column.name] = value
            
        return result
    
    @staticmethod
    def count(db: Session, model_class: Type[T], filters: Dict[str, Any] = None) -> int:
        """
        Compte le nombre d'instances d'un modèle avec filtres optionnels
        
        Args:
            db: Session SQLAlchemy
            model_class: Classe du modèle à compter
            filters: Dictionnaire de filtres {nom_colonne: valeur}
            
        Returns:
            Nombre d'instances correspondantes
        """
        query = db.query(model_class)
        
        # Appliquer les filtres
        if filters:
            for key, value in filters.items():
                if hasattr(model_class, key):
                    query = query.filter(getattr(model_class, key) == value)
        
        return query.count()