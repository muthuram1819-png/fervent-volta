from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.database import get_db
from backend.services.scenario_service import ScenarioService

router = APIRouter(prefix="/scenarios", tags=["What-If Simulator"])

@router.post("/run")
def run_what_if_scenario(
    traffic_multiplier: float = Query(1.2, ge=0.5, le=3.0),
    has_accident: bool = Query(False),
    has_emergency: bool = Query(False),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    return ScenarioService.run_what_if_scenario(
        db, traffic_multiplier, has_accident, has_emergency
    )
