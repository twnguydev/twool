from fastapi import APIRouter, HTTPException, Depends, Header, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.services.user_service import UserService
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

# Modèles de données Pydantic pour la validation
class UserCreateModel(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    
    class Config:
        arbitrary_types_allowed = True

class UserUpdateModel(BaseModel):
    first_name: str = None
    last_name: str = None
    password: str = Field(None, min_length=8)
    
    class Config:
        arbitrary_types_allowed = True

class UserResponseModel(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    company_id: str = None
    is_active: bool
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponseModel
    
    class Config:
        arbitrary_types_allowed = True

# Dépendance pour obtenir l'utilisateur actuel
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    user = UserService.get_current_user(db, token)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Identifiants invalides",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# Endpoints
@router.post("/register", response_model=UserResponseModel)
async def register_user(user: UserCreateModel, db: Session = Depends(get_db)):
    """Crée un nouveau compte utilisateur"""
    # Vérifier si l'email existe déjà
    db_user = UserService.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    
    # Créer l'utilisateur
    user_data = user.dict()
    user_data["role"] = UserRole.SOLO  # Par défaut, un nouvel utilisateur est solo
    
    db_user = UserService.create_user(db, user_data)
    
    return UserService.user_to_dict(db_user)

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Connecte un utilisateur et génère un token JWT"""
    # Récupérer l'utilisateur par email
    user = UserService.get_user_by_email(db, form_data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    # Vérifier le mot de passe
    if not UserService.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    # Vérifier si le compte est actif
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Compte désactivé")
    
    # Générer le token
    access_token = UserService.create_access_token(user.id)
    
    return {
        "access_token": access_token,
        "user": UserService.user_to_dict(user)
    }

@router.get("/profile", response_model=UserResponseModel)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Récupère le profil de l'utilisateur actuellement connecté"""
    return UserService.user_to_dict(current_user)

@router.put("/update", response_model=UserResponseModel)
async def update_user_profile(
    user_update: UserUpdateModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Met à jour le profil de l'utilisateur actuellement connecté"""
    user_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    updated_user = UserService.update_user(db, current_user.id, user_data)
    
    return UserService.user_to_dict(updated_user)

@router.delete("/delete")
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprime le compte de l'utilisateur actuellement connecté"""
    result = UserService.delete_user(db, current_user.id)
    
    if not result:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression du compte")
    
    return {"status": "success", "message": "Compte supprimé avec succès"}