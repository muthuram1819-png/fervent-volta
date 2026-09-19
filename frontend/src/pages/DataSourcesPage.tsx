import React, { useState, useEffect } from 'react';
import { Database, Upload, CheckCircle2, ShieldCheck, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { fetchApi } from '../api/client';

interface DataSourcesPageProps {
  onRefresh: () => void;
}

export const DataSourcesPage: React.FC<DataSourcesPageProps> = ({ onRefresh }) => {
  const [sources, setSources] = useState<any[]>([]);
  const [quality, setQuality] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [adapterType, setAdapterType] = useState('generic');
  const [uploading, setUploading] = useState(false);
  const [uploadReport, setUploadReport] = useState<any>(null);

  const loadData = async () => {
    try {
      const [srcData, qualData] = await Promise.all([
        fetchApi<any[]>('/data/sources'),
        fetchApi<any>('/data/quality')
      ]);
      setSources(srcData);
      setQuality(qualData);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('adapter_type', adapterType);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/data/import', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json();
      setUploadReport(data.validation_report);
      loadData();
      onRefresh();
    } catch (e: any) {
      alert(`Upload error: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2 shadow-lg">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full">
          <Database className="w-3.5 h-3.5" />
          <span>Real Public Data & Provenance Audit</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">Data Sources & Provenance Registry</h2>
        <p className="text-xs text-slate-400">Strict transparency tracking for every imported Chennai traffic observation, road network, and GIS dataset.</p>
      </div>

      {/* Quality Summary Scorecard */}
      {quality && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="text-slate-400">Total Datasets</div>
            <div className="text-xl font-bold text-white mt-1">{quality.total_datasets}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="text-slate-400">Total Observations</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">{quality.total_records}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="text-slate-400">Valid Records</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{quality.valid_records}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="text-slate-400">Coordinate Errors</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{quality.coordinate_errors}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="text-slate-400">Data Quality Score</div>
            <div className="text-xl font-bold text-purple-400 mt-1">{quality.data_quality_score_pct}%</div>
          </div>
        </div>
      )}

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dataset Cards */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm">Active Chennai Public Datasets</h3>
          
          {sources.map((src) => (
            <div key={src.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{src.source_name}</div>
                  <div className="text-xs text-slate-400">{src.dataset_name}</div>
                </div>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  {src.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>License: <span className="text-slate-400">{src.license}</span></div>
                <div>Coverage: <span className="text-slate-400">{src.coverage_area}</span></div>
                <div>Format: <span className="text-slate-400">{src.data_type}</span></div>
                <div>Provenance: <span className="text-cyan-400 font-mono text-[10px]">REAL_OBSERVED</span></div>
              </div>

              {src.source_url && (
                <a
                  href={src.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 pt-1"
                >
                  <span>Visit Data Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Upload Form & Validation Inspector */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            Import Public Dataset (CSV / JSON)
          </h3>

          <form onSubmit={handleUpload} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Select Data Adapter</label>
              <select
                value={adapterType}
                onChange={(e) => setAdapterType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              >
                <option value="spt">Chennai SPT Drone Trajectory Adapter</option>
                <option value="mapunity">Mapunity Chennai Speed API Adapter</option>
                <option value="osm">OpenStreetMap Road Network Adapter</option>
                <option value="gcc">Greater Chennai Corporation (GCC) Adapter</option>
                <option value="generic">Generic CSV / JSON Adapter</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Choose CSV or JSON File</label>
              <input
                type="file"
                accept=".csv,.json"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Validating & Importing...' : 'Upload & Audit Dataset'}</span>
            </button>
          </form>

          {uploadReport && (
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Validation Audit Report
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>Total Records: {uploadReport.total_records}</div>
                <div>Valid Records: {uploadReport.valid_records}</div>
                <div>Missing Values: {uploadReport.missing_values_count}</div>
                <div>Coord Errors: {uploadReport.coordinate_errors_count}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
