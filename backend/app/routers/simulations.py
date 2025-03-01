from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.simulation import Simulation, SimulationStatus
from app.models.user import User
from app.services.simulation_service import SimulationService
from app.services.workflow_service import WorkflowService
from app.routers.users import get_current_user
from pydantic import BaseModel

router = APIRouter()

# Modèles de données Pydantic pour la validation
class SimulationRequestModel(BaseModel):
    workflow_id: str
    parameters: Dict[str, Any] = {}
    
    class Config:
        arbitrary_types_allowed = True

class SimulationResponseModel(BaseModel):
    id: str
    workflow_id: str
    status: str
    parameters: Dict[str, Any] = None
    metrics: Dict[str, Any] = None
    details: List[Dict[str, Any]] = None
    error_message: str = None
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

class SimulationListResponseModel(BaseModel):
    simulations: List[SimulationResponseModel]
    total: int
    
    class Config:
        arbitrary_types_allowed = True

class SimulationUpdateModel(BaseModel):
    status: str = None
    metrics: Dict[str, Any] = None
    details: List[Dict[str, Any]] = None
    error_message: str = None
    
    class Config:
        arbitrary_types_allowed = True

# Endpoints
@router.post("/", response_model=SimulationResponseModel)
async def run_simulation(
    simulation: SimulationRequestModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lance une nouvelle simulation"""
    # Vérifier si le workflow existe et si l'utilisateur y a accès
    workflow = WorkflowService.get_workflow(db, simulation.workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    if not WorkflowService.check_user_access(db, simulation.workflow_id, current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à accéder à ce workflow"
        )
    
    # Créer la simulation
    simulation_data = {
        "workflow_id": simulation.workflow_id,
        "parameters": simulation.parameters,
        "status": SimulationStatus.PENDING
    }
    
    db_simulation = SimulationService.create_simulation(db, simulation_data)
    
    # Dans un système de production, la simulation serait lancée de manière asynchrone ici
    # Pour l'exemple, nous allons juste changer son statut en "RUNNING"
    SimulationService.update_simulation_status(db, db_simulation.id, SimulationStatus.RUNNING)
    
    # Récupérer la simulation mise à jour
    db_simulation = SimulationService.get_simulation(db, db_simulation.id)
    
    return SimulationService.simulation_to_dict(db_simulation)

@router.get("/{simulation_id}", response_model=SimulationResponseModel)
async def get_simulation_results(
    simulation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupère les résultats d'une simulation"""
    simulation = SimulationService.get_simulation(db, simulation_id)
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    
    # Vérifier que l'utilisateur a accès au workflow associé
    if not WorkflowService.check_user_access(db, simulation.workflow_id, current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à accéder à cette simulation"
        )
    
    return SimulationService.simulation_to_dict(simulation)

@router.get("/by-workflow/{workflow_id}", response_model=SimulationListResponseModel)
async def get_simulations_by_workflow(
    workflow_id: str,
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupère toutes les simulations pour un workflow donné"""
    # Vérifier que l'utilisateur a accès au workflow
    if not WorkflowService.check_user_access(db, workflow_id, current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à accéder à ce workflow"
        )
    
    simulations = SimulationService.get_simulations_by_workflow(db, workflow_id, skip, limit)
    total = len(simulations)  # Dans un système de production, utilisez count() au lieu de len()
    
    return {
        "simulations": [SimulationService.simulation_to_dict(s) for s in simulations],
        "total": total
    }

@router.put("/{simulation_id}", response_model=SimulationResponseModel)
async def update_simulation(
    simulation_id: str,
    simulation: SimulationUpdateModel,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Met à jour une simulation existante (pour les tests principalement)"""
    # Vérifier si la simulation existe
    db_simulation = SimulationService.get_simulation(db, simulation_id)
    if not db_simulation:
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    
    # Vérifier que l'utilisateur a accès au workflow associé
    if not WorkflowService.check_user_access(db, db_simulation.workflow_id, current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à modifier cette simulation"
        )
    
    # Mettre à jour le statut si fourni
    if simulation.status:
        try:
            status = SimulationStatus[simulation.status.upper()]
        except KeyError:
            raise HTTPException(status_code=400, detail="Statut de simulation invalide")
        
        db_simulation = SimulationService.update_simulation_status(
            db, 
            simulation_id, 
            status, 
            simulation.metrics, 
            simulation.details, 
            simulation.error_message
        )
    
    return SimulationService.simulation_to_dict(db_simulation)

@router.delete("/{simulation_id}")
async def delete_simulation(
    simulation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprime une simulation"""
    # Vérifier si la simulation existe
    simulation = SimulationService.get_simulation(db, simulation_id)
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    
    # Vérifier que l'utilisateur a accès au workflow associé
    if not WorkflowService.check_user_access(db, simulation.workflow_id, current_user.id):
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à supprimer cette simulation"
        )
    
    # Supprimer la simulation
    result = SimulationService.delete_simulation(db, simulation_id)
    
    if result:
        return {"status": "success", "message": "Simulation supprimée avec succès"}
    else:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de la simulation")