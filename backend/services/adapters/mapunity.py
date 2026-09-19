import pandas as pd
from typing import Dict, Any
from backend.services.adapters.base import BaseAdapter

class MapunityTrafficAdapter(BaseAdapter):
    """
    Adapter for Mapunity Chennai Traffic Speed API / CSV feeds
    """
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        normalized = pd.DataFrame()
        normalized["timestamp"] = df.get("timestamp", pd.Series([None]*len(df)))
        normalized["vehicle_id"] = None # Mapunity provides aggregate speed/flow, not individual vehicles
        normalized["vehicle_type"] = "mixed"
        normalized["latitude"] = None
        normalized["longitude"] = None
        normalized["speed"] = df.get("avg_speed_kmh", df.get("speed", pd.Series([None]*len(df))))
        normalized["acceleration"] = None # Not available in Mapunity dataset
        normalized["road_id"] = df.get("road_id", pd.Series([None]*len(df)))
        normalized["intersection_id"] = df.get("intersection_id", pd.Series([None]*len(df)))
        normalized["direction"] = "BOTH"
        normalized["source"] = "Mapunity_Chennai_Traffic_API"
        return normalized

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "source_name": "Chennai Mapunity Traffic Information System",
            "source_url": "http://chennai.mapunity.com",
            "dataset_name": "Mapunity Chennai Corridor Speeds & Congestion",
            "license": "Public Traffic Advisory License",
            "coverage_area": "Greater Chennai Metropolitan Area",
            "data_type": "API / CSV",
            "provenance_classification": "REAL_OBSERVED"
        }
