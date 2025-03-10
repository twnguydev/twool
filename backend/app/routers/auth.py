from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel, EmailStr, Field

from app.database import get_db
from app.models.user import User
from app.services.auth_service import AuthService, get_current_user
from app.services.user_service import UserService
from app.config import settings

router = APIRouter()

# Modèles de données Pydantic pour la validation
class UserCreateModel(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    license_key: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True

class UserResponseModel(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    company_id: Optional[str] = None
    is_active: bool
    
    class Config:
        arbitrary_types_allowed = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseModel
    
    class Config:
        arbitrary_types_allowed = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SubscriptionRequest(BaseModel):
    type: str = Field(..., pattern="^(monthly|annual)$")
    tier: str = Field(..., pattern="^(solo|business|enterprise)$")
    payment_provider: Optional[str] = None
    payment_id: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "monthly",
                "tier": "solo",
                "payment_provider": "stripe",
                "payment_id": "pi_123456789"
            }
        }

class LicenseActivationRequest(BaseModel):
    license_key: str = Field(..., min_length=24)
    
    class Config:
        json_schema_extra = {
            "example": {
                "license_key": "XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
            }
        }

# Endpoints
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Obtenir un token JWT pour l'authentification
    """
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Route de connexion retournant le token et les infos utilisateur
    """
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": UserService.user_to_dict(user)
    }

@router.post("/register", response_model=UserResponseModel)
async def register(
    user_data: UserCreateModel,
    db: Session = Depends(get_db)
):
    """
    Enregistrer un nouvel utilisateur
    """
    try:
        user = AuthService.register_user(
            db=db,
            email=user_data.email,
            password=user_data.password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            license_key=user_data.license_key
        )
        
        return UserService.user_to_dict(user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'inscription: {str(e)}"
        )

@router.post("/register/subscription", response_model=UserResponseModel)
async def register_with_subscription(
    user_data: UserCreateModel,
    subscription_data: SubscriptionRequest,
    db: Session = Depends(get_db)
):
    """
    Enregistrer un utilisateur avec un abonnement
    """
    try:
        user = AuthService.register_user(
            db=db,
            email=user_data.email,
            password=user_data.password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            subscription_data=subscription_data.dict()
        )
        
        return UserService.user_to_dict(user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'inscription avec abonnement: {str(e)}"
        )

@router.post("/register/license", response_model=UserResponseModel)
async def register_with_license(
    user_data: UserCreateModel,
    license_data: LicenseActivationRequest,
    db: Session = Depends(get_db)
):
    """
    Enregistrer un utilisateur avec une licence
    """
    try:
        user = AuthService.register_user(
            db=db,
            email=user_data.email,
            password=user_data.password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            license_key=license_data.license_key
        )
        
        return UserService.user_to_dict(user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'inscription avec licence: {str(e)}"
        )

@router.post("/activate-license", response_model=UserResponseModel)
async def activate_license(
    license_data: LicenseActivationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Activer une licence pour un utilisateur existant
    """
    try:
        license_obj = AuthService.activate_license(
            db=db,
            user=current_user,
            license_key=license_data.license_key
        )
        
        db.refresh(current_user)
        
        return UserService.user_to_dict(current_user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'activation de la licence: {str(e)}"
        )

@router.get("/me", response_model=UserResponseModel)
async def get_user_me(current_user: User = Depends(get_current_user)):
    """
    Obtenir les informations de l'utilisateur connecté
    """
    return UserService.user_to_dict(current_user)

@router.post("/change-password", response_model=UserResponseModel)
async def change_password(
    old_password: str = Body(...),
    new_password: str = Body(..., min_length=8),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Changer le mot de passe de l'utilisateur connecté
    """
    # Vérifier l'ancien mot de passe
    if not AuthService.verify_password(old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mot de passe actuel incorrect"
        )
    
    # Mettre à jour le mot de passe
    password_hash = AuthService.get_password_hash(new_password)
    
    updated_user = UserService.update_user(db, current_user.id, {"password_hash": password_hash})
    
    return UserService.user_to_dict(updated_user)