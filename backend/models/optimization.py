from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean
from datetime import datetime
from backend.database import Base

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"

    id = Column(Integer, primary_key=True, index=True)
    method = Column(String, nullable=False) # QAOA, QUANTUM_INSPIRED, ADAPTIVE_RULE, FIXED_TIME
    solver_name = Column(String, default="Qiskit Aer / Exact QUBO Fallback")
    objective_value = Column(Float, nullable=False)
    feasibility = Column(Boolean, default=True)
    runtime_ms = Column(Float, default=0.0)
    qubo_size = Column(Integer, default=0)
    status = Column(String, default="SUCCESS") # SUCCESS, QAOA_UNAVAILABLE, FAILED
    signal_plan_json = Column(JSON, nullable=False)
    explanation = Column(Text, nullable=True)
    traffic_state_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class QUBOVariable(Base):
    __tablename__ = "qubo_variables"

    id = Column(Integer, primary_key=True, index=True)
    optimization_run_id = Column(Integer, nullable=False)
    variable_name = Column(String, nullable=False) # e.g. x_INT_1001_20s
    intersection_id = Column(String, nullable=False)
    green_duration_sec = Column(Integer, nullable=False)
    value_selected = Column(Integer, default=0) # 0 or 1

class SignalPlan(Base):
    __tablename__ = "signal_plans"

    id = Column(Integer, primary_key=True, index=True)
    intersection_id = Column(String, nullable=False)
    phase_id = Column(String, default="PHASE_1_MAIN")
    green_duration = Column(Integer, default=30)
    yellow_duration = Column(Integer, default=5)
    red_duration = Column(Integer, default=25)
    cycle_length = Column(Integer, default=60)
    source_type = Column(String, default="CONFIGURED_BASELINE") # CONFIGURED_BASELINE, ADAPTIVE_RULE, OPTIMIZED_QUBO
    updated_at = Column(DateTime, default=datetime.utcnow)
