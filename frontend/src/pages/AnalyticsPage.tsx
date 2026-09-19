import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { BarChart2, Filter, Clock } from 'lucide-react';

interface AnalyticsPageProps {
  trafficStates: any[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ trafficStates }) => {
  const chartData = trafficStates.map((s, idx) => ({
    time: `t+${idx * 5}m`,
    road: s.road_id,
    speed: s.average_speed_kmh,
    flow: s.traffic_flow_vph,
    queue: s.queue_length_m,
    congestion: Math.round(s.congestion_index * 100)
  }));

  const mockHourly = [
    { hour: '06:00 (Morning)', volume: 450, speed: 42 },
    { hour: '08:00 (Peak)', volume: 1280, speed: 18 },
    { hour: '11:00 (Midday)', volume: 720, speed: 34 },
    { hour: '14:00 (Midday)', volume: 680, speed: 36 },
    { hour: '17:00 (Evening Peak)', volume: 1420, speed: 15 },
    { hour: '20:00 (Night)', volume: 510, speed: 45 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            Traffic Analytics & Metrics
          </h2>
          <p className="text-xs text-slate-400">Aggregated real traffic observation time-series for Chennai network</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Interval:</span>
            <select className="bg-transparent text-cyan-400 font-semibold focus:outline-none">
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed & Flow Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Corridor Speed vs Traffic Flow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length ? chartData : mockHourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Area type="monotone" dataKey="speed" stroke="#06b6d4" fill="#0891b2" fillOpacity={0.3} name="Speed (km/h)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Volume Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Time-of-Day Traffic Volume (Chennai)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockHourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="volume" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Vehicle Volume (vph)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
