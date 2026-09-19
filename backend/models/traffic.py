from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from datetime import datetime
from backend.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(String, index=True, nullable=False)
    vehicle_type = Column(String, default="car") # car, bus, two_wheeler, auto_rickshaw, truck, ambulance
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0)
    acceleration_m_s2 = Column(Float, default=0.0)
    road_id = Column(String, nullable=True)
    intersection_id = Column(String, nullable=True)
    direction = Column(String, default="NORTHBOUND")
    provenance = Column(String, default="REAL_OBSERVED")
    timestamp = Column(Float, nullable=False)

class TrafficObservation(Base):
    __tablename__ = "traffic_observations"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String, nullable=False)
    raw_data_json = Column(JSON, nullable=False)
    provenance_classification = Column(String, default="REAL_OBSERVED")
    recorded_at = Column(DateTime, default=datetime.utcnow)

class TrafficState(Base):
    __tablename__ = "traffic_states"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(Float, nullable=False)
    interval_minutes = Column(Integer, default=5)
    road_id = Column(String, nullable=False)
    intersection_id = Column(String, nullable=True)
    vehicle_count = Column(Integer, default=0)
    vehicle_density_vpk = Column(Float, default=0.0) # vehicles per km
    average_speed_kmh = Column(Float, default=0.0)
    traffic_flow_vph = Column(Float, default=0.0) # vehicles per hour
    occupancy_pct = Column(Float, default=0.0)
    queue_length_m = Column(Float, default=0.0)
    congestion_index = Column(Float, default=0.0) # 0.0 (free flow) to 1.0 (jammed)
    time_of_day_category = Column(String, default="Midday") # Morning, Midday, Evening, Night
    provenance = Column(String, default="DERIVED_FROM_REAL_DATA")
    created_at = Column(DateTime, default=datetime.utcnow)
