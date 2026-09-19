from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.models.event import EmergencyScenario
from backend.schemas import EmergencyRequest, EmergencyScenarioOut
from backend.services.emergency_service import EmergencyCorridorService

router = APIRouter(prefix="/emergency", tags=["Emergency Green Corridor"])

@router.post("/create", response_model=EmergencyScenarioOut)
def create_emergency_scenario(req: EmergencyRequest, db: Session = Depends(get_db)):
    return EmergencyCorridorService.create_green_corridor(
        db, req.ambulance_id, req.origin_intersection_id, req.destination_intersection_id
    )

@router.get("/active", response_model=List[EmergencyScenarioOut])
def get_active_emergency_scenarios(db: Session = Depends(get_db)):
    return db.query(EmergencyScenario).order_by(EmergencyScenario.created_at.desc()).all()
