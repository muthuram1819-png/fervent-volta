import os
import io
import json
import pandas as pd
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from backend.models.data_source import DataSource, Dataset, DataImport
from backend.models.traffic import Vehicle, TrafficObservation
from backend.services.data_validation import DataValidator
from backend.services.adapters import (
    ChennaiTrafficDataAdapter, MapunityTrafficAdapter,
    OSMRoadAdapter, GCCRoadAdapter, GenericCSVAdapter
)

class DataIngestionService:
    @staticmethod
    def ingest_file(
        db: Session,
        file_bytes: bytes,
        filename: str,
        adapter_type: str = "generic"
    ) -> Tuple[DataImport, Dict[str, Any]]:
        file_ext = filename.split(".")[-1].lower()

        # Choose adapter
        if adapter_type == "spt" or "spt" in filename.lower():
            adapter = ChennaiTrafficDataAdapter()
        elif adapter_type == "mapunity" or "mapunity" in filename.lower():
            adapter = MapunityTrafficAdapter()
        elif adapter_type == "osm" or "osm" in filename.lower():
            adapter = OSMRoadAdapter()
        elif adapter_type == "gcc" or "gcc" in filename.lower():
            adapter = GCCRoadAdapter()
        else:
            adapter = GenericCSVAdapter()

        # Read into pandas
        if file_ext == "csv":
            df_raw = pd.read_csv(io.BytesIO(file_bytes))
        elif file_ext == "json":
            data = json.loads(file_bytes.decode("utf-8"))
            if isinstance(data, list):
                df_raw = pd.DataFrame(data)
            elif "elements" in data:
                df_raw = pd.DataFrame(data["elements"])
            else:
                df_raw = pd.DataFrame([data])
        else:
            df_raw = pd.DataFrame()

        # Validate raw data
        val_report = DataValidator.validate_dataframe(df_raw, schema_type=adapter_type)

        # Normalize with adapter
        df_norm = adapter.normalize(df_raw)

        meta = adapter.get_source_metadata()

        # Create or update DataSource DB record
        ds = db.query(DataSource).filter(DataSource.source_name == meta["source_name"]).first()
        if not ds:
            ds = DataSource(
                source_name=meta["source_name"],
                source_url=meta["source_url"],
                dataset_name=meta["dataset_name"],
                license=meta["license"],
                coverage_area=meta["coverage_area"],
                data_type=meta["data_type"],
                status="VALIDATED" if val_report["invalid_records"] == 0 else "PARTIALLY_AVAILABLE"
            )
            db.add(ds)
            db.commit()
            db.refresh(ds)

        # Create Dataset record
        dataset_rec = Dataset(
            source_id=ds.id,
            name=meta["dataset_name"],
            provenance_type=meta["provenance_classification"],
            total_records=val_report["total_records"],
            valid_records=val_report["valid_records"],
            invalid_records=val_report["invalid_records"],
            missing_values_count=val_report["missing_values_count"],
            coordinate_errors_count=val_report["coordinate_errors_count"],
            timestamp_errors_count=val_report["timestamp_errors_count"]
        )
        db.add(dataset_rec)
        db.commit()
        db.refresh(dataset_rec)

        # Create DataImport record
        import_rec = DataImport(
            filename=filename,
            file_type=file_ext.upper(),
            dataset_name=meta["dataset_name"],
            records_processed=len(df_norm),
            status="COMPLETED",
            provenance_category=meta["provenance_classification"],
            validation_report=val_report
        )
        db.add(import_rec)
        db.commit()

        # Save Vehicle trajectory observations
        for idx, row in df_norm.iterrows():
            if pd.notnull(row.get("vehicle_id")) and pd.notnull(row.get("latitude")):
                veh = Vehicle(
                    vehicle_id=str(row["vehicle_id"]),
                    vehicle_type=str(row.get("vehicle_type", "car")),
                    latitude=float(row["latitude"]),
                    longitude=float(row["longitude"]),
                    speed_kmh=float(row["speed"]) if pd.notnull(row.get("speed")) else 0.0,
                    acceleration_m_s2=float(row["acceleration"]) if pd.notnull(row.get("acceleration")) else 0.0,
                    road_id=str(row["road_id"]) if pd.notnull(row.get("road_id")) else None,
                    intersection_id=str(row["intersection_id"]) if pd.notnull(row.get("intersection_id")) else None,
                    direction=str(row.get("direction", "NORTHBOUND")),
                    provenance=meta["provenance_classification"],
                    timestamp=float(row["timestamp"]) if pd.notnull(row.get("timestamp")) else 1718000000.0
                )
                db.add(veh)
        db.commit()

        return import_rec, val_report
