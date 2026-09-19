import pandas as pd
from typing import Dict, Any
from backend.services.adapters.base import BaseAdapter

class OSMRoadAdapter(BaseAdapter):
    """
    Adapter for OpenStreetMap Road & Highway GIS Features
    """
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        normalized = pd.DataFrame()
        normalized["timestamp"] = pd.Series([None]*len(df))
        normalized["vehicle_id"] = None
        normalized["vehicle_type"] = None
        normalized["latitude"] = df.get("latitude", df.get("lat", pd.Series([None]*len(df))))
        normalized["longitude"] = df.get("longitude", df.get("lon", pd.Series([None]*len(df))))
        normalized["speed"] = df.get("maxspeed", pd.Series([None]*len(df)))
        normalized["acceleration"] = None
        normalized["road_id"] = df.get("id", df.get("way_id", pd.Series([None]*len(df))))
        normalized["intersection_id"] = df.get("node_id", pd.Series([None]*len(df)))
        normalized["direction"] = "BIDIRECTIONAL"
        normalized["source"] = "OpenStreetMap_Chennai"
        return normalized

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "source_name": "OpenStreetMap Foundation",
            "source_url": "https://www.openstreetmap.org",
            "dataset_name": "Chennai Corridor Highway Network GIS",
            "license": "ODbL (Open Database License)",
            "coverage_area": "Chennai Bounding Box [13.00,80.20 to 13.06,80.26]",
            "data_type": "OSM Overpass JSON",
            "provenance_classification": "REAL_OBSERVED"
        }
