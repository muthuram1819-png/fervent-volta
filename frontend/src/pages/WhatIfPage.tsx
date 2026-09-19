import React, { useState } from 'react';
import { Sliders, Play, TrendingUp, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchApi } from '../api/client';

export const WhatIfPage: React.FC = () => {
  const [multiplier, setMultiplier] = useState(1.4); // +40% default
  const [hasAccident, setHasAccident] = useState(false);
  const [hasEmergency, setHasEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunScenario = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>(
        `/scenarios/run?traffic_multiplier=${multiplier}&has_accident=${hasAccident}&has_emergency=${hasEmergency}`,
        { method: 'POST' }
      );
      setResult(res);
    } catch (e: any) {
      alert(`Error running scenario: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-lg">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full">
          <Sliders className="w-3.5 h-3.5" />
          <span>Synthetic Stress Testing & Forecasting</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">What-If Traffic Scenario Simulator</h2>
        <p className="text-xs text-slate-400">Scale real baseline traffic demand, overlay incidents, and simulate resulting queue/speed conditions under QUBO optimization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Builder Controls */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="font-bold text-white text-sm">Scenario Configuration</h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Traffic Volume Surge:</span>
                <span className="text-cyan-400 font-bold">+{Math.round((multiplier - 1.0) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Normal Baseline (1.0x)</span>
                <span>Peak Rush (+40%)</span>
                <span>Extreme Gridlock (+100%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">Overlay Accident Obstruction</span>
              <input
                type="checkbox"
                checked={hasAccident}
                onChange={(e) => setHasAccident(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">Simulate Emergency Ambulance Route</span>
              <input
                type="checkbox"
                checked={hasEmergency}
                onChange={(e) => setHasEmergency(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
            </div>

            <button
              onClick={handleRunScenario}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition text-xs flex items-center justify-center space-x-2 shadow-lg"
            >
              <Play className="w-4 h-4" />
              <span>{loading ? 'Simulating Scenario...' : 'Execute What-If Simulation'}</span>
            </button>
          </div>
        </div>

        {/* Results Comparison Cards */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Baseline */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="font-bold text-slate-300 border-b border-slate-800 pb-2">1. Baseline (Real Observed)</div>
                <div className="space-y-1.5">
                  <div className="text-slate-400">Vehicle Count: <span className="font-semibold text-white">{result.baseline.vehicle_count}</span></div>
                  <div className="text-slate-400">Avg Queue: <span className="font-semibold text-white">{result.baseline.average_queue_m} m</span></div>
                  <div className="text-slate-400">Avg Speed: <span className="font-semibold text-white">{result.baseline.average_speed_kmh} km/h</span></div>
                  <div className="text-[10px] text-cyan-400 pt-2 font-mono">Provenance: REAL_OBSERVED</div>
                </div>
              </div>

              {/* Unmitigated Scenario */}
              <div className="bg-red-950/30 border border-red-800/60 p-5 rounded-2xl space-y-3">
                <div className="font-bold text-red-300 border-b border-red-800/60 pb-2">2. Simulated Surge</div>
                <div className="space-y-1.5">
                  <div className="text-slate-400">Vehicle Surge: <span className="font-semibold text-red-300">+{Math.round((multiplier - 1) * 100)}%</span></div>
                  <div className="text-slate-400">Simulated Queue: <span className="font-semibold text-red-400">{result.scenario.simulated_queue_m} m</span></div>
                  <div className="text-slate-400">Simulated Speed: <span className="font-semibold text-red-400">{result.scenario.simulated_speed_kmh} km/h</span></div>
                  <div className="text-[10px] text-red-400 pt-2 font-mono">Provenance: SIMULATED</div>
                </div>
              </div>

              {/* Optimized Scenario */}
              <div className="bg-emerald-950/30 border border-emerald-800/60 p-5 rounded-2xl space-y-3">
                <div className="font-bold text-emerald-300 border-b border-emerald-800/60 pb-2">3. QAOA Optimized</div>
                <div className="space-y-1.5">
                  <div className="text-slate-400">Optimized Queue: <span className="font-bold text-emerald-400">{result.optimized.optimized_queue_m} m</span></div>
                  <div className="text-slate-400">Optimized Speed: <span className="font-bold text-emerald-400">{result.optimized.optimized_speed_kmh} km/h</span></div>
                  <div className="text-emerald-400 font-semibold pt-1">
                    Queue Reduction: -{result.optimized.queue_reduction_pct}%
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono pt-1">Provenance: OPTIMIZED_QUBO</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-xs text-slate-500">
              Adjust scenario sliders and click Execute What-If Simulation to view performance forecast.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
