from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.flow_ia_service import FlowIAService
from app.services.workflow_service import WorkflowService

router = APIRouter()
flow_ia_service = FlowIAService()

# Modèles de données Pydantic pour la validation
class WorkflowAnalysisRequest(BaseModel):
    workflow_id: str
    workflow_data: Dict[str, Any]
    
    class Config:
        arbitrary_types_allowed = True

class OptimizationItem(BaseModel):
    description: str
    impact_estimate: str
    implementation_complexity: str
    priority: str
    
    class Config:
        arbitrary_types_allowed = True

class BottleneckItem(BaseModel):
    description: str
    impact: str
    priority: str
    
    class Config:
        arbitrary_types_allowed = True

class AlternativeScenario(BaseModel):
    name: str
    description: str
    expected_impact: str
    
    class Config:
        arbitrary_types_allowed = True

class WorkflowAnalysisResponse(BaseModel):
    id: str
    process_id: str
    model_analysis: Dict[str, Any] = None
    flow_analysis: Dict[str, Any] = None
    critical_variables: List[Dict[str, Any]] = None
    bottlenecks: List[Dict[str, Any]] = None
    optimizations: List[Dict[str, Any]] = None
    alternative_scenarios: List[Dict[str, Any]] = None
    resilience_assessment: Dict[str, Any] = None
    confidence_score: float = None
    visualization_suggestions: List[str] = None
    error_message: str = None
    created_at: str
    updated_at: str
    
    class Config:
        arbitrary_types_allowed = True

# Endpoints
@router.post("/analyze", response_model=WorkflowAnalysisResponse)
async def analyze_workflow(request: WorkflowAnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyse un workflow et génère des recommandations d'optimisation
    en utilisant un modèle d'IA spécialisé.
    """
    # Vérifier si le processus existe
    process = WorkflowService.get_workflow(db, request.workflow_id)
    if not process:
        raise HTTPException(status_code=404, detail="Processus non trouvé")
    
    try:
        # Appel au service d'IA pour analyser le workflow
        analysis_result = await flow_ia_service.analyze_workflow(request.workflow_data)
        
        # Sauvegarde de l'analyse dans la base de données
        db_analysis = flow_ia_service.create_analysis(db, request.process_id, analysis_result)
        
        # Conversion en dictionnaire pour la réponse
        response = flow_ia_service.analysis_to_dict(db_analysis)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse du workflow: {str(e)}")

@router.get("/{analysis_id}", response_model=WorkflowAnalysisResponse)
async def get_workflow_analysis(analysis_id: str, db: Session = Depends(get_db)):
    """
    Récupère les résultats d'une analyse de workflow précédente
    """
    analysis = flow_ia_service.get_analysis(db, analysis_id)
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    
    return flow_ia_service.analysis_to_dict(analysis)

@router.get("/by-process/{process_id}", response_model=List[WorkflowAnalysisResponse])
async def get_analyses_by_process(process_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Récupère toutes les analyses associées à un processus donné
    """
    # Vérifier si le processus existe
    process = WorkflowService.get_workflow(db, process_id)
    if not process:
        raise HTTPException(status_code=404, detail="Processus non trouvé")
    
    analyses = flow_ia_service.get_analyses_by_process(db, process_id, skip, limit)
    
    return [flow_ia_service.analysis_to_dict(analysis) for analysis in analyses]

@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: str, db: Session = Depends(get_db)):
    """
    Supprime une analyse de workflow
    """
    analysis = flow_ia_service.get_analysis(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    
    result = flow_ia_service.delete_analysis(db, analysis_id)
    
    if result:
        return {"status": "success", "message": "Analyse supprimée avec succès"}
    else:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression de l'analyse")