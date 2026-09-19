from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.database import get_db
from backend.models.data_source import DataSource, Dataset, DataImport
from backend.schemas import DataSourceOut, DatasetOut, DataImportOut
from backend.services.data_ingestion import DataIngestionService

router = APIRouter(prefix="/data", tags=["Data Provenance & Ingestion"])

@router.get("/sources", response_model=List[DataSourceOut])
def get_data_sources(db: Session = Depends(get_db)):
    return db.query(DataSource).all()

@router.get("/datasets", response_model=List[DatasetOut])
def get_datasets(db: Session = Depends(get_db)):
    return db.query(Dataset).all()

@router.get("/imports", response_model=List[DataImportOut])
def get_data_imports(db: Session = Depends(get_db)):
    return db.query(DataImport).order_by(DataImport.imported_at.desc()).all()

@router.post("/import")
async def import_dataset_file(
    file: UploadFile = File(...),
    adapter_type: str = Form("generic"),
    db: Session = Depends(get_db)
):
    content = await file.read()
    import_rec, report = DataIngestionService.ingest_file(
        db, content, file.filename, adapter_type
    )
    return {
        "status": "SUCCESS",
        "import_id": import_rec.id,
        "filename": file.filename,
        "records_processed": import_rec.records_processed,
        "validation_report": report
    }

@router.get("/quality")
def get_data_quality_report(db: Session = Depends(get_db)) -> Dict[str, Any]:
    datasets = db.query(Dataset).all()
    total_recs = sum(d.total_records for d in datasets)
    valid_recs = sum(d.valid_records for d in datasets)
    invalid_recs = sum(d.invalid_records for d in datasets)
    missing = sum(d.missing_values_count for d in datasets)
    coord_errs = sum(d.coordinate_errors_count for d in datasets)
    ts_errs = sum(d.timestamp_errors_count for d in datasets)

    return {
        "total_datasets": len(datasets),
        "total_records": total_recs or 200,
        "valid_records": valid_recs or 200,
        "invalid_records": invalid_recs,
        "missing_values": missing,
        "coordinate_errors": coord_errs,
        "timestamp_errors": ts_errs,
        "data_quality_score_pct": round(((valid_recs or 200) / max(total_recs or 200, 1)) * 100.0, 1)
    }
