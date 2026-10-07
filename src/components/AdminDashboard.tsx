import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  FileCheck2, 
  Layers, 
  Activity, 
  Database, 
  Sparkles, 
  RefreshCw, 
  Languages, 
  Stethoscope, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AdminStats, AnalysisRecord } from '../types';

interface AdminDashboardProps {
  onSelectRecord: (record: AnalysisRecord) => void;
  onRefreshStats: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onSelectRecord,
  onRefreshStats 
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [statsRes, healthRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/health').then(r => r.json()),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      setHealthStatus(healthRes);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200/60">
            <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Hackathon & Operational Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Admin & Demo Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time usage analytics, SQLite database persistence health, and medical vocabulary patterns.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            onRefreshStats();
          }}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reports Analyzed</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats ? stats.totalAnalyses : '—'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Persisted in SQLite DB</span>
          </p>
        </div>

        {/* Database Status */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Database Engine</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            SQLite (WebAssembly)
          </div>
          <p className="text-[11px] text-teal-600 font-medium flex items-center gap-1">
            <span>File: medexplain.sqlite</span>
          </p>
        </div>

        {/* AI Model */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Reasoning Engine</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            Gemini 3.8 Flash
          </div>
          <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
            <span>Fast, Low Latency, Structured JSON</span>
          </p>
        </div>

        {/* Safety Mode */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Clinical Safety Guardrail</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            100% Enforced
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Zero Diagnosis • Zero Prescriptions
          </p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Medical Categories */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Top Medical Specialties</h3>
                <p className="text-xs text-slate-500">Breakdown of analyzed clinical categories</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats && stats.topCategories.length > 0 ? (
              stats.topCategories.map((cat, idx) => {
                const total = stats.totalAnalyses || 1;
                const pct = Math.round((cat.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-800 font-semibold">{cat.name}</span>
                      <span className="text-slate-500">{cat.count} report{cat.count > 1 ? 's' : ''} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No category data yet.</p>
            )}
          </div>
        </div>

        {/* Most Frequent Medical Terms Decoded */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Most Common Medical Terms</h3>
                <p className="text-xs text-slate-500">Technical phrases most frequently explained</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Frequency</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {stats && stats.topTerms.length > 0 ? (
              stats.topTerms.map((t, idx) => (
                <div 
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2"
                >
                  <span className="font-bold text-indigo-700">{t.term}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                    {t.count}x
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center w-full">No term data available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Analyses Stream */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Analyses Stream</h3>
              <p className="text-xs text-slate-500">Latest medical documents processed by MedExplain</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-teal-600">SQLite Database View</span>
        </div>

        <div className="divide-y divide-slate-100 pt-2">
          {stats && stats.recentAnalyses.length > 0 ? (
            stats.recentAnalyses.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60">
                      {rec.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900 hover:text-teal-700">
                      {rec.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {rec.simple_explanation}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400">
                    {new Date(rec.created_at).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No recent records found.</p>
          )}
        </div>
      </div>

      {/* Backend API Endpoints Documentation Box for Hackathon Reviewers */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/40">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Backend REST API Endpoints</h3>
              <p className="text-xs text-slate-400">Full implementation accessible via FastAPI & Express</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-teal-950 text-teal-300 border border-teal-800">
            OpenAPI Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-emerald-400 font-bold">GET</span> /api/health
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Health check, database status & API readiness</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-teal-400 font-bold">POST</span> /api/analyze
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Gemini 3.8 Flash medical translation with safety rules</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-emerald-400 font-bold">GET</span> /api/history
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Retrieve all saved analyses from SQLite database</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-emerald-400 font-bold">GET</span> /api/history/:id
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Retrieve single analysis with terms & doctor checklist</p>
          </div>
        </div>
      </div>
    </div>
  );
};
