import numpy as np
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from backend.models.network import Intersection, Road
from backend.models.traffic import TrafficState

GREEN_OPTIONS = [20, 30, 40] # seconds

class QUBOFormulator:
    def __init__(self, db: Session, penalty_weight: float = 500.0):
        self.db = db
        self.penalty_weight = penalty_weight
        self.intersections = db.query(Intersection).all()
        self.var_names: List[str] = []
        self.var_map: Dict[str, Tuple[str, int]] = {} # var_name -> (intersection_id, green_sec)
        self.index_map: Dict[str, int] = {} # var_name -> index in QUBO matrix

        idx = 0
        for inter in self.intersections:
            for green in GREEN_OPTIONS:
                vname = f"x_{inter.id}_{green}s"
                self.var_names.append(vname)
                self.var_map[vname] = (inter.id, green)
                self.index_map[vname] = idx
                idx += 1

        self.num_vars = len(self.var_names)

    def build_qubo_matrix(self) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Build N x N QUBO matrix Q such that cost x^T Q x is minimized
        """
        Q = np.zeros((self.num_vars, self.num_vars))

        # 1. Single-choice Constraint Penalties: P * (\sum_{t} x_{i,t} - 1)^2
        for inter in self.intersections:
            indices = [self.index_map[f"x_{inter.id}_{t}s"] for t in GREEN_OPTIONS]
            for i in indices:
                Q[i, i] -= self.penalty_weight # Linear term (-2*P + P = -P)
                for j in indices:
                    Q[i, j] += self.penalty_weight # Quadratic term (+P for off-diagonal, cancel out for diagonal)

        # 2. Delay & Queue Objective Costs
        for inter in self.intersections:
            states = self.db.query(TrafficState).filter(TrafficState.intersection_id == inter.id).all()
            avg_queue = (sum(s.queue_length_m for s in states) / len(states)) if states else 25.0
            avg_flow = (sum(s.traffic_flow_vph for s in states) / len(states)) if states else 600.0

            for green in GREEN_OPTIONS:
                idx = self.index_map[f"x_{inter.id}_{green}s"]
                # Cost model: Longer queue needs larger green time.
                # Delay penalty = Queue * max(0, 45 - green) + High volume penalty
                delay_cost = (avg_queue * (45.0 - green)) + (avg_flow * 0.05 * (40.0 / green))
                Q[idx, idx] += delay_cost

        # 3. Inter-intersection Corridor Coordination Penalties
        roads = self.db.query(Road).all()
        for road in roads:
            src = road.source_node_id
            tgt = road.target_node_id
            if src in [i.id for i in self.intersections] and tgt in [i.id for i in self.intersections]:
                for g_src in GREEN_OPTIONS:
                    for g_tgt in GREEN_OPTIONS:
                        idx_src = self.index_map[f"x_{src}_{g_src}s"]
                        idx_tgt = self.index_map[f"x_{tgt}_{g_tgt}s"]
                        # Mismatched signal offsets create bottleneck delay
                        coord_penalty = abs(g_src - g_tgt) * 2.5
                        Q[idx_src, idx_tgt] += coord_penalty / 2.0
                        Q[idx_tgt, idx_src] += coord_penalty / 2.0

        meta = {
            "num_variables": self.num_vars,
            "intersections_count": len(self.intersections),
            "variable_names": self.var_names,
            "penalty_weight": self.penalty_weight
        }

        return Q, meta

    def decode_solution(self, bitstring: List[int]) -> Tuple[Dict[str, int], bool]:
        """
        Decode binary solution vector into intersection green durations
        """
        solution_plan = {}
        is_feasible = True

        for inter in self.intersections:
            selected_greens = []
            for green in GREEN_OPTIONS:
                idx = self.index_map[f"x_{inter.id}_{green}s"]
                if bitstring[idx] == 1:
                    selected_greens.append(green)

            if len(selected_greens) == 1:
                solution_plan[inter.id] = selected_greens[0]
            elif len(selected_greens) > 1:
                solution_plan[inter.id] = selected_greens[0] # Fallback to first selected
                is_feasible = False
            else:
                solution_plan[inter.id] = 30 # Default fallback
                is_feasible = False

        return solution_plan, is_feasible
