import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

interface MapWidgetProps {
  intersections: any[];
  roads: any[];
  selectedElement?: any;
  activeEmergencyRoute?: any;
  incidents?: any[];
  onSelectNode?: (node: any) => void;
  onSelectRoad?: (road: any) => void;
}

// Custom Incident Marker Icon
const incidentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -34],
  shadowSize: [36, 36]
});

// Custom Ambulance Marker Icon
const ambulanceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [22, 36],
  iconAnchor: [11, 36],
  popupAnchor: [1, -34],
  shadowSize: [36, 36]
});

export const MapWidget: React.FC<MapWidgetProps> = ({
  intersections,
  roads,
  selectedElement,
  activeEmergencyRoute,
  incidents = [],
  onSelectNode,
  onSelectRoad
}) => {
  // Center of Chennai primary traffic corridor (Guindy - Anna Salai)
  const center: [number, number] = [13.0232, 80.2210];

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <MapContainer
        center={center}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#020617' }}
      >
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Render Roads as Polylines with Dynamic Congestion Colors */}
        {roads.map((road) => {
          if (!road.geometry || !road.geometry.coordinates) return null;
          const coords: [number, number][] = road.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]]
          );

          const isSelected = selectedElement && selectedElement.id === road.id;
          const congestion = road.congestion_index ?? 0.35;
          
          let strokeColor = '#10b981'; // Green (low congestion)
          if (congestion >= 0.65) strokeColor = '#ef4444'; // Red (heavy gridlock)
          else if (congestion >= 0.35) strokeColor = '#f59e0b'; // Amber (moderate traffic)

          return (
            <Polyline
              key={road.id}
              positions={coords}
              pathOptions={{
                color: isSelected ? '#38bdf8' : strokeColor,
                weight: isSelected ? 9 : 6,
                opacity: isSelected ? 1.0 : 0.85
              }}
              eventHandlers={{
                click: () => onSelectRoad && onSelectRoad(road)
              }}
            >
              <Popup className="dark-popup">
                <div className="p-2 text-xs space-y-1 font-sans text-slate-100">
                  <div className="font-bold text-sm text-cyan-400">{road.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {road.id}</div>
                  <div className="pt-1 flex items-center justify-between border-t border-slate-700">
                    <span className="text-slate-400">Congestion Index:</span>
                    <span className="font-bold font-mono" style={{ color: strokeColor }}>
                      {Math.round(congestion * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Speed:</span>
                    <span className="font-semibold text-white">{road.average_speed_kmh || 32} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Queue Length:</span>
                    <span className="font-semibold text-white">{road.queue_length_m || 15} m</span>
                  </div>
                  <div className="pt-1">
                    <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {road.provenance || 'REAL_OBSERVED'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Render Signalized Intersections as Circle Markers */}
        {intersections.map((inter) => {
          const isSelected = selectedElement && selectedElement.id === inter.id;
          const greenDuration = inter.green_duration || inter.current_green_duration || 30;

          // Color based on green timing allocation
          let ringColor = '#06b6d4'; // Cyan default (30s)
          if (greenDuration >= 45) ringColor = '#8b5cf6'; // Purple (extended green)
          else if (greenDuration <= 20) ringColor = '#f59e0b'; // Amber (short green)

          return (
            <CircleMarker
              key={inter.id}
              center={[inter.lat, inter.lon]}
              radius={isSelected ? 12 : 9}
              pathOptions={{
                color: isSelected ? '#ffffff' : ringColor,
                fillColor: '#0284c7',
                fillOpacity: 0.95,
                weight: isSelected ? 4 : 2.5
              }}
              eventHandlers={{
                click: () => onSelectNode && onSelectNode(inter)
              }}
            >
              <Popup className="dark-popup">
                <div className="p-2 text-xs space-y-1 font-sans text-slate-100">
                  <div className="font-bold text-sm text-purple-300">{inter.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {inter.id}</div>
                  <div className="pt-1 flex items-center justify-between border-t border-slate-700">
                    <span className="text-slate-400">Green Signal:</span>
                    <span className="font-bold text-purple-400 font-mono">{greenDuration} seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cycle Length:</span>
                    <span className="font-semibold text-white">{inter.cycle_length || 60} s</span>
                  </div>
                  <div className="pt-1">
                    <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px]">
                      {inter.provenance || 'REAL_OBSERVED'}
                    </span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Active Emergency Route Polyline & Marker */}
        {activeEmergencyRoute && activeEmergencyRoute.route_json?.path_intersections && (
          <>
            <Polyline
              positions={intersections
                .filter(i => activeEmergencyRoute.route_json.path_intersections.includes(i.id))
                .map(i => [i.lat, i.lon])}
              pathOptions={{ color: '#3b82f6', weight: 8, dashArray: '8, 8', opacity: 0.9 }}
            />
            {activeEmergencyRoute.origin_lat && (
              <Marker position={[activeEmergencyRoute.origin_lat, activeEmergencyRoute.origin_lon]} icon={ambulanceIcon}>
                <Popup>
                  <div className="p-1 text-xs font-bold text-blue-600">Ambulance Unit ({activeEmergencyRoute.ambulance_id})</div>
                </Popup>
              </Marker>
            )}
          </>
        )}

        {/* Active Incidents Markers */}
        {incidents.map((inc) => (
          <Marker key={inc.id} position={[inc.latitude, inc.longitude]} icon={incidentIcon}>
            <Popup>
              <div className="p-1 text-xs font-bold text-red-600">
                {inc.incident_type} ({inc.severity})
                <div className="text-[10px] text-slate-600 font-normal">{inc.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Operational Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-lg z-[1000] text-[11px] text-slate-300 space-y-1.5">
        <div className="font-bold text-xs text-white border-b border-slate-800 pb-1">Corridor Network Legend</div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-emerald-500 rounded"></span>
          <span>Free Flow Traffic (&lt;35% Congestion)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-amber-500 rounded"></span>
          <span>Moderate Queue (35-65% Congestion)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-red-500 rounded"></span>
          <span>Heavy Congestion (&gt;65% Congestion)</span>
        </div>
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 border border-white"></span>
          <span>Signalized Intersection Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-1 bg-blue-500 border-dashed"></span>
          <span>Emergency Priority Corridor</span>
        </div>
      </div>
    </div>
  );
};
