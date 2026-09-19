from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.database import get_db
from backend.models.network import Intersection, Road
from backend.schemas import IntersectionOut, RoadOut
from backend.services.network_service import NetworkService

router = APIRouter(prefix="/network", tags=["Road Network"])

@router.get("/intersections", response_model=List[IntersectionOut])
def get_intersections(db: Session = Depends(get_db)):
    return db.query(Intersection).all()

@router.get("/roads", response_model=List[RoadOut])
def get_roads(db: Session = Depends(get_db)):
    return db.query(Road).all()

@router.post("/initialize")
def initialize_network(db: Session = Depends(get_db)):
    return NetworkService.initialize_chennai_network(db)
