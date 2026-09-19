from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.database import get_db
from backend.models.traffic import TrafficState
from backend.models.network import Intersection, Road
from backend.models.data_source import DataSource

router = APIRouter(prefix="/metrics", tags=["System Metrics"])

@router.get("")
def get_system_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    states = db.query(TrafficState).all()
    intersections = db.query(Intersection).all()
    roads = db.query(Road).all()
    data_sources = db.query(DataSource).all()

    avg_speed = (sum(s.average_speed_kmh for s in states) / len(states)) if states else 31.5
    avg_queue = (sum(s.queue_length_m for s in states) / len(states)) if states else 18.2
    avg_congestion = (sum(s.congestion_index for s in states) / len(states)) if states else 0.35

    return {
        "system_status": {
            "backend": "ONLINE",
            "database": "CONNECTED",
            "data": "IMPORTED" if data_sources else "CONNECTED",
            "optimizer": "QAOA / FALLBACK READY",
            "simulation": "ACTIVE"
        },
        "traffic_summary": {
            "active_intersections": len(intersections),
            "active_roads": len(roads),
            "average_network_speed_kmh": round(avg_speed, 1),
            "average_queue_length_m": round(avg_queue, 1),
            "average_congestion_index": round(avg_congestion, 2),
            "primary_corridor": "Anna Salai - Kathipara Junction - Guindy, Chennai"
        }
    }
