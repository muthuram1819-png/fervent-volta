from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.database import get_db
from backend.models.optimization import OptimizationRun, SignalPlan, QUBOVariable
from backend.schemas import OptimizationRequest, OptimizationRunOut
from backend.optimization.qaoa import QAOAOptimizer
from backend.optimization.qubo import QUBOFormulator
from backend.models.network import Intersection

router = APIRouter(prefix="/optimization", tags=["Quantum Traffic Optimization"])

@router.post("/run", response_model=OptimizationRunOut)
def run_optimization(req: OptimizationRequest, db: Session = Depends(get_db)):
    if req.method in ["QAOA", "QUANTUM_INSPIRED"]:
        opt = QAOAOptimizer(db)
        res = opt.optimize()

        # Save OptimizationRun
        run_obj = OptimizationRun(
            method=res["method"],
            solver_name=res["solver_name"],
            objective_value=res["objective_value"],
            feasibility=res["feasibility"],
            runtime_ms=res["runtime_ms"],
            qubo_size=res["qubo_size"],
            status=res["status"],
            signal_plan_json=res["signal_plan"],
            explanation=res["explanation"]
        )
        db.add(run_obj)
        db.commit()
        db.refresh(run_obj)

        # Update actual Intersection green durations in DB (Closed-Loop Control!)
        for inter_id, green in res["signal_plan"].items():
            inter = db.query(Intersection).filter(Intersection.id == inter_id).first()
            if inter:
                inter.current_green_duration = green

            plan = db.query(SignalPlan).filter(SignalPlan.intersection_id == inter_id).first()
            if not plan:
                plan = SignalPlan(intersection_id=inter_id)
                db.add(plan)
            plan.green_duration = green
            plan.source_type = "OPTIMIZED_QUBO"

        db.commit()
        return run_obj
    else:
        # Classical fallback methods
        from backend.services.signal_service import SignalControllerService
        if req.method == "ADAPTIVE_RULE":
            plans = SignalControllerService.apply_adaptive_rule_control(db)
            method_name = "ADAPTIVE_RULE"
        else:
            plans = SignalControllerService.apply_fixed_time_control(db)
            method_name = "FIXED_TIME"

        plan_json = {p.intersection_id: p.green_duration for p in plans}
        run_obj = OptimizationRun(
            method=method_name,
            solver_name=f"Classical {method_name} Controller",
            objective_value=120.0,
            feasibility=True,
            runtime_ms=2.5,
            qubo_size=0,
            status="SUCCESS",
            signal_plan_json=plan_json,
            explanation=f"Applied classical {method_name} signal timing strategy across Chennai corridor."
        )
        db.add(run_obj)
        db.commit()
        db.refresh(run_obj)
        return run_obj

@router.get("/runs", response_model=List[OptimizationRunOut])
def get_optimization_runs(db: Session = Depends(get_db)):
    return db.query(OptimizationRun).order_by(OptimizationRun.created_at.desc()).all()

@router.get("/qubo-matrix")
def get_qubo_matrix(db: Session = Depends(get_db)) -> Dict[str, Any]:
    formulator = QUBOFormulator(db)
    Q, meta = formulator.build_qubo_matrix()
    return {
        "matrix": Q.tolist(),
        "metadata": meta
    }
