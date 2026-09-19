from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.event import Incident
from backend.models.network import Road, Intersection
from backend.models.traffic import TrafficState

class IncidentService:
    @staticmethod
    def create_incident(
        db: Session,
        incident_type: str,
        lat: float,
        lon: float,
        severity: str = "HIGH",
        road_id: str = None,
        description: str = None
    ) -> Incident:
        if not road_id:
            road = db.query(Road).first()
            road_id = road.id if road else "RD_2001"

        inc = Incident(
            incident_type=incident_type,
            road_id=road_id,
            latitude=lat,
            longitude=lon,
            severity=severity,
            description=description or f"{incident_type} reported at {road_id} in Chennai",
            status="ACTIVE"
        )
        db.add(inc)

        # Update affected road state
        affected_road = db.query(Road).filter(Road.id == road_id).first()
        if affected_road:
            if incident_type == "ROAD_CLOSURE":
                affected_road.speed_limit_kmh = 5.0 # Nearly blocked
            elif incident_type == "ACCIDENT":
                affected_road.speed_limit_kmh = 15.0 # Severe slowdown

        # Update traffic state
        t_state = db.query(TrafficState).filter(TrafficState.road_id == road_id).first()
        if t_state:
            t_state.congestion_index = 0.95
            t_state.queue_length_m = min(t_state.queue_length_m + 80.0, 180.0)

        db.commit()
        db.refresh(inc)
        return inc

    @staticmethod
    def resolve_incident(db: Session, incident_id: int) -> Incident:
        inc = db.query(Incident).filter(Incident.id == incident_id).first()
        if inc:
            inc.status = "RESOLVED"
            # Restore normal road speed limit
            road = db.query(Road).filter(Road.id == inc.road_id).first()
            if road:
                road.speed_limit_kmh = 50.0
            db.commit()
            db.refresh(inc)
        return inc
