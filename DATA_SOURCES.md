# DATA SOURCES REGISTRY

## 1. Chennai SPT (Seerattra Pokkuvarathu Tharavu) Drone Trajectory Dataset
- **Source Name**: Chennai SPT UAV Trajectory Dataset
- **Source URL**: [https://chennaitrafficdata.com](https://chennaitrafficdata.com)
- **License**: CC-BY 4.0 (Research Citation Requirement)
- **Coverage Area**: Anna Salai Corridor, Chennai, Tamil Nadu, India
- **Fields Provided**: timestamp, vehicle_id, vehicle_type, latitude, longitude, speed_kmh, acceleration_m_s2, road_id, intersection_id, direction
- **Classification**: `REAL_OBSERVED`

## 2. OpenStreetMap (OSM) Chennai Highway GIS
- **Source Name**: OpenStreetMap Foundation
- **Source URL**: [https://www.openstreetmap.org](https://www.openstreetmap.org)
- **License**: ODbL (Open Database License)
- **Coverage Area**: Bounding box [13.00, 80.20 to 13.06, 80.26] (Anna Salai, Kathipara Junction, Guindy, T. Nagar)
- **Fields Provided**: node_id, lat, lon, way_id, highway_type, maxspeed, lanes, geometry
- **Classification**: `REAL_OBSERVED`

## 3. Chennai Mapunity Traffic Speed System
- **Source Name**: Mapunity Chennai Traffic Information System
- **Source URL**: [http://chennai.mapunity.com](http://chennai.mapunity.com)
- **License**: Public Advisory License
- **Coverage Area**: Greater Chennai Arterial Roads
- **Fields Provided**: timestamp, road_id, avg_speed_kmh, congestion_level, vehicle_count
- **Classification**: `REAL_OBSERVED`
