from typing import Dict, Any, List
import pandas as pd
from backend.config import settings

class DataValidator:
    @staticmethod
    def validate_dataframe(df: pd.DataFrame, schema_type: str = "generic") -> Dict[str, Any]:
        report = {
            "total_records": len(df),
            "valid_records": 0,
            "invalid_records": 0,
            "missing_values_count": 0,
            "coordinate_errors_count": 0,
            "timestamp_errors_count": 0,
            "duplicate_records": 0,
            "errors": []
        }
        
        if df.empty:
            report["errors"].append("Dataset is empty.")
            return report

        # Check duplicates
        report["duplicate_records"] = int(df.duplicated().sum())

        # Check missing values
        null_counts = df.isnull().sum().to_dict()
        total_missing = int(sum(null_counts.values()))
        report["missing_values_count"] = total_missing

        valid_mask = pd.Series(True, index=df.index)

        # Coordinate Validation (if lat/lon present)
        lat_cols = [c for c in df.columns if c.lower() in ["latitude", "lat"]]
        lon_cols = [c for c in df.columns if c.lower() in ["longitude", "lon"]]

        if lat_cols and lon_cols:
            lat_c, lon_c = lat_cols[0], lon_cols[0]
            lat_invalid = ~df[lat_c].between(settings.CHENNAI_LAT_MIN, settings.CHENNAI_LAT_MAX)
            lon_invalid = ~df[lon_c].between(settings.CHENNAI_LON_MIN, settings.CHENNAI_LON_MAX)
            coord_invalid = lat_invalid | lon_invalid
            coord_errors = int(coord_invalid.sum())
            report["coordinate_errors_count"] = coord_errors
            if coord_errors > 0:
                report["errors"].append(f"{coord_errors} records have coordinates outside Chennai geofence ({settings.CHENNAI_LAT_MIN}-{settings.CHENNAI_LAT_MAX} N, {settings.CHENNAI_LON_MIN}-{settings.CHENNAI_LON_MAX} E).")
            valid_mask = valid_mask & (~coord_invalid)

        # Timestamp Validation
        ts_cols = [c for c in df.columns if c.lower() in ["timestamp", "recorded_at", "time"]]
        if ts_cols:
            ts_c = ts_cols[0]
            ts_invalid = df[ts_c].isnull() | (df[ts_c] <= 0)
            ts_errors = int(ts_invalid.sum())
            report["timestamp_errors_count"] = ts_errors
            if ts_errors > 0:
                report["errors"].append(f"{ts_errors} records have invalid timestamps.")
            valid_mask = valid_mask & (~ts_invalid)

        valid_count = int(valid_mask.sum())
        report["valid_records"] = valid_count
        report["invalid_records"] = len(df) - valid_count

        return report
