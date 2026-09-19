import React from 'react';
import { Zap, ShieldCheck, Map, Cpu, Siren, Award, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { NavTab } from '../components/Sidebar';

interface LandingPageProps {
  setActiveTab: (tab: NavTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto py-6 px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/60 border border-slate-800 p-8 md:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-950/80 border border-cyan-800 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Chennai Pilot • Anna Salai & Kathipara Junction Corridor</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Quantum-Enhanced Adaptive <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Urban Traffic Digital Twin
            </span>
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed">
            Real-data-driven traffic intelligence platform leveraging hybrid quantum-classical QUBO/QAOA optimization 
            and real public observations to minimize congestion, reduce carbon emissions, and enable emergency green corridors.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab('twin')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-cyan-950 flex items-center space-x-2 transition"
            >
              <span>Launch Control Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('optimizer')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 transition"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Inspect QUBO Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Map className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Real Geographic Network</h3>
          <p className="text-slate-400 text-sm">
            Ingests real OpenStreetMap corridor geometry for Chennai, Tamil Nadu, modeling 6 key signalized intersections and connecting arterial roads.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">QAOA QUBO Optimization</h3>
          <p className="text-slate-400 text-sm">
            Formulates signal timing decisions into Quadratic Unconstrained Binary Optimization (QUBO) executed via Qiskit QAOA and quantum-inspired algorithms.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Transparent Provenance</h3>
          <p className="text-slate-400 text-sm">
            Every record is explicitly categorized into REAL_OBSERVED, REAL_IMPORTED, DERIVED, or SIMULATED with zero synthetic masking.
          </p>
        </div>
      </div>

      {/* Feature Deep Dive */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Core Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Closed-Loop Control Architecture</h4>
              <p className="text-slate-400 text-sm">Traffic observations fuel QUBO matrix construction; optimized signal timings are fed directly back to update local simulation states.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <CheckCircle2 className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Emergency Green Corridors</h4>
              <p className="text-slate-400 text-sm">Uses NetworkX shortest path graph algorithms to calculate ambulance arrival times and lock green signal waves ahead of emergency transit.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <CheckCircle2 className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">What-If Scenario Modeling</h4>
              <p className="text-slate-400 text-sm">Simulate peak-hour traffic multipliers (+20%, +40%), road closures, and accidents against real baseline observations.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Benchmarking & Environmental Metrics</h4>
              <p className="text-slate-400 text-sm">Evaluates Fixed-Time, Adaptive Rule-Based, and Hybrid Quantum-Classical strategies across throughput, delay, fuel, and CO2 emissions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
