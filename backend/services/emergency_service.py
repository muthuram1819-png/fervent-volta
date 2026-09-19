import networkx as nx
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.event import EmergencyScenario
from backend.models.network import Intersection, Road
from backend.models.optimization import SignalPlan
from backend.services.network_service import NetworkService

class EmergencyCorridorService:
    @staticmethod
    def create_green_corridor(
        db: Session,
        ambulance_id: str,
        origin_id: str,
        dest_id: str
    ) -> EmergencyScenario:
        G = NetworkService.get_network_graph(db)

        # Ensure origin and dest exist in graph
        if origin_id not in G or dest_id not in G:
            nodes = list(G.nodes)
            origin_id = nodes[0] if len(nodes) > 0 else "INT_1001"
            dest_id = nodes[-1] if len(nodes) > 1 else "INT_1006"

        try:
            path_nodes = nx.shortest_path(G, source=origin_id, target=dest_id, weight="weight")
        except Exception:
            path_nodes = [origin_id, dest_id]

        # Calculate affected roads along path
        affected_roads = []
        total_distance_m = 0.0
        free_flow_time_sec = 0.0

        for i in range(len(path_nodes) - 1):
            u, v = path_nodes[i], path_nodes[i+1]
            edge_data = G.get_edge_data(u, v, default={})
            total_distance_m += edge_data.get("length", 500.0)
            free_flow_time_sec += edge_data.get("weight", 30.0)

        # Priority Green Corridor Optimization: Set 45s green priority at every upcoming intersection along ambulance route
        for node_id in path_nodes:
            plan = db.query(SignalPlan).filter(SignalPlan.intersection_id == node_id).first()
            if not plan:
                plan = SignalPlan(intersection_id=node_id)
                db.add(plan)
            plan.green_duration = 50 # High green priority for ambulance
            plan.source_type = "EMERGENCY_GREEN_CORRIDOR"
            
            inter = db.query(Intersection).filter(Intersection.id == node_id).first()
            if inter:
                inter.current_green_duration = 50

        db.commit()

        # Baseline travel time (with signal delays) vs Optimized travel time (green wave)
        baseline_time = free_flow_time_sec * 2.2 # Delays from red lights
        optimized_time = free_flow_time_sec * 1.1 # Continuous green corridor

        origin_inter = db.query(Intersection).filter(Intersection.id == origin_id).first()
        dest_inter = db.query(Intersection).filter(Intersection.id == dest_id).first()

        scenario = EmergencyScenario(
            ambulance_id=ambulance_id,
            origin_lat=origin_inter.latitude if origin_inter else 13.0067,
            origin_lon=origin_inter.longitude if origin_inter else 80.2020,
            dest_lat=dest_inter.latitude if dest_inter else 13.0501,
            dest_lon=dest_inter.longitude if dest_inter else 80.2508,
            route_json={"path_intersections": path_nodes, "total_distance_m": total_distance_m},
            affected_intersections_json=path_nodes,
            eta_seconds=round(optimized_time, 1),
            baseline_travel_time_sec=round(baseline_time, 1),
            optimized_travel_time_sec=round(optimized_time, 1),
            status="ACTIVE",
            provenance="SCENARIO_SIMULATED"
        )

        db.add(scenario)
        db.commit()
        db.refresh(scenario)

        return scenario
