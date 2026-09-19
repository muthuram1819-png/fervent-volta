import React, { useState, useEffect } from 'react';
import { Award, Download, Play, BarChart2, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchApi } from '../api/client';

export const BenchmarkPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const loadLatestBenchmark = async () => {
    try {
      const res = await fetchApi<any>('/benchmark/latest');
      setData(res);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLatestBenchmark();
  }, []);

  const handleRunBenchmark = async () => {
    setLoading(true);
    try {
      const res = await fetchApi<any>('/benchmark/run', {
        method: 'POST',
        body: JSON.stringify({ scenario_name: 'Chennai Peak Hour Corridor Benchmark' })
      });
      setData(res);
    } catch (e: any) {
      alert(`Error running benchmark: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!data?.results) return;
    const headers = "Controller Method,Avg Waiting Time (s),Max Queue (m),Throughput (vph),Avg Speed (km/h),Emergency ETA (s),Fuel (L),CO2 (kg),Runtime (ms)\n";
    const rows = data.results.map((r: any) => 
      `"${r.controller_method}",${r.avg_waiting_time_sec},${r.max_queue_length_m},${r.throughput_vph},${r.avg_speed_kmh},${r.emergency_travel_time_sec},${r.fuel_estimate_liters},${r.co2_estimate_kg},${r.optimization_runtime_ms}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chennai_traffic_benchmark_results.csv';
    a.click();
  };

  const results = data?.results || [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 bg-purple-950 border border-purple-800 px-3 py-1 rounded-full mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Rigorous Controller Comparison Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Signal Controller Benchmarking Suite</h2>
          <p className="text-xs text-slate-400">Compares Fixed-Time, Adaptive Rule-Based, and Hybrid Quantum-Classical controllers under identical traffic scenarios.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            disabled={!results.length}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleRunBenchmark}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition"
          >
            <Play className="w-4 h-4" />
            <span>{loading ? 'Executing Benchmarks...' : 'Re-run Benchmark Suite'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Controller Performance Comparison</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Controller Strategy</th>
                <th className="p-3">Avg Wait Time (s)</th>
                <th className="p-3">Max Queue (m)</th>
                <th className="p-3">Throughput (vph)</th>
                <th className="p-3">Avg Speed (km/h)</th>
                <th className="p-3">Emergency ETA (s)</th>
                <th className="p-3">Fuel (L)</th>
                <th className="p-3">CO2 (kg)</th>
                <th className="p-3">Runtime (ms)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results.map((r: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    {r.controller_method}
                    {r.controller_method.includes('Quantum') && (
                      <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[9px] px-1.5 py-0.5 rounded">
                        QUBO/QAOA
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-cyan-400">{r.avg_waiting_time_sec}s</td>
                  <td className="p-3 text-slate-300">{r.max_queue_length_m}m</td>
                  <td className="p-3 font-semibold text-emerald-400">{r.throughput_vph} vph</td>
                  <td className="p-3 text-slate-300">{r.avg_speed_kmh} km/h</td>
                  <td className="p-3 font-semibold text-blue-400">{r.emergency_travel_time_sec}s</td>
                  <td className="p-3 text-slate-400">{r.fuel_estimate_liters} L</td>
                  <td className="p-3 text-slate-400">{r.co2_estimate_kg} kg</td>
                  <td className="p-3 font-mono text-purple-400">{r.optimization_runtime_ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphical Benchmark Visualization */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-white text-sm">Waiting Time & Throughput Visual Benchmark</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="controller_method" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              <Legend />
              <Bar dataKey="avg_waiting_time_sec" fill="#06b6d4" name="Avg Waiting Time (sec)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="throughput_vph" fill="#8b5cf6" name="Throughput (vph)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
