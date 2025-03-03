from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.services.user_service import UserService
from app.services.auth_service import get_current_user, get_current_active_user
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()

# Modèles de données Pydantic pour la validation
class UserUpdateModel(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
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
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True
        from_attributes = True

class UserListResponse(BaseModel):
    items: List[UserResponseModel]
    total: int
    page: int
    size: int
    
    class Config:
        arbitrary_types_allowed = True

# Endpoints
@router.get("/profile", response_model=UserResponseModel)
async def get_user_profile(current_user: User = Depends(get_current_active_user)):
    """Récupère le profil de l'utilisateur actuellement connecté"""
    return UserService.user_to_dict(current_user)

@router.put("/update", response_model=UserResponseModel)
async def update_user_profile(
    user_update: UserUpdateModel,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Met à jour le profil de l'utilisateur actuellement connecté"""
    user_data = {k: v for k, v in user_update.dict().items() if v is not None}
    
    updated_user = UserService.update_user(db, current_user.id, user_data)
    
    return UserService.user_to_dict(updated_user)

@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Supprime le compte de l'utilisateur actuellement connecté"""
    result = UserService.delete_user(db, current_user.id)
    
    if not result:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                           detail="Erreur lors de la suppression du compte")
    
    return None  # 204 No Content

# Routes pour l'administration (réservées aux administrateurs)
@router.get("", response_model=UserListResponse)
async def list_users(
    skip: int = 0, 
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Liste tous les utilisateurs (pour administrateurs)"""
    # Vérifier si l'utilisateur est administrateur
    if current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Droits d'administrateur requis."
        )
    
    users = UserService.get_users(db, skip=skip, limit=limit)
    total = UserService.count_users(db)
    
    return {
        "items": [UserService.user_to_dict(user) for user in users],
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "size": limit
    }

@router.get("/{user_id}", response_model=UserResponseModel)
async def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Récupère un utilisateur par son ID (pour administrateurs)"""
    # Vérifier si l'utilisateur est administrateur ou s'il consulte son propre profil
    if current_user.role.value != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès refusé. Droits d'administrateur requis."
        )
    
    user = UserService.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return UserService.user_to_dict(user)