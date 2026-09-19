import pandas as pd
from typing import Dict, Any
from backend.services.adapters.base import BaseAdapter

class ChennaiTrafficDataAdapter(BaseAdapter):
    """
    Adapter for Chennai SPT (Seerattra Pokkuvarathu Tharavu) Drone Trajectory Dataset
    """
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        normalized = pd.DataFrame()
        normalized["timestamp"] = df.get("timestamp", pd.Series([None]*len(df)))
        normalized["vehicle_id"] = df.get("vehicle_id", pd.Series([None]*len(df)))
        normalized["vehicle_type"] = df.get("vehicle_type", pd.Series(["car"]*len(df)))
        normalized["latitude"] = df.get("latitude", pd.Series([None]*len(df)))
        normalized["longitude"] = df.get("longitude", pd.Series([None]*len(df)))
        normalized["speed"] = df.get("speed_kmh", df.get("speed", pd.Series([None]*len(df))))
        normalized["acceleration"] = df.get("acceleration_m_s2", df.get("acceleration", pd.Series([None]*len(df))))
        normalized["road_id"] = df.get("road_id", pd.Series([None]*len(df)))
        normalized["intersection_id"] = df.get("intersection_id", pd.Series([None]*len(df)))
        normalized["direction"] = df.get("direction", pd.Series(["NORTHBOUND"]*len(df)))
        normalized["source"] = "SPT_Chennai_UAV_Dataset"
        return normalized

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "source_name": "Chennai SPT Drone Trajectory Dataset",
            "source_url": "https://chennaitrafficdata.com",
            "dataset_name": "SPT Chennai Vehicle Trajectories",
            "license": "Research CC-BY 4.0",
            "coverage_area": "Anna Salai Corridor, Chennai, TN",
            "data_type": "CSV",
            "provenance_classification": "REAL_OBSERVED"
        }
