import React, { useEffect, useState } from 'react';
import { 
  HeartPulse, 
  FileText, 
  History as HistoryIcon, 
  BarChart3, 
  BookOpen, 
  ShieldCheck, 
  Database,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'analyzer' | 'history' | 'admin' | 'glossary';
  setCurrentTab: (tab: 'landing' | 'analyzer' | 'history' | 'admin' | 'glossary') => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, historyCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') setDbStatus('connected');
        else setDbStatus('error');
      })
      .catch(() => setDbStatus('error'));
  }, []);

  interface NavItem {
    id: 'landing' | 'analyzer' | 'history' | 'admin' | 'glossary';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'landing', label: 'Home', icon: HeartPulse },
    { id: 'analyzer', label: 'Analyze Report', icon: FileText, highlight: true },
    { id: 'history', label: 'History', icon: HistoryIcon, badge: historyCount },
    { id: 'admin', label: 'Demo / Admin', icon: BarChart3 },
    { id: 'glossary', label: 'Glossary', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-slate-900 tracking-tight">MedExplain</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/60">
                  AI Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Plain-Language Medical Reports</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 font-semibold'
                      : item.highlight
                      ? 'text-teal-700 bg-teal-50/80 hover:bg-teal-100 hover:text-teal-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-teal-700 text-white' : 'bg-teal-200 text-teal-900'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200" title="Connected to local SQLite database">
              <Database className="w-3.5 h-3.5 text-teal-600" />
              <span>SQLite</span>
              <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Non-Diagnostic</span>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-teal-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Persistent safety notice micro-bar */}
      <div className="bg-amber-500/10 border-b border-amber-200/50 py-1 px-4 text-center">
        <p className="text-[12px] font-medium text-amber-900 flex items-center justify-center gap-1.5">
          <span className="font-semibold uppercase tracking-wider text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded">Safety Notice</span>
          This tool provides educational explanations only and is not a substitute for professional medical advice.
        </p>
      </div>
    </header>
  );
};
