from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.database import get_db
from backend.models.event import Incident
from backend.schemas import IncidentCreate, IncidentOut
from backend.services.incident_service import IncidentService

router = APIRouter(prefix="/incidents", tags=["Incident Management"])

@router.get("", response_model=List[IncidentOut])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).order_by(Incident.created_at.desc()).all()

@router.post("", response_model=IncidentOut)
def create_incident(inc_in: IncidentCreate, db: Session = Depends(get_db)):
    return IncidentService.create_incident(
        db, inc_in.incident_type, inc_in.latitude, inc_in.longitude,
        inc_in.severity, inc_in.road_id, inc_in.description
    )

@router.post("/{incident_id}/resolve", response_model=IncidentOut)
def resolve_incident(incident_id: int, db: Session = Depends(get_db)):
    return IncidentService.resolve_incident(db, incident_id)
