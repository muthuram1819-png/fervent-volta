from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from datetime import datetime
from backend.database import Base

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String, index=True, nullable=False)
    source_url = Column(String, nullable=True)
    dataset_name = Column(String, nullable=False)
    license = Column(String, default="Open Data / CC-BY")
    coverage_area = Column(String, default="Chennai, Tamil Nadu, India")
    time_period = Column(String, nullable=True)
    field_description = Column(Text, nullable=True)
    data_type = Column(String, default="CSV") # CSV, JSON, API
    status = Column(String, default="CONNECTED") # CONNECTED, IMPORTED, VALIDATED, PARTIALLY_AVAILABLE, UNAVAILABLE
    created_at = Column(DateTime, default=datetime.utcnow)

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    provenance_type = Column(String, default="REAL_OBSERVED") # REAL_OBSERVED, REAL_IMPORTED, DERIVED_FROM_REAL_DATA, SIMULATED, SYNTHETIC, UNKNOWN
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    missing_values_count = Column(Integer, default=0)
    coordinate_errors_count = Column(Integer, default=0)
    timestamp_errors_count = Column(Integer, default=0)
    import_timestamp = Column(DateTime, default=datetime.utcnow)

class DataImport(Base):
    __tablename__ = "data_imports"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    dataset_name = Column(String, nullable=False)
    records_processed = Column(Integer, default=0)
    status = Column(String, default="COMPLETED") # COMPLETED, FAILED, IN_PROGRESS
    provenance_category = Column(String, default="REAL_IMPORTED")
    validation_report = Column(JSON, nullable=True)
    imported_at = Column(DateTime, default=datetime.utcnow)
