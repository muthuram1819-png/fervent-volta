from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "operator"

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# Data Sources Schemas
class DataSourceOut(BaseModel):
    id: int
    source_name: str
    source_url: Optional[str]
    dataset_name: str
    license: str
    coverage_area: str
    time_period: Optional[str]
    field_description: Optional[str]
    data_type: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DatasetOut(BaseModel):
    id: int
    source_id: int
    name: str
    provenance_type: str
    total_records: int
    valid_records: int
    invalid_records: int
    missing_values_count: int
    coordinate_errors_count: int
    timestamp_errors_count: int
    import_timestamp: datetime

    class Config:
        from_attributes = True

class DataImportOut(BaseModel):
    id: int
    filename: str
    file_type: str
    dataset_name: str
    records_processed: int
    status: str
    provenance_category: str
    validation_report: Optional[Dict[str, Any]]
    imported_at: datetime

    class Config:
        from_attributes = True

# Network Schemas
class IntersectionOut(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    highway_type: str
    lanes: int
    current_signal_phase: str
    current_green_duration: int
    cycle_length: int
    provenance: str

    class Config:
        from_attributes = True

class RoadOut(BaseModel):
    id: str
    road_name: str
    source_node_id: str
    target_node_id: str
    length_m: float
    speed_limit_kmh: float
    lanes: int
    road_class: str
    geometry_json: Optional[Dict[str, Any]]
    provenance: str

    class Config:
        from_attributes = True

# Traffic Schemas
class VehicleOut(BaseModel):
    id: int
    vehicle_id: str
    vehicle_type: str
    latitude: float
    longitude: float
    speed_kmh: float
    acceleration_m_s2: float
    road_id: Optional[str]
    intersection_id: Optional[str]
    direction: str
    provenance: str
    timestamp: float

    class Config:
        from_attributes = True

class TrafficStateOut(BaseModel):
    id: int
    timestamp: float
    interval_minutes: int
    road_id: str
    intersection_id: Optional[str]
    vehicle_count: int
    vehicle_density_vpk: float
    average_speed_kmh: float
    traffic_flow_vph: float
    occupancy_pct: float
    queue_length_m: float
    congestion_index: float
    time_of_day_category: str
    provenance: str

    class Config:
        from_attributes = True

# Optimization Schemas
class OptimizationRequest(BaseModel):
    method: str = "QAOA" # QAOA, QUANTUM_INSPIRED, ADAPTIVE_RULE, FIXED_TIME
    intersections: Optional[List[str]] = None
    target_queue_weight: float = 1.0
    target_delay_weight: float = 1.0

class QUBOVariableOut(BaseModel):
    id: int
    variable_name: str
    intersection_id: str
    green_duration_sec: int
    value_selected: int

    class Config:
        from_attributes = True

class OptimizationRunOut(BaseModel):
    id: int
    method: str
    solver_name: str
    objective_value: float
    feasibility: bool
    runtime_ms: float
    qubo_size: int
    status: str
    signal_plan_json: Dict[str, Any]
    explanation: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Emergency Schemas
class EmergencyRequest(BaseModel):
    ambulance_id: str = "AMB_TN01_999"
    origin_intersection_id: str = "INT_1001"
    destination_intersection_id: str = "INT_1006"

class EmergencyScenarioOut(BaseModel):
    id: int
    ambulance_id: str
    origin_lat: float
    origin_lon: float
    dest_lat: float
    dest_lon: float
    route_json: Dict[str, Any]
    affected_intersections_json: List[str]
    eta_seconds: float
    baseline_travel_time_sec: float
    optimized_travel_time_sec: float
    status: str
    provenance: str
    created_at: datetime

    class Config:
        from_attributes = True

# Incident Schemas
class IncidentCreate(BaseModel):
    incident_type: str # ACCIDENT, ROAD_CLOSURE, CONGESTION_SPIKE, EMERGENCY_VEHICLE
    road_id: Optional[str] = None
    intersection_id: Optional[str] = None
    latitude: float
    longitude: float
    severity: str = "HIGH"
    description: Optional[str] = None

class IncidentOut(BaseModel):
    id: int
    incident_type: str
    road_id: Optional[str]
    intersection_id: Optional[str]
    latitude: float
    longitude: float
    severity: str
    description: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Benchmark Schemas
class BenchmarkRequest(BaseModel):
    scenario_name: str = "Chennai Peak Hour Corridor Benchmark"
    demand_multiplier: float = 1.0

class BenchmarkResultOut(BaseModel):
    id: int
    benchmark_run_id: int
    controller_method: str
    avg_waiting_time_sec: float
    max_queue_length_m: float
    throughput_vph: float
    avg_speed_kmh: float
    emergency_travel_time_sec: float
    fuel_estimate_liters: float
    co2_estimate_kg: float
    optimization_runtime_ms: float

    class Config:
        from_attributes = True
