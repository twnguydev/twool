from fastapi import APIRouter, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.subscription import SubscriptionType, SubscriptionTier
from app.models.user import User
from app.services.subscription_service import SubscriptionService
from app.services.user_service import UserService
from app.services.company_service import CompanyService
from app.routers.users import get_current_user
from pydantic import BaseModel

router = APIRouter()

# Modèles de données Pydantic pour la validation
class SubscriptionCreateModel(BaseModel):
    type: str
    tier: str
    payment_provider: str = None
    payment_id: str = None
    amount: float
    currency: str = "EUR"
    
    class Config:
        arbitrary_types_allowed = True

class SubscriptionResponseModel(BaseModel):
    id: str
    user_id: str = None
    company_id: str = None
    type: str
    tier: str
    status: str
    start_date: str
    end_date: str
    payment_provider: str = None
    payment_id: str = None
    amount: float
    currency: str
    max_workflows: int = None
    max_storage: int
    max_users: int = None
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

class LicenseValidateModel(BaseModel):
    key: str
    device_id: str = None
    
    class Config:
        arbitrary_types_allowed = True

class LicenseResponseModel(BaseModel):
    id: str
    key: str
    subscription_id: str
    user_id: str = None
    status: str
    activation_date: str = None
    expiration_date: str
    is_admin: bool
    device_id: str = None
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

# Endpoints
@router.post("/create", response_model=SubscriptionResponseModel)
async def create_subscription(
    subscription: SubscriptionCreateModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crée un nouvel abonnement pour l'utilisateur connecté ou son entreprise"""
    # Convertir les types d'énumération
    try:
        sub_type = SubscriptionType[subscription.type.upper()]
        sub_tier = SubscriptionTier[subscription.tier.upper()]
    except KeyError:
        raise HTTPException(
            status_code=400,
            detail="Type ou niveau d'abonnement invalide"
        )
    
    # Préparer les données de l'abonnement
    subscription_data = subscription.dict()
    subscription_data['type'] = sub_type
    subscription_data['tier'] = sub_tier
    
    # Déterminer si l'abonnement est pour l'utilisateur ou son entreprise
    if sub_tier == SubscriptionTier.SOLO:
        if current_user.company_id:
            raise HTTPException(
                status_code=400,
                detail="Les membres d'une entreprise ne peuvent pas souscrire à un abonnement solo"
            )
        
        # Vérifier si l'utilisateur a déjà un abonnement actif
        existing_sub = SubscriptionService.get_user_subscription(db, current_user.id)
        if existing_sub and existing_sub.is_active:
            raise HTTPException(
                status_code=400,
                detail="Vous avez déjà un abonnement actif"
            )
        
        # Créer l'abonnement pour l'utilisateur
        subscription = SubscriptionService.create_subscription(db, subscription_data, current_user)
    else:
        # Abonnement pour une entreprise
        if not current_user.company_id:
            raise HTTPException(
                status_code=400,
                detail="Vous devez appartenir à une entreprise pour souscrire à cet abonnement"
            )
        
        # Vérifier que l'utilisateur est admin de l'entreprise
        if current_user.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Seuls les administrateurs d'entreprise peuvent souscrire à un abonnement"
            )
        
        # Récupérer l'entreprise
        company = CompanyService.get_company(db, current_user.company_id)
        
        # Vérifier si l'entreprise a déjà un abonnement actif
        existing_sub = SubscriptionService.get_company_subscription(db, company.id)
        if existing_sub and existing_sub.is_active:
            raise HTTPException(
                status_code=400,
                detail="Votre entreprise a déjà un abonnement actif"
            )
        
        # Créer l'abonnement pour l'entreprise
        subscription = SubscriptionService.create_subscription(db, subscription_data, company)
    
    return SubscriptionService.subscription_to_dict(subscription)

@router.get("/{user_id}", response_model=SubscriptionResponseModel)
async def get_user_subscription(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupère l'abonnement d'un utilisateur"""
    # Vérifier que l'utilisateur demande son propre abonnement
    if current_user.id != user_id and (not current_user.company_id or current_user.role != "admin"):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à consulter cet abonnement"
        )
    
    # Récupérer l'abonnement individuel ou d'entreprise
    subscription = None
    
    # Si c'est un utilisateur d'entreprise, chercher l'abonnement de l'entreprise
    user = UserService.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    if user.company_id:
        subscription = SubscriptionService.get_company_subscription(db, user.company_id)
    else:
        subscription = SubscriptionService.get_user_subscription(db, user_id)
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Aucun abonnement trouvé")
    
    return SubscriptionService.subscription_to_dict(subscription)

@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Annule l'abonnement de l'utilisateur ou de son entreprise"""
    # Récupérer l'abonnement
    subscription = None
    
    if current_user.company_id:
        # Vérifier que l'utilisateur est admin
        if current_user.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Seuls les administrateurs peuvent annuler l'abonnement"
            )
        
        subscription = SubscriptionService.get_company_subscription(db, current_user.company_id)
    else:
        subscription = SubscriptionService.get_user_subscription(db, current_user.id)
    
    if not subscription:
        raise HTTPException(status_code=404, detail="Aucun abonnement actif trouvé")
    
    # Annuler l'abonnement
    canceled_sub = SubscriptionService.cancel_subscription(db, subscription.id)
    
    return {"status": "success", "message": "Abonnement annulé avec succès"}