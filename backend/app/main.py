from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import processes, simulations, optimizations

app = FastAPI(title="Twool Labs API", description="API for Twool Labs Digital Twin Platform")

# Configuration CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routeurs
app.include_router(processes.router, prefix="/api/processes", tags=["processes"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["simulations"])
app.include_router(optimizations.router, prefix="/api/optimizations", tags=["optimizations"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
