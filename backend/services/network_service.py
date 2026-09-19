import os
import json
import networkx as nx
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.models.network import Intersection, Road, Connection

class NetworkService:
    @staticmethod
    def initialize_chennai_network(db: Session) -> Dict[str, Any]:
        """
        Load OpenStreetMap Chennai corridor network into SQLite & NetworkX
        """
        osm_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "chennai_osm_corridor.json")
        if not os.path.exists(osm_path):
            return {"error": "OSM raw file not found"}

        with open(osm_path, "r", encoding="utf-8") as f:
            osm_data = json.load(f)

        elements = osm_data.get("elements", [])
        nodes = {e["id"]: e for e in elements if e["type"] == "node"}
        ways = [e for e in elements if e["type"] == "way"]

        # Clear existing network if re-initializing
        db.query(Intersection).delete()
        db.query(Road).delete()
        db.query(Connection).delete()
        db.commit()

        # Build Intersections
        intersections_created = []
        for node_id, node in nodes.items():
            tags = node.get("tags", {})
            name = tags.get("name", f"Intersection {node_id}")
            hw_type = tags.get("highway", "traffic_signals")
            int_id = f"INT_{node_id}"

            intersection_obj = Intersection(
                id=int_id,
                name=name,
                latitude=node["lat"],
                longitude=node["lon"],
                highway_type=hw_type,
                lanes=4,
                current_signal_phase="PHASE_1_MAIN",
                current_green_duration=30,
                cycle_length=60,
                provenance="REAL_OBSERVED"
            )
            db.add(intersection_obj)
            intersections_created.append(intersection_obj)

        # Build Roads
        roads_created = []
        for way in ways:
            way_id = way["id"]
            tags = way.get("tags", {})
            road_name = tags.get("name", f"Road {way_id}")
            node_refs = way.get("nodes", [])
            maxspeed = float(tags.get("maxspeed", 50))
            lanes = int(tags.get("lanes", 3))
            hw_class = tags.get("highway", "primary")

            if len(node_refs) >= 2:
                for i in range(len(node_refs) - 1):
                    src = f"INT_{node_refs[i]}"
                    tgt = f"INT_{node_refs[i+1]}"
                    road_id = f"RD_{way_id}_{i}"

                    # Approximate distance calculation in meters
                    src_node = nodes.get(node_refs[i])
                    tgt_node = nodes.get(node_refs[i+1])
                    length_m = 500.0
                    if src_node and tgt_node:
                        dlat = (tgt_node["lat"] - src_node["lat"]) * 111000.0
                        dlon = (tgt_node["lon"] - src_node["lon"]) * 111000.0 * 0.97
                        length_m = round(max((dlat**2 + dlon**2)**0.5, 150.0), 1)

                    road_obj = Road(
                        id=road_id,
                        road_name=road_name,
                        source_node_id=src,
                        target_node_id=tgt,
                        length_m=length_m,
                        speed_limit_kmh=maxspeed,
                        lanes=lanes,
                        road_class=hw_class,
                        geometry_json={"type": "LineString", "coordinates": [[src_node["lon"], src_node["lat"]], [tgt_node["lon"], tgt_node["lat"]]]} if src_node and tgt_node else None,
                        provenance="REAL_OBSERVED"
                    )
                    db.add(road_obj)
                    roads_created.append(road_obj)

        db.commit()

        return {
            "status": "SUCCESS",
            "intersections_count": len(intersections_created),
            "roads_count": len(roads_created),
            "corridor": "Anna Salai - Kathipara - Guindy - T. Nagar Corridor, Chennai"
        }

    @staticmethod
    def get_network_graph(db: Session) -> nx.DiGraph:
        """
        Build NetworkX DiGraph representation of Chennai road network
        """
        G = nx.DiGraph()
        intersections = db.query(Intersection).all()
        roads = db.query(Road).all()

        for inter in intersections:
            G.add_node(inter.id, name=inter.name, lat=inter.latitude, lon=inter.longitude)

        for road in roads:
            # Travel time weight in seconds = length_m / (speed_m_s)
            speed_ms = max((road.speed_limit_kmh * 1000.0) / 3600.0, 1.0)
            free_flow_time_sec = road.length_m / speed_ms

            G.add_edge(
                road.source_node_id,
                road.target_node_id,
                road_id=road.id,
                road_name=road.road_name,
                length=road.length_m,
                speed_limit=road.speed_limit_kmh,
                lanes=road.lanes,
                weight=free_flow_time_sec
            )

        return G
