import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { QuantumOptimizerPage } from './pages/QuantumOptimizerPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { BenchmarkPage } from './pages/BenchmarkPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';
import { fetchApi } from './api/client';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('landing');
  const [user, setUser] = useState<any>(null);
  const [networkData, setNetworkData] = useState<{ intersections: any[]; roads: any[] }>({ intersections: [], roads: [] });
  const [trafficStates, setTrafficStates] = useState<any[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);

  const loadAllData = async () => {
    try {
      const [intersections, roads, states, metrics] = await Promise.all([
        fetchApi<any[]>('/network/intersections').catch(() => []),
        fetchApi<any[]>('/network/roads').catch(() => []),
        fetchApi<any[]>('/traffic/states').catch(() => []),
        fetchApi<any>('/metrics').catch(() => null)
      ]);

      setNetworkData({ intersections, roads });
      setTrafficStates(states);
      setSystemMetrics(metrics);
    } catch (e) {
      console.error('Error loading data:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'twin':
        return (
          <DigitalTwinPage
            networkData={networkData}
            trafficStates={trafficStates}
            onRefresh={loadAllData}
          />
        );
      case 'analytics':
        return <AnalyticsPage trafficStates={trafficStates} />;
      case 'optimizer':
        return (
          <QuantumOptimizerPage
            networkData={networkData}
            onRefresh={loadAllData}
          />
        );
      case 'emergency':
        return (
          <EmergencyPage
            intersections={networkData.intersections}
            onRefresh={loadAllData}
          />
        );
      case 'incidents':
        return (
          <IncidentsPage
            roads={networkData.roads}
            intersections={networkData.intersections}
            onRefresh={loadAllData}
          />
        );
      case 'whatif':
        return <WhatIfPage />;
      case 'benchmarks':
        return <BenchmarkPage />;
      case 'datasources':
        return <DataSourcesPage onRefresh={loadAllData} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LandingPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        user={user}
        onLogout={() => { setUser(null); localStorage.removeItem('token'); }}
        systemMetrics={systemMetrics}
      />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-61px)]">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;
