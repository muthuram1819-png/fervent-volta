from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from datetime import datetime
from backend.database import Base

class BenchmarkRun(Base):
    __tablename__ = "benchmark_runs"

    id = Column(Integer, primary_key=True, index=True)
    scenario_name = Column(String, default="Chennai Baseline Peak Hour Traffic")
    traffic_state_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class BenchmarkResult(Base):
    __tablename__ = "benchmark_results"

    id = Column(Integer, primary_key=True, index=True)
    benchmark_run_id = Column(Integer, nullable=False)
    controller_method = Column(String, nullable=False) # Fixed-Time, Adaptive Rule-Based, Hybrid Quantum-Classical
    avg_waiting_time_sec = Column(Float, default=0.0)
    max_queue_length_m = Column(Float, default=0.0)
    throughput_vph = Column(Float, default=0.0)
    avg_speed_kmh = Column(Float, default=0.0)
    emergency_travel_time_sec = Column(Float, default=0.0)
    fuel_estimate_liters = Column(Float, default=0.0) # Documented formula: fuel = idle_time * 0.0006 + distance * 0.08
    co2_estimate_kg = Column(Float, default=0.0) # Documented formula: co2 = fuel * 2.31
    optimization_runtime_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
