from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import workflows, simulations, optimizations, flow_ia, users, companies, subscriptions, auth

# Création de l'application FastAPI
app = FastAPI(
    title="Twool Labs API",
    description="API pour l'application Twool Labs",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Configuration CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
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
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])

@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur l'API Twool Labs",
        "version": settings.VERSION
    }