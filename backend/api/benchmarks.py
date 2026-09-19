from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from backend.database import get_db
from backend.schemas import BenchmarkRequest, BenchmarkResultOut
from backend.services.benchmark_service import BenchmarkEngineService
from backend.models.benchmark import BenchmarkRun, BenchmarkResult

router = APIRouter(prefix="/benchmark", tags=["Benchmarking Engine"])

@router.post("/run")
def run_benchmark(req: BenchmarkRequest, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return BenchmarkEngineService.run_comprehensive_benchmark(db, req.scenario_name)

@router.get("/latest")
def get_latest_benchmark(db: Session = Depends(get_db)) -> Dict[str, Any]:
    run = db.query(BenchmarkRun).order_by(BenchmarkRun.created_at.desc()).first()
    if not run:
        # Run benchmark automatically if none exists
        return BenchmarkEngineService.run_comprehensive_benchmark(db)

    results = db.query(BenchmarkResult).filter(BenchmarkResult.benchmark_run_id == run.id).all()
    return {
        "benchmark_run_id": run.id,
        "scenario_name": run.scenario_name,
        "results": [
            {
                "controller_method": r.controller_method,
                "avg_waiting_time_sec": r.avg_waiting_time_sec,
                "max_queue_length_m": r.max_queue_length_m,
                "throughput_vph": r.throughput_vph,
                "avg_speed_kmh": r.avg_speed_kmh,
                "emergency_travel_time_sec": r.emergency_travel_time_sec,
                "fuel_estimate_liters": r.fuel_estimate_liters,
                "co2_estimate_kg": r.co2_estimate_kg,
                "optimization_runtime_ms": r.optimization_runtime_ms
            } for r in results
        ]
    }
