import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AnalyzerDashboard } from './components/AnalyzerDashboard';
import { ExplanationResult } from './components/ExplanationResult';
import { HistoryView } from './components/HistoryView';
import { AdminDashboard } from './components/AdminDashboard';
import { GlossaryModal } from './components/GlossaryModal';
import { AnalysisRecord } from './types';
import { SampleReport } from './data/sampleReports';
import { HeartPulse, ShieldAlert, Heart, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'analyzer' | 'history' | 'admin' | 'glossary'>('landing');
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const [activeSample, setActiveSample] = useState<SampleReport | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  // Load history on mount
  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/history');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHistory(json.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleStartAnalysis = (sample?: SampleReport) => {
    if (sample) {
      setActiveSample(sample);
    } else {
      setActiveSample(null);
    }
    setSelectedRecord(null);
    setCurrentTab('analyzer');
  };

  const handleAnalysisSuccess = (record: AnalysisRecord) => {
    setSelectedRecord(record);
    // Refresh history in background
    fetchHistory();
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
        if (selectedRecord?.id === id) {
          setSelectedRecord(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleSelectHistoryRecord = (record: AnalysisRecord) => {
    setSelectedRecord(record);
  };

  const handleTabChange = (tab: 'landing' | 'analyzer' | 'history' | 'admin' | 'glossary') => {
    if (tab === 'glossary') {
      setIsGlossaryOpen(true);
      return;
    }
    setCurrentTab(tab);
    if (tab === 'analyzer' && !selectedRecord) {
      // keep current state
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* If viewing a specific analysis record result */}
        {selectedRecord ? (
          <ExplanationResult
            record={selectedRecord}
            onBackToAnalyzer={() => setSelectedRecord(null)}
            onAnalyzeAnother={() => {
              setSelectedRecord(null);
              setActiveSample(null);
              setCurrentTab('analyzer');
            }}
          />
        ) : (
          <>
            {currentTab === 'landing' && (
              <LandingPage
                onStartAnalysis={handleStartAnalysis}
                onExploreHistory={() => setCurrentTab('history')}
                onOpenGlossary={() => setIsGlossaryOpen(true)}
              />
            )}

            {currentTab === 'analyzer' && (
              <AnalyzerDashboard
                key={activeSample ? activeSample.id : 'fresh-analyzer'}
                onAnalysisSuccess={handleAnalysisSuccess}
                initialSample={activeSample}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                history={history}
                isLoading={isLoadingHistory}
                onSelectRecord={handleSelectHistoryRecord}
                onDeleteRecord={handleDeleteRecord}
                onRefreshHistory={fetchHistory}
                onNewAnalysis={() => {
                  setSelectedRecord(null);
                  setActiveSample(null);
                  setCurrentTab('analyzer');
                }}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                onSelectRecord={handleSelectHistoryRecord}
                onRefreshStats={fetchHistory}
              />
            )}
          </>
        )}
      </main>

      {/* Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span>MedExplain</span>
              <span className="font-normal text-slate-500 text-xs">
                — AI Healthcare Information Assistant
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button 
                onClick={() => setIsGlossaryOpen(true)} 
                className="hover:text-teal-700 transition-colors"
              >
                Medical Glossary
              </button>
              <button 
                onClick={() => setCurrentTab('admin')} 
                className="hover:text-teal-700 transition-colors"
              >
                System Telemetry
              </button>
              <button 
                onClick={() => setCurrentTab('landing')} 
                className="hover:text-teal-700 transition-colors"
              >
                About & Guardrails
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>
              Educational healthcare tool powered by Gemini 3.8 Flash & SQLite. Does not provide medical diagnoses, treatment advice, or prescriptions.
            </p>
            <div className="flex items-center gap-1 text-slate-500">
              <span>Built for Healthcare Hackathon</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
