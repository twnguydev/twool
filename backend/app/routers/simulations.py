from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

# Modèles de données
class SimulationRequest(BaseModel):
    process_id: str
    parameters: Dict[str, Any] = {}

class SimulationResult(BaseModel):
    id: str
    process_id: str
    metrics: Dict[str, Any]
    details: List[Dict[str, Any]]

# Endpoints
@router.post("/")
async def run_simulation(simulation: SimulationRequest):
    """Lance une nouvelle simulation"""
    # Note: Dans un vrai MVP, ceci lancerait une tâche de simulation
    return {
        "id": "sim-123",
        "status": "started",
        "process_id": simulation.process_id
    }

@router.get("/{simulation_id}")
async def get_simulation_results(simulation_id: str):
    """Récupère les résultats d'une simulation"""
    # Note: Dans un vrai MVP, ceci lirait de la base de données
    return {
        "id": simulation_id,
        "process_id": "test-process",
        "status": "completed",
        "metrics": {
            "total_time": 120,
            "total_cost": 500,
            "bottlenecks": ["task-3"]
        },
        "details": [
            {"node_id": "node-1", "execution_time": 10, "cost": 50},
            {"node_id": "node-2", "execution_time": 30, "cost": 150},
            {"node_id": "node-3", "execution_time": 80, "cost": 300}
        ]
    }
