from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.optimization import Optimization, OptimizationStatus
from app.services.optimization_service import OptimizationService
from app.services.workflow_service import WorkflowService
from app.services.simulation_service import SimulationService
from pydantic import BaseModel

router = APIRouter()

# Modèles de données Pydantic pour la validation
class OptimizationRequestModel(BaseModel):
    workflow_id: str
    simulation_id: str = None
    parameters: Dict[str, Any] = {}
    
    class Config:
        arbitrary_types_allowed = True

class OptimizationSuggestionModel(BaseModel):
    id: str
    type: str
    node_id: str = None
    description: str
    impact: Dict[str, float]
    details: Dict[str, Any] = {}
    
    class Config:
        arbitrary_types_allowed = True

class OptimizationResponseModel(BaseModel):
    id: str
    workflow_id: str
    simulation_id: str = None
    status: str
    parameters: Dict[str, Any] = None
    suggestions: List[Dict[str, Any]] = None
    error_message: str = None
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

class OptimizationListResponseModel(BaseModel):
    optimizations: List[OptimizationResponseModel]
    total: int
    
    class Config:
        arbitrary_types_allowed = True

class OptimizationUpdateModel(BaseModel):
    status: str = None
    suggestions: List[Dict[str, Any]] = None
    error_message: str = None
    
    class Config:
        arbitrary_types_allowed = True

# Endpoints
@router.post("/", response_model=OptimizationResponseModel)
async def generate_optimizations(request: OptimizationRequestModel, db: Session = Depends(get_db)):
    """Génère des suggestions d'optimisation pour un workflow"""
    # Vérifier si le workflow existe
    workflow = WorkflowService.get_workflow(db, request.workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    # Vérifier si la simulation existe, si fournie
    if request.simulation_id:
        simulation = SimulationService.get_simulation(db, request.simulation_id)
        if not simulation:
            raise HTTPException(status_code=404, detail="Simulation non trouvée")
    
    # Créer l'optimisation
    optimization_data = {
        "workflow_id": request.workflow_id,
        "simulation_id": request.simulation_id,
        "parameters": request.parameters,
        "status": OptimizationStatus.PENDING
    }
    
    db_optimization = OptimizationService.create_optimization(db, optimization_data)
    
    # Dans un système de production, l'optimisation serait lancée de manière asynchrone ici
    # Pour l'exemple, nous allons juste changer son statut en "PROCESSING"
    OptimizationService.update_optimization_status(db, db_optimization.id, OptimizationStatus.PROCESSING)
    
    # Récupérer l'optimisation mise à jour
    db_optimization = OptimizationService.get_optimization(db, db_optimization.id)
    
    return OptimizationService.optimization_to_dict(db_optimization)

@router.get("/{optimization_id}", response_model=OptimizationResponseModel)
async def get_optimization_results(optimization_id: str, db: Session = Depends(get_db)):
    """Récupère les résultats d'une optimisation"""
    optimization = OptimizationService.get_optimization(db, optimization_id)
    if not optimization:
        raise HTTPException(status_code=404, detail="Optimisation non trouvée")
    
    return OptimizationService.optimization_to_dict(optimization)

@router.get("/by-process/{workflow_id}", response_model=OptimizationListResponseModel)
async def get_optimizations_by_workflow(workflow_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Récupère toutes les optimisations pour un workflow donné"""
    # Vérifier si le workflow existe
    workflow = WorkflowService.get_workflow(db, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow non trouvé")
    
    optimizations = OptimizationService.get_optimizations_by_workflow(db, workflow_id, skip, limit)
    total = len(optimizations)  # Dans un système de production, utilisez count() au lieu de len()
    
    return {
        "optimizations": [OptimizationService.optimization_to_dict(o) for o in optimizations],
        "total": total
    }

@router.get("/by-simulation/{simulation_id}", response_model=OptimizationListResponseModel)
async def get_optimizations_by_simulation(simulation_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Récupère toutes les optimisations pour une simulation donnée"""
    # Vérifier si la simulation existe
    simulation = SimulationService.get_simulation(db, simulation_id)
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation non trouvée")
    
    optimizations = OptimizationService.get_optimizations_by_simulation(db, simulation_id, skip, limit)
    total = len(optimizations)  # Dans un système de production, utilisez count() au lieu de len()
    
    return {
        "optimizations": [OptimizationService.optimization_to_dict(o) for o in optimizations],
        "total": total
    }

@router.put("/{optimization_id}", response_model=OptimizationResponseModel)
async def update_optimization(optimization_id: str, optimization: OptimizationUpdateModel, db: Session = Depends(get_db)):
    """Met à jour une optimisation existante (pour les tests principalement)"""
    # Vérifier si l'optimisation existe
    db_optimization = OptimizationService.get_optimization(db, optimization_id)
    if not db_optimization:
        raise HTTPException(status_code=404, detail="Optimisation non trouvée")
    
    # Mettre à jour le statut si fourni
    if optimization.status:
        try:
            status = OptimizationStatus[optimization.status.upper()]
        except KeyError:
            raise HTTPException(status_code=400, detail="Statut d'optimisation invalide")
        
        db_optimization = OptimizationService.update_optimization_status(
            db, 
            optimization_id, 
            status, 
            optimization.suggestions, 
            optimization.error_message
        )
    
    return OptimizationService.optimization_to_dict(db_optimization)

@router.delete("/{optimization_id}")
async def delete_optimization(optimization_id: str, db: Session = Depends(get_db)):
    """Supprime une optimisation"""
    # Vérifier si l'optimisation existe
    optimization = OptimizationService.get_optimization(db, optimization_id)
    if not optimization:
        raise HTTPException(status_code=404, detail="Optimisation non trouvée")
    
    # Supprimer l'optimisation
    result = OptimizationService.delete_optimization(db, optimization_id)
    
    if result:
        return {"status": "success", "message": "Optimisation supprimée avec succès"}
    else:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'optimisation")