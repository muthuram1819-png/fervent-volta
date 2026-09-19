import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import engine, SessionLocal, Base
from backend.models import *

# API Routers
from backend.api import (
    auth, data, network, traffic, simulation,
    optimization, emergency, incidents, scenarios,
    benchmarks, metrics
)

# Auto-create SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent transportation platform for adaptive urban traffic optimization in Chennai, India using hybrid quantum-classical optimization.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(data.router, prefix=settings.API_V1_STR)
app.include_router(network.router, prefix=settings.API_V1_STR)
app.include_router(traffic.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(optimization.router, prefix=settings.API_V1_STR)
app.include_router(emergency.router, prefix=settings.API_V1_STR)
app.include_router(incidents.router, prefix=settings.API_V1_STR)
app.include_router(scenarios.router, prefix=settings.API_V1_STR)
app.include_router(benchmarks.router, prefix=settings.API_V1_STR)
app.include_router(metrics.router, prefix=settings.API_V1_STR)

# Mount Frontend static dist if present
from fastapi.staticfiles import StaticFiles
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

@app.on_event("startup")
def startup_event():
    """
    On startup, populate initial Chennai network and ingest real dataset if database is empty
    """
    db = SessionLocal()
    try:
        from backend.models.network import Intersection
        from backend.services.network_service import NetworkService
        from backend.services.data_ingestion import DataIngestionService
        from backend.services.data_processing import DataProcessingService

        # Check if network exists
        if db.query(Intersection).count() == 0:
            print(" -> Initializing default Chennai road network...")
            NetworkService.initialize_chennai_network(db)

            # Ingest default SPT raw trajectory CSV
            raw_spt_file = os.path.join(settings.BASE_DIR, "data", "raw", "chennai_spt_trajectories.csv")
            if os.path.exists(raw_spt_file):
                print(" -> Ingesting real Chennai SPT drone trajectory dataset...")
                with open(raw_spt_file, "rb") as f:
                    DataIngestionService.ingest_file(db, f.read(), "chennai_spt_trajectories.csv", "spt")

            # Generate initial traffic states
            print(" -> Generating initial Chennai traffic state metrics...")
            DataProcessingService.generate_traffic_states(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "city": settings.CITY_NAME,
        "status": "ONLINE",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
