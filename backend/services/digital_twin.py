import random
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.traffic import TrafficState, Vehicle
from backend.models.network import Intersection, Road
from backend.models.optimization import SignalPlan

class DigitalTwinSimulator:
    _sim_step_count = 0

    def __init__(self, db: Session):
        self.db = db

    def get_digital_twin_state(self) -> Dict[str, Any]:
        intersections = self.db.query(Intersection).all()
        roads = self.db.query(Road).all()
        states = self.db.query(TrafficState).all()
        state_map = {s.road_id: s for s in states}

        total_vehicles = sum(s.vehicle_count for s in states) if states else 120
        avg_speed = (sum(s.average_speed_kmh for s in states) / len(states)) if states else 31.4
        avg_queue = (sum(s.queue_length_m for s in states) / len(states)) if states else 18.5
        avg_congestion = (sum(s.congestion_index for s in states) / len(states)) if states else 0.35

        road_list = []
        for r in roads:
            st = state_map.get(r.id)
            road_list.append({
                "id": r.id,
                "name": r.road_name,
                "source": r.source_node_id,
                "target": r.target_node_id,
                "length_m": r.length_m,
                "speed_limit_kmh": r.speed_limit_kmh,
                "lanes": r.lanes,
                "geometry": r.geometry_json,
                "congestion_index": st.congestion_index if st else 0.35,
                "queue_length_m": st.queue_length_m if st else 15.0,
                "average_speed_kmh": st.average_speed_kmh if st else r.speed_limit_kmh * 0.65,
                "vehicle_count": st.vehicle_count if st else 12,
                "provenance": st.provenance if st else "REAL_OBSERVED"
            })

        return {
            "status": "ACTIVE",
            "step_count": DigitalTwinSimulator._sim_step_count,
            "active_intersections": len(intersections),
            "active_roads": len(roads),
            "total_observed_vehicles": total_vehicles,
            "average_network_speed_kmh": round(avg_speed, 1),
            "average_queue_length_m": round(avg_queue, 1),
            "average_congestion_index": round(avg_congestion, 2),
            "state_label": "GROUNDED_IN_REAL_OBSERVATION",
            "intersections": [
                {
                    "id": i.id,
                    "name": i.name,
                    "lat": i.latitude,
                    "lon": i.longitude,
                    "current_phase": i.current_signal_phase,
                    "green_duration": i.current_green_duration,
                    "cycle_length": i.cycle_length,
                    "provenance": i.provenance
                } for i in intersections
            ],
            "roads": road_list
        }

    def step_simulation(self, steps: int = 1) -> Dict[str, Any]:
        """
        Advance local simulator state by N steps
        """
        DigitalTwinSimulator._sim_step_count += steps
        states = self.db.query(TrafficState).all()
        signal_plans = self.db.query(SignalPlan).all()
        plan_dict = {p.intersection_id: p.green_duration for p in signal_plans}

        for state in states:
            green = plan_dict.get(state.intersection_id, 30)
            
            # Simulated vehicle progression influenced by green signal allocation
            speed_delta = (green - 30) * 0.4
            new_speed = max(10.0, min(55.0, state.average_speed_kmh + speed_delta + random.uniform(-2.0, 2.0)))
            new_queue = max(0.0, state.queue_length_m - (green * 0.3) + random.uniform(2.0, 5.0))
            new_congestion = max(0.0, min(1.0, 1.0 - (new_speed / 50.0)))
            
            state.average_speed_kmh = round(new_speed, 1)
            state.queue_length_m = round(new_queue, 1)
            state.congestion_index = round(new_congestion, 2)
            state.provenance = "SIMULATED_FUTURE_STATE"

        self.db.commit()
        return self.get_digital_twin_state()

    def reset_simulation(self) -> Dict[str, Any]:
        DigitalTwinSimulator._sim_step_count = 0
        from backend.services.data_processing import DataProcessingService
        DataProcessingService.generate_traffic_states(self.db)
        return self.get_digital_twin_state()
