import React from 'react';
import { 
  Home, Map, BarChart2, Cpu, Siren, AlertTriangle, 
  Sliders, Award, Database, Settings
} from 'lucide-react';

export type NavTab = 
  | 'landing'
  | 'twin' 
  | 'analytics' 
  | 'optimizer' 
  | 'emergency' 
  | 'incidents' 
  | 'whatif' 
  | 'benchmarks' 
  | 'datasources' 
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'twin', label: 'Live Digital Twin', icon: Map },
    { id: 'analytics', label: 'Traffic Analytics', icon: BarChart2 },
    { id: 'optimizer', label: 'Quantum Optimizer', icon: Cpu },
    { id: 'emergency', label: 'Emergency Corridor', icon: Siren },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'whatif', label: 'What-If Simulator', icon: Sliders },
    { id: 'benchmarks', label: 'Benchmarks', icon: Award },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px]">
      <div className="p-4 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Control Center
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavTab)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">Chennai Corridor MVP</div>
          <div>Anna Salai - Kathipara Junction - Guindy</div>
          <div className="text-[10px] text-cyan-500 pt-1">Real Data Pipeline Active</div>
        </div>
      </div>
    </aside>
  );
};
