# ARCHITECTURE DOCUMENTATION

## System Overview

```
[ Real Public Data (OSM / SPT / Mapunity) ]
                   │
                   ▼
       [ Data Ingestion Adapter ]
                   │
                   ▼
     [ Data Validation & Provenance ]
                   │
                   ▼
        [ SQLite Database (ORM) ] ───► [ NetworkX DiGraph ]
                   │                         │
                   ▼                         ▼
      [ Aggregated Traffic State ] ──► [ QUBO Matrix Builder ]
                   │                         │
                   ▼                         ▼
      [ Digital Twin Simulator ] ◄─── [ QAOA / Solver ]
                   │
                   ▼
        [ FastAPI REST Services ]
                   │
                   ▼
    [ React + TypeScript Control Center ]
```

---

## Component Breakdown

1. **Ingestion & Adapter Layer (`backend/services/adapters/`)**
   - Normalizes heterogeneous raw datasets (CSV, JSON, OSM Overpass) into standard internal schemas.
   - Extracts coordinates, speeds, vehicle classes, timestamps, and road identifiers.

2. **Validation & Provenance (`backend/services/data_validation.py`, `data_provenance.py`)**
   - Checks spatial geofence bounds (Chennai: 12.80–13.30° N, 80.00–80.40° E).
   - Generates data quality reports (valid/invalid counts, missing values, coordinate errors).
   - Assigns provenance metadata badges (`REAL_OBSERVED`, `REAL_IMPORTED`, `DERIVED`, `SIMULATED`).

3. **Graph & Network Layer (`backend/services/network_service.py`)**
   - Constructs NetworkX directed graphs representing roads and intersections.
   - Computes travel time weights and shortest path routing for emergency corridor priority.

4. **Optimization Engine (`backend/optimization/`)**
   - `qubo.py`: Formulates binary decision variables $x_{i, t}$ ($t \in \{20s, 30s, 40s\}$) for green signal timings.
   - Applies penalty terms $P(\sum x_{i,t} - 1)^2$ and minimizes combined queue delay & inter-intersection bottleneck penalties.
   - `qaoa.py` & `classical_optimizer.py`: Executes QAOA on Qiskit Aer or exact Simulated Annealing fallback.

5. **Closed-Loop Control & Digital Twin (`backend/services/digital_twin.py`)**
   - Integrates optimization output into intersection signal controllers.
   - Advances local simulation steps and recalculates queue accumulation and congestion indices.
