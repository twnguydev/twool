from datetime import datetime, timedelta
import uuid
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.models.user import User, UserRole
from app.models.subscription import Subscription, SubscriptionTier, SubscriptionType, SubscriptionStatus
from app.models.license import License, LicenseStatus
from app.services.database import DatabaseService
from app.config import settings
from app.database import get_db

# Configuration de la sécurité
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Classe du service d'authentification
class AuthService:
    @staticmethod
    def verify_password(plain_password, hashed_password):
        """Vérifier si un mot de passe correspond au hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password):
        """Générer un hash à partir d'un mot de passe"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None):
        """Créer un token JWT"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        
        return encoded_jwt
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        """Authentifier un utilisateur avec email et mot de passe"""
        # Utiliser les filtres du DatabaseService
        users = DatabaseService.get_all(db, User, filters={"email": email}, limit=1)
        
        if not users:
            return None
        
        user = users[0]
        
        if not AuthService.verify_password(password, user.password_hash):
            return None
            
        if not user.is_active:
            return None
            
        return user
    
    @staticmethod
    def register_user(
        db: Session, 
        email: str, 
        password: str, 
        first_name: str, 
        last_name: str,
        license_key: str = None,
        subscription_data: dict = None
    ):
        """
        Enregistrer un nouvel utilisateur
        
        Args:
            db: Session de base de données
            email: Email de l'utilisateur
            password: Mot de passe en clair
            first_name: Prénom
            last_name: Nom
            license_key: Clé de licence (optionnel)
            subscription_data: Données d'abonnement (optionnel)
            
        Returns:
            Le nouvel utilisateur créé
        """
        # Vérifier si l'email existe déjà avec DatabaseService
        existing_users = DatabaseService.get_all(db, User, filters={"email": email}, limit=1)
        if existing_users:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Un utilisateur avec cet email existe déjà"
            )
        
        # Préparer les données utilisateur
        user_data = {
            "id": f"usr-{uuid.uuid4().hex[:8]}",
            "email": email,
            "password_hash": AuthService.get_password_hash(password),
            "first_name": first_name,
            "last_name": last_name,
            "role": UserRole.SOLO,
            "is_active": True
        }
        
        # Créer l'utilisateur avec DatabaseService
        user = DatabaseService.create(db, User, user_data)
        
        try:
            # Traiter la licence si fournie
            if license_key:
                AuthService.activate_license(db, user, license_key)
            # Sinon, créer un abonnement si les données sont fournies
            elif subscription_data:
                AuthService.create_subscription(db, user, subscription_data)
            else:
                # Créer un abonnement par défaut (version d'essai)
                AuthService.create_trial_subscription(db, user)
            
            db.commit()
            return user
            
        except Exception as e:
            db.rollback()
            raise e
    
    @staticmethod
    def activate_license(db: Session, user: User, license_key: str):
        """
        Activer une licence pour un utilisateur
        
        Args:
            db: Session de base de données
            user: L'utilisateur
            license_key: Clé de licence à activer
        """
        # Nettoyer la clé (enlever les espaces et tirets)
        clean_key = license_key.replace("-", "").replace(" ", "").upper()
        formatted_key = "-".join([clean_key[i:i+4] for i in range(0, len(clean_key), 4)])
        
        # Chercher la licence avec DatabaseService
        licenses = DatabaseService.get_all(db, License, filters={"key": formatted_key}, limit=1)
        
        if not licenses:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Licence non trouvée"
            )
            
        license_obj = licenses[0]
            
        if license_obj.status != LicenseStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cette licence n'est plus active"
            )
            
        if license_obj.user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cette licence est déjà utilisée"
            )
            
        if license_obj.expiration_date < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cette licence a expiré"
            )
        
        # Récupérer l'abonnement lié à la licence avec DatabaseService
        subscription = DatabaseService.get_by_id(db, Subscription, license_obj.subscription_id)
        
        if not subscription:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Erreur: Abonnement lié à la licence introuvable"
            )
        
        # Mettre à jour la licence avec DatabaseService
        license_update_data = {
            "user_id": user.id,
            "activation_date": datetime.utcnow()
        }
        DatabaseService.update(db, license_obj, license_update_data)
        
        # Préparer les données de mise à jour de l'utilisateur
        user_update_data = {}
        
        # Mettre à jour l'utilisateur (rôle et entreprise)
        if license_obj.is_admin:
            if subscription.tier == SubscriptionTier.BUSINESS:
                user_update_data["role"] = UserRole.MANAGER
            elif subscription.tier == SubscriptionTier.ENTERPRISE:
                user_update_data["role"] = UserRole.ADMIN
        else:
            user_update_data["role"] = UserRole.CONSULTANT
        
        # Si l'abonnement est lié à une entreprise, associer l'utilisateur
        if subscription.company_id:
            user_update_data["company_id"] = subscription.company_id
        
        # Mettre à jour l'utilisateur avec DatabaseService si des modifications sont nécessaires
        if user_update_data:
            DatabaseService.update(db, user, user_update_data)
        
        return license_obj
    
    @staticmethod
    def create_subscription(db: Session, user: User, subscription_data: dict):
        """
        Créer un abonnement pour un utilisateur
        
        Args:
            db: Session de base de données
            user: L'utilisateur
            subscription_data: Données de l'abonnement
        """
        sub_type = SubscriptionType(subscription_data.get("type", "monthly"))
        sub_tier = SubscriptionTier(subscription_data.get("tier", "solo"))
        
        # Déterminer la durée de l'abonnement
        if sub_type == SubscriptionType.MONTHLY:
            duration = timedelta(days=30)
            
            # Prix selon le niveau d'abonnement
            if sub_tier == SubscriptionTier.SOLO:
                amount = 29.0
            elif sub_tier == SubscriptionTier.BUSINESS:
                amount = 99.0
            else:  # Enterprise
                amount = 249.0
        else:  # Annuel
            duration = timedelta(days=365)
            
            # Prix selon le niveau d'abonnement
            if sub_tier == SubscriptionTier.SOLO:
                amount = 290.0
            elif sub_tier == SubscriptionTier.BUSINESS:
                amount = 990.0
            else:  # Enterprise
                amount = 2490.0
        
        # Limites selon le niveau d'abonnement
        if sub_tier == SubscriptionTier.SOLO:
            max_workflows = 3
            max_storage = 500 * 1024  # 500 MB en KB
            max_users = 1
        elif sub_tier == SubscriptionTier.BUSINESS:
            max_workflows = None  # Illimité
            max_storage = 5 * 1024 * 1024  # 5 GB en KB
            max_users = 5
        else:  # Enterprise
            max_workflows = None  # Illimité
            max_storage = None  # Illimité
            max_users = None  # Illimité
        
        # Préparer les données d'abonnement
        subscription_create_data = {
            "id": f"sub-{uuid.uuid4().hex[:8]}",
            "user_id": user.id,
            "type": sub_type,
            "tier": sub_tier,
            "status": SubscriptionStatus.ACTIVE,
            "start_date": datetime.utcnow(),
            "end_date": datetime.utcnow() + duration,
            "payment_provider": subscription_data.get("payment_provider"),
            "payment_id": subscription_data.get("payment_id"),
            "amount": amount,
            "currency": "EUR",
            "max_workflows": max_workflows,
            "max_storage": max_storage,
            "max_users": max_users
        }
        
        # Créer l'abonnement avec DatabaseService
        subscription = DatabaseService.create(db, Subscription, subscription_create_data)
        return subscription
    
    @staticmethod
    def create_trial_subscription(db: Session, user: User):
        """
        Créer un abonnement d'essai pour un nouvel utilisateur
        
        Args:
            db: Session de base de données
            user: L'utilisateur
        """
        # Préparer les données d'abonnement d'essai
        trial_subscription_data = {
            "id": f"sub-{uuid.uuid4().hex[:8]}",
            "user_id": user.id,
            "type": SubscriptionType.MONTHLY,
            "tier": SubscriptionTier.SOLO,
            "status": SubscriptionStatus.ACTIVE,
            "start_date": datetime.utcnow(),
            "end_date": datetime.utcnow() + timedelta(days=14),
            "amount": 0.0,  # Gratuit
            "currency": "EUR",
            "max_workflows": 3,
            "max_storage": 500 * 1024,  # 500 MB en KB
            "max_users": 1
        }
        
        # Créer l'abonnement d'essai avec DatabaseService
        subscription = DatabaseService.create(db, Subscription, trial_subscription_data)
        return subscription

# Pour le décodage du token JWT et la récupération de l'utilisateur courant
async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credentials invalides",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    # Utiliser DatabaseService pour récupérer l'utilisateur
    user = DatabaseService.get_by_id(db, User, user_id)
    
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Utilisateur inactif"
        )
        
    return user

# Pour vérifier que l'utilisateur est actif
async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Utilisateur inactif"
        )
    return current_user

# Pour vérifier que l'utilisateur est admin
async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Droits administrateur requis"
        )
    return current_user