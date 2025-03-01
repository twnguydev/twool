from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.workflow import Workflow
from app.models.user import User
from app.services.workflow_service import WorkflowService
from app.services.subscription_service import SubscriptionService
from app.routers.users import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Modèles de données Pydantic pour la validation
class NodeModel(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]
    width: int = None
    height: int = None
    
    class Config:
        arbitrary_types_allowed = True

class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None
    type: str = None
    animated: bool = False
    label: str = None
    data: Dict[str, Any] = None
    
    class Config:
        arbitrary_types_allowed = True

class WorkflowCreateModel(BaseModel):
    name: str
    description: str = None
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []
    createdAt: str = None
    is_shared: bool = False
    is_template: bool = False
    
    class Config:
        arbitrary_types_allowed = True

class WorkflowUpdateModel(BaseModel):
    name: str = None
    description: str = None
    nodes: List[Dict[str, Any]] = None
    edges: List[Dict[str, Any]] = None
    is_shared: bool = None
    is_template: bool = None
    
    class Config:
        arbitrary_types_allowed = True

class WorkflowResponseModel(BaseModel):
    id: str
    name: str
    description: str = None
    owner_id: str
    company_id: str = None
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    createdAt: str = None
    is_shared: bool
    is_template: bool
    storage_size: int
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

# Endpoints
@router.post("/create", response_model=WorkflowResponseModel)
async def create_workflow(
    workflow: WorkflowCreateModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crée un nouveau workflow"""
    # Créer le workflow
    workflow_data = workflow.dict()
    db_workflow = WorkflowService.create_workflow(db, workflow_data, current_user)
    
    if not db_workflow:
        # Récupérer l'abonnement pour vérifier les quotas
        subscription = None
        if current_user.company_id:
            subscription = SubscriptionService.get_company_subscription(db, current_user.company_id)
        else:
            subscription = SubscriptionService.get_user_subscription(db, current_user.id)
        
        if not subscription or not subscription.is_active:
            raise HTTPException(
                status_code=400,
                detail="Vous devez avoir un abonnement actif pour créer des workflows"
            )
        
        # Si l'utilisateur est solo, vérifier le quota de workflows
        if current_user.is_solo and subscription.max_workflows is not None:
            # Compter les workflows existants
            workflow_count = db.query(Workflow).filter(Workflow.owner_id == current_user.id).count()
            
            if workflow_count >= subscription.max_workflows:
                raise HTTPException(
                    status_code=400,
                    detail=f"Vous avez atteint la limite de {subscription.max_workflows} workflows pour votre abonnement"
                )
        
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de la création du workflow"
        )
    
    return WorkflowService.workflow_to_dict(db_workflow)

@router.get("/{user_id}", response_model=List[WorkflowResponseModel])
async def get_user_workflows(
    user_id: str,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les workflows d'un utilisateur"""
    # Vérifier que l'utilisateur demande ses propres workflows ou est de la même entreprise
    if (current_user.id != user_id and
        (not current_user.company_id or current_user.company_id != db.query(User).filter(User.id == user_id).first().company_id)):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à consulter ces workflows"
        )
    
    workflows = WorkflowService.get_user_workflows(db, user_id, skip, limit)
    
    return [WorkflowService.workflow_to_dict(workflow) for workflow in workflows]

@router.get("/company/{company_id}", response_model=List[WorkflowResponseModel])
async def get_company_workflows(
    company_id: str,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère tous les workflows partagés d'une entreprise"""
    # Vérifier que l'utilisateur appartient à l'entreprise
    if current_user.company_id != company_id:
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à consulter ces workflows"
        )
    
    # Récupérer les workflows de l'entreprise qui sont partagés ou dont l'utilisateur est propriétaire
    workflows = db.query(Workflow).filter(
        (Workflow.company_id == company_id) & 
        ((Workflow.is_shared == True) | (Workflow.owner_id == current_user.id))
    ).offset(skip).limit(limit).all()
    
    return [WorkflowService.workflow_to_dict(workflow) for workflow in workflows]

@router.get("/detail/{workflow_id}", response_model=WorkflowResponseModel)
async def get_workflow_detail(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupère les détails d'un workflow spécifique"""
    # Récupérer le workflow
    workflow = WorkflowService.get_workflow(db, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    # Vérifier l'accès
    if not WorkflowService.check_user_access(db, workflow_id, current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à consulter ce workflow"
        )
    
    return WorkflowService.workflow_to_dict(workflow)

@router.put("/update/{workflow_id}", response_model=WorkflowResponseModel)
async def update_workflow(
    workflow_id: str,
    workflow: WorkflowUpdateModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Met à jour un workflow existant"""
    # Vérifier que l'utilisateur a accès au workflow
    db_workflow = WorkflowService.get_workflow(db, workflow_id)
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    if not WorkflowService.check_user_access(db, workflow_id, current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à modifier ce workflow"
        )
    
    # Seul le propriétaire peut modifier certains attributs
    if current_user.id != db_workflow.owner_id:
        for attr in ['name', 'is_template']:
            if getattr(workflow, attr) is not None:
                raise HTTPException(
                    status_code=403,
                    detail=f"Seul le propriétaire peut modifier l'attribut '{attr}'"
                )
    
    # Mettre à jour le workflow
    workflow_data = {k: v for k, v in workflow.dict().items() if v is not None}
    updated_workflow = WorkflowService.update_workflow(db, workflow_id, workflow_data)
    
    if not updated_workflow:
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de la mise à jour du workflow"
        )
    
    return WorkflowService.workflow_to_dict(updated_workflow)

@router.delete("/delete/{workflow_id}")
async def delete_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprime un workflow"""
    # Vérifier que l'utilisateur est le propriétaire du workflow
    db_workflow = WorkflowService.get_workflow(db, workflow_id)
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    if db_workflow.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Seul le propriétaire peut supprimer un workflow"
        )
    
    # Supprimer le workflow
    result = WorkflowService.delete_workflow(db, workflow_id)
    
    if not result:
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de la suppression du workflow"
        )
    
    return {"status": "success", "message": "Workflow supprimé avec succès"}