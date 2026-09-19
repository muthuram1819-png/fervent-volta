# SETUP & DEPLOYMENT GUIDE

## System Requirements

- **Operating System**: Windows / Linux / macOS
- **Python**: 3.10+ (Tested on Python 3.13)
- **Node.js**: v18+ (Tested on Node.js v24 LTS)
- **Database**: SQLite3 (automatically created locally)

---

## Installation Steps

### 1. Environment Preparation
```bash
git clone <repository_url>
cd ferven-volta
```

### 2. Backend Setup
```bash
# Install Python packages
python -m pip install fastapi uvicorn sqlalchemy pydantic passlib python-jose[cryptography] pandas numpy networkx requests python-multipart scipy qiskit qiskit-aer pytest

# Ingest initial Chennai OSM network & trajectory datasets
python backend/scripts/fetch_real_data.py
```

### 3. Frontend Build (Optional for Development)
```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Running the Application
```bash
# Start backend API (serves built frontend on http://127.0.0.1:8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 5. Running Automated Test Suite
```bash
python -m pytest backend/tests/test_backend.py
```
