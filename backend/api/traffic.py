from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.traffic import Vehicle, TrafficState
from backend.schemas import VehicleOut, TrafficStateOut
from backend.services.data_processing import DataProcessingService

router = APIRouter(prefix="/traffic", tags=["Traffic Analytics & State"])

@router.get("/vehicles", response_model=List[VehicleOut])
def get_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).limit(100).all()

@router.get("/states", response_model=List[TrafficStateOut])
def get_traffic_states(db: Session = Depends(get_db)):
    return db.query(TrafficState).all()

@router.post("/generate-states")
def generate_traffic_states(
    interval_minutes: int = Query(5, ge=1, le=60),
    db: Session = Depends(get_db)
):
    states = DataProcessingService.generate_traffic_states(db, interval_minutes)
    return {"status": "SUCCESS", "generated_count": len(states), "interval_minutes": interval_minutes}
