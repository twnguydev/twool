from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

# Modèles de données
class ProcessNode(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class ProcessEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str = None
    animated: bool = False
    data: Dict[str, Any] = None

class ProcessModel(BaseModel):
    name: str
    nodes: List[ProcessNode]
    edges: List[ProcessEdge]

# Endpoints
@router.get("/")
async def get_all_processes():
    """Récupère tous les processus"""
    # Note: Dans un vrai MVP, ceci lirait de la base de données
    return {"processes": []}

@router.post("/")
async def create_process(process: ProcessModel):
    """Crée un nouveau processus"""
    # Note: Dans un vrai MVP, ceci sauvegarderait dans la base de données
    return {"id": "new-process-id", "name": process.name}

@router.get("/{process_id}")
async def get_process(process_id: str):
    """Récupère un processus spécifique"""
    # Note: Dans un vrai MVP, ceci lirait de la base de données
    if process_id != "test-process":
        raise HTTPException(status_code=404, detail="Process not found")
    return {"id": process_id, "name": "Test Process"}

@router.put("/{process_id}")
async def update_process(process_id: str, process: ProcessModel):
    """Met à jour un processus existant"""
    # Note: Dans un vrai MVP, ceci mettrait à jour la base de données
    return {"id": process_id, "name": process.name}

@router.delete("/{process_id}")
async def delete_process(process_id: str):
    """Supprime un processus"""
    # Note: Dans un vrai MVP, ceci supprimerait de la base de données
    return {"status": "success"}
