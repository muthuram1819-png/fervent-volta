import React, { useState, useEffect } from 'react';
import { MapWidget } from '../components/MapWidget';
import { Play, Pause, RotateCcw, FastForward, Cpu, Activity, Info, CheckCircle2, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { fetchApi } from '../api/client';

interface DigitalTwinPageProps {
  networkData: any;
  trafficStates: any[];
  onRefresh: () => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  networkData,
  trafficStates,
  onRefresh
}) => {
  const [digitalTwinState, setDigitalTwinState] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'node' | 'road' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [stepping, setStepping] = useState(false);
  const [optResult, setOptResult] = useState<any>(null);

  const fetchDigitalTwinState = async () => {
    try {
      const data = await fetchApi<any>('/simulation/state');
      setDigitalTwinState(data);
    } catch (e) {
      console.error('Error fetching digital twin state:', e);
    }
  };

  useEffect(() => {
    fetchDigitalTwinState();
  }, []);

  // Auto-stepping simulation loop when Play is toggled
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(async () => {
        try {
          const updated = await fetchApi<any>('/simulation/step?steps=1', { method: 'POST' });
          setDigitalTwinState(updated);
          onRefresh();
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const handleRunOptimization = async () => {
    setOptimizing(true);
    try {
      const res = await fetchApi<any>('/optimization/run', {
        method: 'POST',
        body: JSON.stringify({ method: 'QAOA' })
      });
      setOptResult(res);
      await fetchDigitalTwinState();
      onRefresh();
    } catch (e: any) {
      alert(`Optimization error: ${e.message}`);
    } finally {
      setOptimizing(false);
    }
  };

  const handleStepSimulation = async () => {
    setStepping(true);
    try {
      const updated = await fetchApi<any>('/simulation/step?steps=1', { method: 'POST' });
      setDigitalTwinState(updated);
      onRefresh();
    } catch (e: any) {
      alert(`Simulation error: ${e.message}`);
    } finally {
      setStepping(false);
    }
  };

  const handleResetSimulation = async () => {
    try {
      const resetData = await fetchApi<any>('/simulation/reset', { method: 'POST' });
      setDigitalTwinState(resetData);
      setOptResult(null);
      onRefresh();
    } catch (e: any) {
      alert(`Reset error: ${e.message}`);
    }
  };

  const intersections = digitalTwinState?.intersections || networkData?.intersections || [];
  const roads = digitalTwinState?.roads || networkData?.roads || [];

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col space-y-3 p-4 bg-slate-950 overflow-hidden">
      {/* Top Operational Status & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-extrabold text-white tracking-wide">Live Chennai Traffic Digital Twin</h2>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-400">Anna Salai – Kathipara Corridor • Step #{digitalTwinState?.step_count || 0}</p>
          </div>
        </div>

        {/* Live Network Metrics Summary */}
        <div className="hidden xl:flex items-center space-x-6 text-xs bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Avg Speed</div>
            <div className="font-bold text-cyan-400 text-sm">{digitalTwinState?.average_network_speed_kmh || 31.4} km/h</div>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Avg Queue</div>
            <div className="font-bold text-purple-400 text-sm">{digitalTwinState?.average_queue_length_m || 18.5} m</div>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Congestion Index</div>
            <div className="font-bold text-amber-400 text-sm">{digitalTwinState?.average_congestion_index || 0.35}</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`text-xs font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-lg ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Auto-Loop' : 'Auto Play Simulation'}</span>
          </button>

          <button
            onClick={handleStepSimulation}
            disabled={stepping}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg flex items-center space-x-1.5 transition"
          >
            <FastForward className="w-4 h-4" />
            <span>{stepping ? 'Stepping...' : 'Step +1m'}</span>
          </button>

          <button
            onClick={handleRunOptimization}
            disabled={optimizing}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center space-x-1.5 transition"
          >
            <Cpu className="w-4 h-4" />
            <span>{optimizing ? 'Executing QUBO...' : 'Run QAOA Signal Opt'}</span>
          </button>

          <button
            onClick={handleResetSimulation}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold p-2 rounded-xl border border-slate-700 transition"
            title="Reset Digital Twin State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Context Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1 min-h-0">
        {/* Main Operational Map View */}
        <div className="lg:col-span-3 h-full">
          <MapWidget
            intersections={intersections}
            roads={roads}
            selectedElement={selectedElement}
            onSelectNode={(node) => { setSelectedElement(node); setSelectedType('node'); }}
            onSelectRoad={(road) => { setSelectedElement(road); setSelectedType('road'); }}
          />
        </div>

        {/* Right Sidebar Contextual Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 overflow-y-auto shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Inspector & Intelligence
            </h3>
            <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
              REAL DATA PIPELINE
            </span>
          </div>

          {/* Selected Node or Road Details */}
          {selectedElement ? (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-[10px] text-cyan-400 uppercase font-semibold">
                  Selected {selectedType === 'node' ? 'Intersection' : 'Road Corridor'}
                </div>
                <div className="font-bold text-base text-white">{selectedElement.name || selectedElement.id}</div>
                <div className="text-[10px] text-slate-500 font-mono">ID: {selectedElement.id}</div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                    {selectedElement.provenance || 'REAL_OBSERVED'}
                  </span>
                  {selectedType === 'node' && (
                    <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px] font-mono">
                      {selectedElement.highway_type || 'traffic_signals'}
                    </span>
                  )}
                </div>
              </div>

              {selectedType === 'node' ? (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Current Phase:</span>
                    <span className="font-semibold text-white">{selectedElement.current_phase || 'PHASE_1_MAIN'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Allocated Green:</span>
                    <span className="font-bold text-purple-400 font-mono">
                      {selectedElement.green_duration || selectedElement.current_green_duration || 30} sec
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cycle Length:</span>
                    <span className="font-semibold text-white">{selectedElement.cycle_length || 60} sec</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Congestion Index:</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {Math.round((selectedElement.congestion_index ?? 0.35) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Avg Speed:</span>
                    <span className="font-semibold text-white">{selectedElement.average_speed_kmh || 32} km/h</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                    <span className="text-slate-400">Queue Length:</span>
                    <span className="font-semibold text-white">{selectedElement.queue_length_m || 15} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Length & Lanes:</span>
                    <span className="font-semibold text-white">{selectedElement.length_m}m ({selectedElement.lanes} lanes)</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                Corridor Interactive Guidance
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click any road segment or intersection node on the Chennai map to view live traffic state metrics, green timing allocations, and provenance metadata.
              </p>
            </div>
          )}

          {/* QAOA Optimization Output Notification */}
          {optResult && (
            <div className="bg-purple-950/40 border border-purple-800 p-3.5 rounded-xl text-xs space-y-2 shadow-inner mt-auto">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                QAOA Signal Plan Applied
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{optResult.explanation}</p>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-purple-900/60">
                <span>Runtime: {optResult.runtime_ms} ms</span>
                <span>Obj: {optResult.objective_value}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
