from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.company import Company
from app.models.user import User, UserRole
from app.services.company_service import CompanyService
from app.services.user_service import UserService
from app.routers.users import get_current_user
from pydantic import BaseModel

router = APIRouter()

# Modèles de données Pydantic pour la validation
class CompanyCreateModel(BaseModel):
    name: str
    description: str = None
    address: str = None
    phone: str = None
    website: str = None
    
    class Config:
        arbitrary_types_allowed = True

class CompanyUpdateModel(BaseModel):
    name: str = None
    description: str = None
    address: str = None
    phone: str = None
    website: str = None
    
    class Config:
        arbitrary_types_allowed = True

class CompanyResponseModel(BaseModel):
    id: str
    name: str
    description: str = None
    address: str = None
    phone: str = None
    website: str = None
    is_active: bool
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

class CompanyUserModel(BaseModel):
    user_id: str
    role: str = "consultant"  # Par défaut consultant
    
    class Config:
        arbitrary_types_allowed = True

class UserResponseModel(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    
    class Config:
        arbitrary_types_allowed = True

# Dépendance pour vérifier si l'utilisateur est admin d'entreprise
async def verify_company_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.company_id or current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Accès réservé aux administrateurs d'entreprise"
        )
    return current_user

# Endpoints
@router.post("/create", response_model=CompanyResponseModel)
async def create_company(
    company: CompanyCreateModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crée une nouvelle entreprise et définit l'utilisateur actuel comme admin"""
    # Vérifier que l'utilisateur n'est pas déjà dans une entreprise
    if current_user.company_id:
        raise HTTPException(
            status_code=400,
            detail="Vous êtes déjà membre d'une entreprise"
        )
    
    # Créer l'entreprise
    company_data = company.dict()
    db_company = CompanyService.create_company(db, company_data)
    
    # Ajouter l'utilisateur comme admin
    CompanyService.add_user_to_company(db, db_company.id, current_user.id, UserRole.ADMIN)
    
    return CompanyService.company_to_dict(db_company)

@router.get("/{company_id}", response_model=CompanyResponseModel)
async def get_company(
    company_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupère les informations d'une entreprise"""
    # Vérifier que l'utilisateur appartient à l'entreprise
    if current_user.company_id != company_id:
        raise HTTPException(
            status_code=403,
            detail="Vous n'avez pas accès à cette entreprise"
        )
    
    company = CompanyService.get_company(db, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
    return CompanyService.company_to_dict(company)

@router.put("/{company_id}", response_model=CompanyResponseModel)
async def update_company(
    company_id: str,
    company: CompanyUpdateModel,
    current_user: User = Depends(verify_company_admin),
    db: Session = Depends(get_db)
):
    """Met à jour les informations d'une entreprise (admin uniquement)"""
    # Vérifier que l'admin appartient à l'entreprise
    if current_user.company_id != company_id:
        raise HTTPException(
            status_code=403,
            detail="Vous n'avez pas accès à cette entreprise"
        )
    
    company_data = {k: v for k, v in company.dict().items() if v is not None}
    updated_company = CompanyService.update_company(db, company_id, company_data)
    
    if not updated_company:
        raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
    return CompanyService.company_to_dict(updated_company)

@router.post("/add-user", response_model=UserResponseModel)
async def add_user_to_company(
    company_user: CompanyUserModel,
    current_user: User = Depends(verify_company_admin),
    db: Session = Depends(get_db)
):
    """Ajoute un utilisateur à l'entreprise (admin uniquement)"""
    # Récupérer l'utilisateur à ajouter
    user = UserService.get_user(db, company_user.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Vérifier que l'utilisateur n'est pas déjà dans une entreprise
    if user.company_id:
        raise HTTPException(
            status_code=400,
            detail="Cet utilisateur est déjà membre d'une entreprise"
        )
    
    # Convertir le rôle
    try:
        role = UserRole[company_user.role.upper()]
    except KeyError:
        role = UserRole.CONSULTANT
    
    # Ajouter l'utilisateur à l'entreprise
    updated_user = CompanyService.add_user_to_company(db, current_user.company_id, user.id, role)
    
    if not updated_user:
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de l'ajout de l'utilisateur à l'entreprise"
        )
    
    return UserService.user_to_dict(updated_user)

@router.delete("/remove-user/{user_id}")
async def remove_user_from_company(
    user_id: str,
    current_user: User = Depends(verify_company_admin),
    db: Session = Depends(get_db)
):
    """Retire un utilisateur de l'entreprise (admin uniquement)"""
    # Récupérer l'utilisateur à retirer
    user = UserService.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Vérifier que l'utilisateur appartient à l'entreprise de l'admin
    if user.company_id != current_user.company_id:
        raise HTTPException(
            status_code=400,
            detail="Cet utilisateur n'appartient pas à votre entreprise"
        )
    
    # Empêcher de retirer un admin (sauf si c'est lui-même)
    if user.role == UserRole.ADMIN and user.id != current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Impossible de retirer un administrateur"
        )
    
    # Retirer l'utilisateur de l'entreprise
    updated_user = CompanyService.remove_user_from_company(db, current_user.company_id, user.id)
    
    if not updated_user:
        raise HTTPException(
            status_code=500,
            detail="Erreur lors du retrait de l'utilisateur de l'entreprise"
        )
    
    return {"status": "success", "message": "Utilisateur retiré de l'entreprise avec succès"}

@router.get("/users/{company_id}", response_model=List[UserResponseModel])
async def get_company_users(
    company_id: str,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les utilisateurs d'une entreprise"""
    # Vérifier que l'utilisateur appartient à l'entreprise
    if current_user.company_id != company_id:
        raise HTTPException(
            status_code=403,
            detail="Vous n'avez pas accès à cette entreprise"
        )
    
    users = CompanyService.get_company_users(db, company_id, skip, limit)
    
    return [UserService.user_to_dict(user) for user in users]