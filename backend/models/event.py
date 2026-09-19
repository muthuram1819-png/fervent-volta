from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from datetime import datetime
from backend.database import Base

class EmergencyScenario(Base):
    __tablename__ = "emergency_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    ambulance_id = Column(String, default="AMB_TN01_099")
    origin_lat = Column(Float, nullable=False)
    origin_lon = Column(Float, nullable=False)
    dest_lat = Column(Float, nullable=False)
    dest_lon = Column(Float, nullable=False)
    route_json = Column(JSON, nullable=False) # List of intersection IDs and road IDs
    affected_intersections_json = Column(JSON, nullable=False)
    eta_seconds = Column(Float, default=180.0)
    baseline_travel_time_sec = Column(Float, default=320.0)
    optimized_travel_time_sec = Column(Float, default=180.0)
    status = Column(String, default="ACTIVE") # ACTIVE, COMPLETED, CANCELLED
    provenance = Column(String, default="SCENARIO_SIMULATED")
    created_at = Column(DateTime, default=datetime.utcnow)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_type = Column(String, nullable=False) # ACCIDENT, ROAD_CLOSURE, CONGESTION_SPIKE, EMERGENCY_VEHICLE
    road_id = Column(String, nullable=True)
    intersection_id = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    severity = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=True)
    status = Column(String, default="ACTIVE") # ACTIVE, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)
