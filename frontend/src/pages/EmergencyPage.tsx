import React, { useState } from 'react';
import { Siren, Navigation, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { fetchApi } from '../api/client';

interface EmergencyPageProps {
  intersections: any[];
  onRefresh: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ intersections, onRefresh }) => {
  const [origin, setOrigin] = useState(intersections[0]?.id || 'INT_1001');
  const [dest, setDest] = useState(intersections[intersections.length - 1]?.id || 'INT_1006');
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<any>(null);

  const handleCreateCorridor = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/emergency/create', {
        method: 'POST',
        body: JSON.stringify({
          ambulance_id: 'AMB_TN01_999',
          origin_intersection_id: origin,
          destination_intersection_id: dest
        })
      });
      setScenario(res);
      onRefresh();
    } catch (e: any) {
      alert(`Error creating emergency corridor: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-blue-800 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-950 border border-blue-800 px-3 py-1 rounded-full">
          <Siren className="w-3.5 h-3.5 text-blue-400" />
          <span>Emergency Signal Priority & Routing</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">Emergency Green Corridor Controller</h2>
        <p className="text-xs text-slate-300">Dynamically routes ambulances across Chennai network using NetworkX graph shortest paths and enforces continuous green priority waves.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-400" />
            Dispatch Ambulance Scenario
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Ambulance Unit ID</label>
              <input
                type="text"
                disabled
                value="AMB_TN01_999 (Apollo Emergency, Greams Rd)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Origin Intersection</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-600"
              >
                {intersections.map(i => (
                  <option key={i.id} value={i.id}>{i.name} ({i.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Destination Hospital Intersection</label>
              <select
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-blue-600"
              >
                {intersections.map(i => (
                  <option key={i.id} value={i.id}>{i.name} ({i.id})</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCreateCorridor}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition text-xs flex items-center justify-center space-x-2 shadow-lg"
            >
              <Siren className="w-4 h-4" />
              <span>{loading ? 'Activating Green Wave...' : 'Activate Green Corridor'}</span>
            </button>
          </div>
        </div>

        {/* Live Active Scenario Details */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Active Corridor Status & Timeline
          </h3>

          {scenario ? (
            <div className="space-y-6">
              {/* ETA Metrics */}
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Baseline Travel Time</div>
                  <div className="text-lg font-bold text-slate-400 mt-1">{scenario.baseline_travel_time_sec} s</div>
                </div>
                <div className="bg-blue-950/60 p-4 rounded-xl border border-blue-800">
                  <div className="text-blue-300 font-semibold">Green Corridor ETA</div>
                  <div className="text-xl font-extrabold text-blue-400 mt-1">{scenario.eta_seconds} s</div>
                </div>
                <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-800">
                  <div className="text-emerald-300 font-semibold">Time Saved</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-1">
                    {Math.round(((scenario.baseline_travel_time_sec - scenario.eta_seconds) / scenario.baseline_travel_time_sec) * 100)}%
                  </div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Corridor Activation Timeline</div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-blue-800 flex flex-col justify-between space-y-2">
                    <span className="text-blue-400 font-bold">1. Detected</span>
                    <span className="text-slate-400 text-[11px]">Ambulance dispatch registered</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-blue-800 flex flex-col justify-between space-y-2">
                    <span className="text-blue-400 font-bold">2. Path Calculated</span>
                    <span className="text-slate-400 text-[11px]">NetworkX shortest path computed</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-blue-800 flex flex-col justify-between space-y-2">
                    <span className="text-blue-400 font-bold">3. Priority Locked</span>
                    <span className="text-slate-400 text-[11px]">50s green priority allocated</span>
                  </div>
                  <div className="bg-emerald-950 p-3 rounded-xl border border-emerald-800 flex flex-col justify-between space-y-2">
                    <span className="text-emerald-400 font-bold">4. Green Wave Active</span>
                    <span className="text-slate-300 text-[11px]">Ambulance in transit</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 text-center py-12">
              No active emergency corridor. Select origin & hospital destination to trigger priority green corridor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
