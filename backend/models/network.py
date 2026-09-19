from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean
from datetime import datetime
from backend.database import Base

class Intersection(Base):
    __tablename__ = "intersections"

    id = Column(String, primary_key=True, index=True) # e.g. INT_1001
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    highway_type = Column(String, default="traffic_signals")
    lanes = Column(Integer, default=4)
    current_signal_phase = Column(String, default="PHASE_1_NORTH_SOUTH")
    current_green_duration = Column(Integer, default=30)
    cycle_length = Column(Integer, default=90)
    provenance = Column(String, default="REAL_OBSERVED")
    created_at = Column(DateTime, default=datetime.utcnow)

class Road(Base):
    __tablename__ = "roads"

    id = Column(String, primary_key=True, index=True) # e.g. RD_2001
    road_name = Column(String, nullable=False)
    source_node_id = Column(String, nullable=False)
    target_node_id = Column(String, nullable=False)
    length_m = Column(Float, default=500.0)
    speed_limit_kmh = Column(Float, default=50.0)
    lanes = Column(Integer, default=3)
    road_class = Column(String, default="primary")
    geometry_json = Column(JSON, nullable=True) # GeoJSON representation of road polyline
    provenance = Column(String, default="REAL_OBSERVED")

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    from_road_id = Column(String, nullable=False)
    to_road_id = Column(String, nullable=False)
    intersection_id = Column(String, nullable=False)
    allowed_turn = Column(String, default="STRAIGHT") # STRAIGHT, LEFT, RIGHT, U_TURN
