from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.database import get_db
from backend.services.digital_twin import DigitalTwinSimulator

router = APIRouter(prefix="/simulation", tags=["Traffic Digital Twin"])

@router.get("/state")
def get_simulation_state(db: Session = Depends(get_db)) -> Dict[str, Any]:
    sim = DigitalTwinSimulator(db)
    return sim.get_digital_twin_state()

@router.post("/step")
def step_simulation(steps: int = 1, db: Session = Depends(get_db)) -> Dict[str, Any]:
    sim = DigitalTwinSimulator(db)
    return sim.step_simulation(steps)

@router.post("/reset")
def reset_simulation(db: Session = Depends(get_db)) -> Dict[str, Any]:
    sim = DigitalTwinSimulator(db)
    return sim.reset_simulation()
