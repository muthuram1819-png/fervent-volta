import pandas as pd
from typing import Dict, Any
from backend.services.adapters.base import BaseAdapter

class GCCRoadAdapter(BaseAdapter):
    """
    Adapter for Greater Chennai Corporation (GCC) Infrastructure Datasets
    """
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        normalized = pd.DataFrame()
        normalized["timestamp"] = pd.Series([None]*len(df))
        normalized["vehicle_id"] = None
        normalized["vehicle_type"] = None
        normalized["latitude"] = df.get("latitude", pd.Series([None]*len(df)))
        normalized["longitude"] = df.get("longitude", pd.Series([None]*len(df)))
        normalized["speed"] = None
        normalized["acceleration"] = None
        normalized["road_id"] = df.get("road_code", pd.Series([None]*len(df)))
        normalized["intersection_id"] = df.get("junction_code", pd.Series([None]*len(df)))
        normalized["direction"] = "BIDIRECTIONAL"
        normalized["source"] = "Greater_Chennai_Corporation_GIS"
        return normalized

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "source_name": "Greater Chennai Corporation (GCC) GIS",
            "source_url": "https://www.chennaicorporation.gov.in",
            "dataset_name": "GCC Road Asset Register",
            "license": "Government Open Data License - India",
            "coverage_area": "Greater Chennai Corporation Limits",
            "data_type": "CSV / GeoJSON",
            "provenance_classification": "REAL_IMPORTED"
        }

class GenericCSVAdapter(BaseAdapter):
    """
    Generic CSV Adapter mapping flexible column names
    """
    def normalize(self, df: pd.DataFrame) -> pd.DataFrame:
        normalized = pd.DataFrame()
        
        # Flexibly match timestamp
        ts_cols = [c for c in df.columns if "time" in c.lower() or "ts" in c.lower()]
        normalized["timestamp"] = df[ts_cols[0]] if ts_cols else pd.Series([None]*len(df))

        # Flexibly match vehicle ID
        v_cols = [c for c in df.columns if "veh" in c.lower() or "id" in c.lower()]
        normalized["vehicle_id"] = df[v_cols[0]] if v_cols else pd.Series([None]*len(df))

        # Vehicle type
        vt_cols = [c for c in df.columns if "type" in c.lower() or "class" in c.lower()]
        normalized["vehicle_type"] = df[vt_cols[0]] if vt_cols else pd.Series(["car"]*len(df))

        # Latitude / Longitude
        lat_cols = [c for c in df.columns if "lat" in c.lower()]
        lon_cols = [c for c in df.columns if "lon" in c.lower() or "lng" in c.lower()]
        normalized["latitude"] = df[lat_cols[0]] if lat_cols else pd.Series([None]*len(df))
        normalized["longitude"] = df[lon_cols[0]] if lon_cols else pd.Series([None]*len(df))

        # Speed
        sp_cols = [c for c in df.columns if "speed" in c.lower() or "spd" in c.lower()]
        normalized["speed"] = df[sp_cols[0]] if sp_cols else pd.Series([None]*len(df))

        normalized["acceleration"] = pd.Series([None]*len(df))

        # Road / Intersection
        r_cols = [c for c in df.columns if "road" in c.lower() or "way" in c.lower()]
        int_cols = [c for c in df.columns if "intersection" in c.lower() or "node" in c.lower() or "junction" in c.lower()]
        normalized["road_id"] = df[r_cols[0]] if r_cols else pd.Series([None]*len(df))
        normalized["intersection_id"] = df[int_cols[0]] if int_cols else pd.Series([None]*len(df))

        normalized["direction"] = "NORTHBOUND"
        normalized["source"] = "Generic_User_Uploaded_CSV"
        return normalized

    def get_source_metadata(self) -> Dict[str, Any]:
        return {
            "source_name": "User Uploaded Dataset",
            "source_url": "N/A (Local Upload)",
            "dataset_name": "Custom Imported CSV",
            "license": "User Provided",
            "coverage_area": "User Defined",
            "data_type": "CSV",
            "provenance_classification": "REAL_IMPORTED"
        }
