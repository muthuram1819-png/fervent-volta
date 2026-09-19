# DATA DICTIONARY

## Common Internal Normalized Traffic Schema

| Field Name | Data Type | Description | Source Availability |
|------------|-----------|-------------|---------------------|
| `timestamp` | Float / Timestamp | Unix epoch timestamp in seconds | Available in SPT & Mapunity |
| `vehicle_id` | String | Unique vehicle registration identifier (e.g., TN01_V_0042) | Available in SPT Drone dataset; NULL in Mapunity aggregate feeds |
| `vehicle_type` | String | Vehicle classification (`car`, `bus`, `two_wheeler`, `auto_rickshaw`, `truck`, `ambulance`) | Available in SPT Drone dataset |
| `latitude` | Float | Geographic WGS84 latitude coordinate | Available in SPT & OSM |
| `longitude` | Float | Geographic WGS84 longitude coordinate | Available in SPT & OSM |
| `speed_kmh` | Float | Instantaneous or average vehicle speed in km/h | Available in SPT & Mapunity |
| `acceleration_m_s2` | Float | Longitudinal vehicle acceleration in m/s^2 | Available in SPT Drone dataset |
| `road_id` | String | Internal identifier of road segment (e.g. RD_2001) | Mapped from OSM / GIS |
| `intersection_id` | String | Internal identifier of signalized intersection (e.g. INT_1001) | Mapped from OSM / GIS |
| `direction` | String | Directional heading (`NORTHBOUND`, `SOUTHBOUND`, `EASTBOUND`, `WESTBOUND`) | Derived from trajectory vectors |
| `source` | String | Source dataset name tag | Set during ingestion |
