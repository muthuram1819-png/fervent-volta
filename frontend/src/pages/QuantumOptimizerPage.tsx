import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { fetchApi } from '../api/client';

interface QuantumOptimizerPageProps {
  networkData: any;
  onRefresh: () => void;
}

export const QuantumOptimizerPage: React.FC<QuantumOptimizerPageProps> = ({ networkData, onRefresh }) => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunOpt = async (method: string) => {
    setRunning(true);
    try {
      const res = await fetchApi<any>('/optimization/run', {
        method: 'POST',
        body: JSON.stringify({ method })
      });
      setResult(res);
      onRefresh();
    } catch (e: any) {
      alert(`Optimization Error: ${e.message}`);
    } finally {
      setRunning(false);
    }
  };

  const intersections = networkData?.intersections || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 p-6 rounded-3xl border border-purple-800/60 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-950 border border-purple-800 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hybrid Quantum-Classical Optimization</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">QAOA & QUBO Signal Optimization Engine</h2>
          <p className="text-xs text-slate-300">Minimizes corridor delay and queue buildup across Chennai intersections using binary decision variables.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleRunOpt('QAOA')}
            disabled={running}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 transition text-xs"
          >
            <Cpu className="w-4 h-4" />
            <span>{running ? 'Solving QUBO...' : 'Execute QAOA Solver'}</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="bg-slate-900 border border-purple-800/60 p-6 rounded-2xl space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              Optimization Solution Output
            </h3>
            <span className="text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-lg">
              {result.solver_name}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400">Status</div>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">{result.status}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400">Objective Value</div>
              <div className="font-bold text-purple-400 text-sm mt-0.5">{result.objective_value}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400">QUBO Variables</div>
              <div className="font-bold text-cyan-400 text-sm mt-0.5">{result.qubo_size} variables</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400">Runtime</div>
              <div className="font-bold text-slate-200 text-sm mt-0.5">{result.runtime_ms} ms</div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-semibold text-xs text-purple-300">Why was this plan selected?</div>
            <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>
          </div>
        </div>
      )}

      {/* Signal Plan Before vs After Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Chennai Intersections Signal Plan Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Intersection Node</th>
                <th className="p-3">Baseline Fixed-Time</th>
                <th className="p-3">QUBO / QAOA Optimized Green</th>
                <th className="p-3">Allocation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {intersections.map((inter: any) => {
                const optGreen = result?.signal_plan_json?.[inter.id] || inter.current_green_duration || 30;
                return (
                  <tr key={inter.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">
                      {inter.name}
                      <span className="block text-[10px] text-slate-500 font-mono">{inter.id}</span>
                    </td>
                    <td className="p-3 text-slate-400">30 seconds</td>
                    <td className="p-3 font-bold text-purple-400">{optGreen} seconds</td>
                    <td className="p-3 text-slate-400">
                      {optGreen > 30 ? 'Extended green phase due to high directional queue demand' : 'Reduced green phase to prevent cross-street starvation'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
