from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import simulations, optimizations, flow_ia
from app.routers import users, companies, subscriptions, workflows

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
# Workflows et analyses
app.include_router(workflows.router, prefix="/api/workflows", tags=["workflows"])
app.include_router(simulations.router, prefix="/api/simulations", tags=["simulations"])
app.include_router(optimizations.router, prefix="/api/optimizations", tags=["optimizations"])
app.include_router(flow_ia.router, prefix="/api/flow-ia", tags=["flow-ia"])

# Gestion des comptes et abonnements
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}