import React from 'react';
import { Activity, Database, Cpu, Zap, Radio, MapPin, UserCheck, LogOut } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  systemMetrics: any;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, systemMetrics }) => {
  const status = systemMetrics?.system_status || {
    backend: 'ONLINE',
    database: 'CONNECTED',
    data: 'IMPORTED',
    optimizer: 'QAOA / FALLBACK',
    simulation: 'ACTIVE'
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-lg shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            Quantum Adaptive Traffic Digital Twin
            <span className="text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Chennai, India
            </span>
          </h1>
          <p className="text-xs text-slate-400">Urban Traffic Optimization & Quantum Signal Control System</p>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="hidden lg:flex items-center space-x-4 bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-xl text-xs">
        <div className="flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Backend:</span>
          <span className="text-emerald-400 font-medium">{status.backend}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">DB:</span>
          <span className="text-blue-400 font-medium">{status.database}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Data:</span>
          <span className="text-cyan-400 font-medium">{status.data}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">Optimizer:</span>
          <span className="text-purple-400 font-medium">{status.optimizer}</span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-3">
        {user ? (
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              {user.email}
            </span>
            <button
              onClick={onLogout}
              className="text-xs bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 px-3 py-1 rounded-lg flex items-center gap-1 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400">Demo Session Active</div>
        )}
      </div>
    </header>
  );
};
