from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.models.network import Intersection
from backend.models.traffic import TrafficState
from backend.models.optimization import SignalPlan

class SignalControllerService:
    @staticmethod
    def apply_fixed_time_control(db: Session) -> List[SignalPlan]:
        intersections = db.query(Intersection).all()
        plans = []
        for inter in intersections:
            plan = db.query(SignalPlan).filter(SignalPlan.intersection_id == inter.id).first()
            if not plan:
                plan = SignalPlan(intersection_id=inter.id)
                db.add(plan)
            
            plan.green_duration = 30 # Fixed 30s
            plan.yellow_duration = 5
            plan.red_duration = 25
            plan.cycle_length = 60
            plan.source_type = "CONFIGURED_BASELINE"
            
            inter.current_green_duration = 30
            plans.append(plan)

        db.commit()
        return plans

    @staticmethod
    def apply_adaptive_rule_control(db: Session) -> List[SignalPlan]:
        intersections = db.query(Intersection).all()
        plans = []

        for inter in intersections:
            # Query traffic state for roads leading to this intersection
            states = db.query(TrafficState).filter(TrafficState.intersection_id == inter.id).all()
            avg_queue = (sum(s.queue_length_m for s in states) / len(states)) if states else 20.0
            
            # Rule-based adaptation:
            if avg_queue > 40.0:
                green = 45 # Heavy queue gets extra green
            elif avg_queue > 20.0:
                green = 30 # Moderate queue
            else:
                green = 20 # Light queue gets shorter green

            plan = db.query(SignalPlan).filter(SignalPlan.intersection_id == inter.id).first()
            if not plan:
                plan = SignalPlan(intersection_id=inter.id)
                db.add(plan)

            plan.green_duration = green
            plan.yellow_duration = 5
            plan.red_duration = max(10, 60 - green - 5)
            plan.cycle_length = 60
            plan.source_type = "ADAPTIVE_RULE"

            inter.current_green_duration = green
            plans.append(plan)

        db.commit()
        return plans
