import os

class Settings:
    PROJECT_NAME: str = "Quantum Adaptive Traffic Digital Twin"
    CITY_NAME: str = "Chennai, Tamil Nadu, India"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "quantum_traffic_chennai_secret_key_2026_super_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    # Database
    BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
    DB_PATH: str = os.path.join(BASE_DIR, "quantum_traffic.db")
    SQLALCHEMY_DATABASE_URL: str = f"sqlite:///{DB_PATH}"

    # Chennai Geofence Bounds
    CHENNAI_LAT_MIN: float = 12.80
    CHENNAI_LAT_MAX: float = 13.30
    CHENNAI_LON_MIN: float = 80.00
    CHENNAI_LON_MAX: float = 80.40

settings = Settings()
