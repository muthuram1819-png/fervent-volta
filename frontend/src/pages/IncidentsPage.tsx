import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, CheckCircle, Flame, ShieldAlert } from 'lucide-react';
import { fetchApi } from '../api/client';

interface IncidentsPageProps {
  roads: any[];
  intersections: any[];
  onRefresh: () => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({ roads, intersections, onRefresh }) => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [incidentType, setIncidentType] = useState('ACCIDENT');
  const [selectedRoad, setSelectedRoad] = useState(roads[0]?.id || 'RD_2001');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const loadIncidents = async () => {
    try {
      const data = await fetchApi<any[]>('/incidents');
      setIncidents(data);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreateIncident = async () => {
    setLoading(true);
    try {
      await fetchApi<any>('/incidents', {
        method: 'POST',
        body: JSON.stringify({
          incident_type: incidentType,
          road_id: selectedRoad,
          latitude: 13.0105,
          longitude: 80.2115,
          severity,
          description: description || `${incidentType} reported on ${selectedRoad} in Chennai`
        })
      });
      loadIncidents();
      onRefresh();
      setDescription('');
    } catch (e: any) {
      alert(`Error creating incident: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await fetchApi<any>(`/incidents/${id}/resolve`, { method: 'POST' });
      loadIncidents();
      onRefresh();
    } catch (e: any) {
      alert(`Error resolving incident: ${e.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-lg">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Real-time Incident & Blockage Response</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">Incident & Road Obstruction Manager</h2>
        <p className="text-xs text-slate-400">Report accidents, road closures, and congestion spikes. System dynamically updates graph edge weights and re-optimizes signal timing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Incident Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            Report New Incident
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              >
                <option value="ACCIDENT">ACCIDENT</option>
                <option value="ROAD_CLOSURE">ROAD CLOSURE</option>
                <option value="CONGESTION_SPIKE">CONGESTION SPIKE</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Affected Chennai Road Segment</label>
              <select
                value={selectedRoad}
                onChange={(e) => setSelectedRoad(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              >
                {roads.map(r => (
                  <option key={r.id} value={r.id}>{r.road_name} ({r.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Description / Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Bus breakdown on Anna Salai causing lane reduction"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              />
            </div>

            <button
              onClick={handleCreateIncident}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Register Incident'}</span>
            </button>
          </div>
        </div>

        {/* Active Incidents Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Active Incident Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location / Road</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-amber-400">{inc.incident_type}</td>
                    <td className="p-3 text-slate-200">{inc.road_id || 'Anna Salai'}</td>
                    <td className="p-3">
                      <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[10px]">
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${inc.status === 'ACTIVE' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {inc.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleResolve(inc.id)}
                          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded text-[10px] transition"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No active traffic incidents reported on the corridor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
