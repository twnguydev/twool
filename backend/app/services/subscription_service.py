from typing import Dict, Any, Optional, Union
from sqlalchemy.orm import Session
from app.models.subscription import Subscription, SubscriptionType, SubscriptionTier, SubscriptionStatus
from app.models.user import User
from app.models.company import Company
from app.models.license import License, LicenseStatus
from app.services.database import DatabaseService
import uuid
from datetime import datetime, timezone, timedelta

class SubscriptionService:
    """Service pour gérer les opérations liées aux abonnements"""
    
    @staticmethod
    def create_subscription(
        db: Session, 
        data: Dict[str, Any], 
        subscriber: Union[User, Company]
    ) -> Subscription:
        """
        Crée un nouvel abonnement
        
        Args:
            db: Session SQLAlchemy
            data: Données de l'abonnement à créer
            subscriber: Utilisateur ou entreprise qui s'abonne
        
        Returns:
            L'abonnement créé
        """
        # Définir les durées selon le type d'abonnement
        duration_days = 30 if data.get('type') == SubscriptionType.MONTHLY else 365
        
        # Définir les limites selon le niveau d'abonnement
        if data.get('tier') == SubscriptionTier.SOLO:
            data['max_workflows'] = 3
            data['max_storage'] = 500 * 1024  # 500 MB en KB
            data['max_users'] = 1
        else:
            data['max_workflows'] = None  # Illimité
            data['max_storage'] = 5 * 1024 * 1024  # 5 GB en KB
            data['max_users'] = None  # Illimité pour les entreprises
        
        # Calculer la date de fin
        start_date = datetime.now(timezone.utc)
        end_date = start_date + timedelta(days=duration_days)
        
        # Préparer les données de l'abonnement
        subscription_data = {
            'type': data.get('type'),
            'tier': data.get('tier'),
            'status': SubscriptionStatus.ACTIVE,
            'start_date': start_date,
            'end_date': end_date,
            'payment_provider': data.get('payment_provider'),
            'payment_id': data.get('payment_id'),
            'amount': data.get('amount'),
            'currency': data.get('currency', 'EUR'),
            'max_workflows': data.get('max_workflows'),
            'max_storage': data.get('max_storage'),
            'max_users': data.get('max_users')
        }
        
        # Associer à l'utilisateur ou à l'entreprise
        if isinstance(subscriber, User):
            subscription_data['user_id'] = subscriber.id
        else:
            subscription_data['company_id'] = subscriber.id
        
        # Créer l'abonnement
        subscription = DatabaseService.create(db, Subscription, subscription_data)
        
        # Créer une licence pour chaque utilisateur
        if isinstance(subscriber, User):
            SubscriptionService.create_license(db, subscription.id, subscriber.id)
        else:
            # Pour une entreprise, créer une licence pour chaque utilisateur
            for user in subscriber.users:
                SubscriptionService.create_license(db, subscription.id, user.id)
        
        return subscription
    
    @staticmethod
    def get_subscription(db: Session, subscription_id: str) -> Optional[Subscription]:
        """
        Récupère un abonnement par son ID
        
        Args:
            db: Session SQLAlchemy
            subscription_id: ID de l'abonnement
        
        Returns:
            L'abonnement trouvé ou None
        """
        return DatabaseService.get_by_id(db, Subscription, subscription_id)
    
    @staticmethod
    def get_user_subscription(db: Session, user_id: str) -> Optional[Subscription]:
        """
        Récupère l'abonnement d'un utilisateur
        
        Args:
            db: Session SQLAlchemy
            user_id: ID de l'utilisateur
        
        Returns:
            L'abonnement de l'utilisateur ou None
        """
        return db.query(Subscription).filter(Subscription.user_id == user_id).first()
    
    @staticmethod
    def get_company_subscription(db: Session, company_id: str) -> Optional[Subscription]:
        """
        Récupère l'abonnement d'une entreprise
        
        Args:
            db: Session SQLAlchemy
            company_id: ID de l'entreprise
        
        Returns:
            L'abonnement de l'entreprise ou None
        """
        return db.query(Subscription).filter(Subscription.company_id == company_id).first()
    
    @staticmethod
    def cancel_subscription(db: Session, subscription_id: str) -> Optional[Subscription]:
        """
        Annule un abonnement
        
        Args:
            db: Session SQLAlchemy
            subscription_id: ID de l'abonnement à annuler
        
        Returns:
            L'abonnement annulé ou None
        """
        subscription = SubscriptionService.get_subscription(db, subscription_id)
        if not subscription:
            return None
            
        # Mettre à jour le statut
        return DatabaseService.update(db, subscription, {
            'status': SubscriptionStatus.CANCELED
        })
    
    @staticmethod
    def renew_subscription(db: Session, subscription_id: str, duration_months: int = 1) -> Optional[Subscription]:
        """
        Renouvelle un abonnement
        
        Args:
            db: Session SQLAlchemy
            subscription_id: ID de l'abonnement à renouveler
            duration_months: Durée du renouvellement en mois
        
        Returns:
            L'abonnement renouvelé ou None
        """
        subscription = SubscriptionService.get_subscription(db, subscription_id)
        if not subscription:
            return None
            
        # Calculer la nouvelle date de fin
        new_end_date = subscription.end_date + timedelta(days=30 * duration_months)
        
        # Mettre à jour l'abonnement
        return DatabaseService.update(db, subscription, {
            'status': SubscriptionStatus.ACTIVE,
            'end_date': new_end_date
        })
    
    @staticmethod
    def create_license(db: Session, subscription_id: str, user_id: str, is_admin: bool = False) -> License:
        """
        Crée une licence pour un utilisateur
        
        Args:
            db: Session SQLAlchemy
            subscription_id: ID de l'abonnement
            user_id: ID de l'utilisateur
            is_admin: Si l'utilisateur est administrateur
        
        Returns:
            La licence créée
        """
        # Récupérer l'abonnement
        subscription = SubscriptionService.get_subscription(db, subscription_id)
        
        # Générer une clé de licence unique
        license_key = f"TW-{uuid.uuid4()}"
        
        # Créer la licence
        license_data = {
            'key': license_key,
            'subscription_id': subscription_id,
            'user_id': user_id,
            'status': LicenseStatus.ACTIVE,
            'expiration_date': subscription.end_date,
            'is_admin': is_admin
        }
        
        return DatabaseService.create(db, License, license_data)
    
    @staticmethod
    def validate_license(db: Session, license_key: str, device_id: str = None) -> Optional[License]:
        """
        Valide une clé de licence
        
        Args:
            db: Session SQLAlchemy
            license_key: Clé de licence à valider
            device_id: ID de l'appareil (optionnel)
        
        Returns:
            La licence si valide ou None
        """
        license = db.query(License).filter(
            License.key == license_key, 
            License.status == LicenseStatus.ACTIVE
        ).first()
        
        if not license:
            return None
            
        # Vérifier si la licence est expirée
        if license.expiration_date < datetime.now(timezone.utc):
            license.status = LicenseStatus.EXPIRED
            db.commit()
            return None
            
        # Si c'est la première activation, mettre à jour la date d'activation et l'appareil
        if not license.activation_date:
            license.activation_date = datetime.now(timezone.utc)
            
        # Mettre à jour l'ID de l'appareil si fourni
        if device_id:
            license.device_id = device_id
            
        db.commit()
        
        return license
    
    @staticmethod
    def revoke_license(db: Session, license_id: str) -> Optional[License]:
        """
        Révoque une licence
        
        Args:
            db: Session SQLAlchemy
            license_id: ID de la licence à révoquer
        
        Returns:
            La licence révoquée ou None
        """
        license = DatabaseService.get_by_id(db, License, license_id)
        if not license:
            return None
            
        # Mettre à jour le statut
        return DatabaseService.update(db, license, {
            'status': LicenseStatus.REVOKED
        })
    
    @staticmethod
    def subscription_to_dict(subscription: Subscription) -> Dict[str, Any]:
        """
        Convertit un abonnement en dictionnaire
        
        Args:
            subscription: Abonnement à convertir
        
        Returns:
            Dictionnaire représentant l'abonnement
        """
        subscription_dict = DatabaseService.to_dict(subscription)
        
        # Convertir les enums en string
        for key in ['type', 'tier', 'status']:
            if key in subscription_dict and hasattr(subscription_dict[key], 'value'):
                subscription_dict[key] = subscription_dict[key].value
                
        return subscription_dict
    
    @staticmethod
    def license_to_dict(license: License) -> Dict[str, Any]:
        """
        Convertit une licence en dictionnaire
        
        Args:
            license: Licence à convertir
        
        Returns:
            Dictionnaire représentant la licence
        """
        license_dict = DatabaseService.to_dict(license)
        
        # Convertir les enums en string
        if 'status' in license_dict and hasattr(license_dict['status'], 'value'):
            license_dict['status'] = license_dict['status'].value
            
        return license_dict