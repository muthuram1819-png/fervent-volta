import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base
from backend.models import *
from backend.services.network_service import NetworkService
from backend.services.data_ingestion import DataIngestionService
from backend.services.data_processing import DataProcessingService
from backend.optimization.qubo import QUBOFormulator
from backend.optimization.qaoa import QAOAOptimizer
from backend.services.emergency_service import EmergencyCorridorService
from backend.services.benchmark_service import BenchmarkEngineService

TEST_DB_URL = "sqlite:///:memory:"

@pytest.fixture
def db():
    engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_network_initialization(db):
    res = NetworkService.initialize_chennai_network(db)
    assert res["status"] == "SUCCESS"
    assert db.query(Intersection).count() > 0
    assert db.query(Road).count() > 0

def test_data_ingestion_and_processing(db):
    NetworkService.initialize_chennai_network(db)
    csv_data = b"timestamp,vehicle_id,vehicle_type,latitude,longitude,speed_kmh,acceleration_m_s2,road_id,intersection_id,direction,source_name\n1718000000,TN01_001,car,13.0067,80.2020,35.0,0.5,RD_2001_0,INT_1001,NORTHBOUND,SPT_Chennai"
    import_rec, val_report = DataIngestionService.ingest_file(db, csv_data, "test.csv", "spt")
    assert import_rec.status == "COMPLETED"
    assert val_report["valid_records"] == 1

    states = DataProcessingService.generate_traffic_states(db)
    assert len(states) > 0

def test_qubo_formulator(db):
    NetworkService.initialize_chennai_network(db)
    DataProcessingService.generate_traffic_states(db)
    formulator = QUBOFormulator(db)
    Q, meta = formulator.build_qubo_matrix()
    assert Q.shape[0] > 0
    assert meta["num_variables"] == Q.shape[0]

def test_qaoa_optimization(db):
    NetworkService.initialize_chennai_network(db)
    DataProcessingService.generate_traffic_states(db)
    opt = QAOAOptimizer(db)
    res = opt.optimize()
    assert "signal_plan" in res
    assert res["runtime_ms"] > 0

def test_emergency_green_corridor(db):
    NetworkService.initialize_chennai_network(db)
    scenario = EmergencyCorridorService.create_green_corridor(
        db, "AMB_001", "INT_1001", "INT_1006"
    )
    assert scenario.status == "ACTIVE"
    assert len(scenario.affected_intersections_json) > 0

def test_benchmarking_engine(db):
    NetworkService.initialize_chennai_network(db)
    DataProcessingService.generate_traffic_states(db)
    res = BenchmarkEngineService.run_comprehensive_benchmark(db)
    assert len(res["results"]) == 3
