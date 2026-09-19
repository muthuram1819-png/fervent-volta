# Quantum Adaptive Traffic Digital Twin (Chennai, India)

A real-data-driven intelligent transportation platform for adaptive urban traffic optimization in Chennai, Tamil Nadu, India using hybrid quantum-classical optimization (QUBO & QAOA).

![License](https://img.shields.io/badge/license-CC--BY--4.0-blue)
![Python](https://img.shields.io/badge/python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-green)
![Qiskit](https://img.shields.io/badge/Qiskit-2.5-purple)
![React](https://img.shields.io/badge/React-18-cyan)

---

## Key Features

- **Real Geographic Road Network**: Extracted from OpenStreetMap for the Anna Salai – Kathipara Junction – Guindy – T. Nagar corridor in Chennai.
- **Data Ingestion Pipeline & Provenance**: Imports real public vehicle trajectories (Chennai SPT Drone Trajectory Dataset) and Mapunity speed feeds. Logs provenance metadata (`REAL_OBSERVED`, `REAL_IMPORTED`, `DERIVED_FROM_REAL_DATA`, `SIMULATED`).
- **QUBO & QAOA Signal Optimization**: Formulates signal timing decisions (20s, 30s, 40s green phases) into Quadratic Unconstrained Binary Optimization solved via Qiskit QAOA / local simulator or exact Simulated Annealing fallback.
- **Closed-Loop Control**: Traffic observations generate QUBO; optimization output updates signal controllers; local digital twin simulator evaluates updated network conditions.
- **Emergency Green Corridor**: Uses NetworkX graph shortest paths to compute ambulance ETAs and lock green waves along the route.
- **Incident Management & What-If Simulator**: Real-time accident/closure response and traffic demand surge (+20%, +40%) forecasting.
- **Controller Benchmarking**: Rigorous comparison of Fixed-Time, Adaptive Rule-Based, and Hybrid Quantum-Classical strategies across wait times, queue lengths, throughput, speed, fuel, and CO2 emissions.
- **Data Quality Dashboard**: Tracks valid vs invalid records, missing values, coordinate bounds, and supports custom CSV dataset imports with instant audit reporting.

---

## Technology Stack

- **Backend**: Python 3.13, FastAPI, SQLAlchemy (SQLite), NetworkX, Pandas, NumPy, SciPy, Qiskit, Qiskit Aer.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Leaflet & React-Leaflet, Recharts.

---

## Quick Start

### 1. Install Backend Dependencies
```bash
python -m pip install fastapi uvicorn sqlalchemy pydantic passlib python-jose[cryptography] pandas numpy networkx requests python-multipart scipy qiskit qiskit-aer pytest
```

### 2. Fetch Initial Chennai Datasets & Run Backend Tests
```bash
python backend/scripts/fetch_real_data.py
python -m pytest backend/tests/test_backend.py
```

### 3. Start Application Server
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Open your browser at `http://127.0.0.1:8000` to launch the **Urban Traffic Intelligence & Quantum Optimization Control Center**.
