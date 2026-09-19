import React, { useState } from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [interval, setIntervalVal] = useState('5');
  const [solver, setSolver] = useState('QAOA');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-lg">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Engine Settings</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">Platform Configuration</h2>
        <p className="text-xs text-slate-400">Configure aggregation intervals, QUBO penalty weights, and solver fallback parameters.</p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm">Temporal Processing Settings</h3>

          <div>
            <label className="block text-slate-400 mb-1">Traffic Aggregation Interval</label>
            <select
              value={interval}
              onChange={(e) => setIntervalVal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minutes (Default)</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Optimization Solver Selection</label>
            <select
              value={solver}
              onChange={(e) => setSolver(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            >
              <option value="QAOA">QAOA (Qiskit Aer Simulator with Exact Fallback)</option>
              <option value="QUANTUM_INSPIRED">Quantum-Inspired Simulated Annealing</option>
              <option value="ADAPTIVE">Adaptive Rule-Based Controller</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>

        {saved && (
          <div className="bg-emerald-950 text-emerald-400 border border-emerald-800 p-3 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Settings successfully updated!</span>
          </div>
        )}
      </form>
    </div>
  );
};
