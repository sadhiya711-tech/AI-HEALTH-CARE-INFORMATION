import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  FileText, 
  Database, 
  Layers, 
  Languages, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { AnalysisRecord } from '../types';

interface HistoryViewProps {
  history: AnalysisRecord[];
  isLoading: boolean;
  onSelectRecord: (record: AnalysisRecord) => void;
  onDeleteRecord: (id: string) => void;
  onRefreshHistory: () => void;
  onNewAnalysis: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  isLoading,
  onSelectRecord,
  onDeleteRecord,
  onRefreshHistory,
  onNewAnalysis
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = Array.from(new Set(history.map(item => item.category))).filter(Boolean);

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.simple_explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medical_terms.some(t => t.term.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200/60">
            <Database className="w-3.5 h-3.5 text-teal-600" />
            <span>SQLite Persistent Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Analysis History
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Access your previously simplified medical reports, terms, and customized doctor checklists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefreshHistory}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNewAnalysis}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by report title, findings, or medical terms..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200/50 outline-hidden transition-all"
          />
        </div>

        <div className="sm:w-56">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:border-teal-500 outline-hidden"
          >
            <option value="all">All Categories ({history.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records List */}
      {isLoading && history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm text-slate-600">Loading saved analyses from SQLite...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No analyses found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your search query or filter criteria.'
                : 'You have not analyzed any medical reports yet. Try our preset samples or analyze your own document!'}
            </p>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
          >
            Analyze First Report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((record) => {
            const dateObj = new Date(record.created_at);
            const dateStr = dateObj.toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
            const timeStr = dateObj.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });

            return (
              <div
                key={record.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                      {record.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{record.explanation_level === 'simple' ? 'Simple' : 'Detailed'}</span>
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Languages className="w-3 h-3" />
                      <span>{record.language}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr} at {timeStr}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete analysis record "${record.title}"?`)) {
                          onDeleteRecord(record.id);
                        }
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete record from SQLite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div 
                  onClick={() => onSelectRecord(record)}
                  className="cursor-pointer space-y-2"
                >
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {record.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {record.simple_explanation}
                  </p>
                </div>

                {/* Terms pills preview */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-slate-400">Terms decoded:</span>
                    {record.medical_terms.slice(0, 4).map((t, idx) => (
                      <span 
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                      >
                        {t.term}
                      </span>
                    ))}
                    {record.medical_terms.length > 4 && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        +{record.medical_terms.length - 4} more
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectRecord(record)}
                    className="text-xs font-semibold text-teal-600 group-hover:text-teal-700 flex items-center gap-1"
                  >
                    <span>View Explanation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
