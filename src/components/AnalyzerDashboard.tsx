import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Layers, 
  Languages, 
  AlertCircle, 
  X, 
  FileCheck, 
  RefreshCw,
  ShieldCheck,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_REPORTS, SampleReport } from '../data/sampleReports';
import { AnalysisRecord } from '../types';

interface AnalyzerDashboardProps {
  onAnalysisSuccess: (record: AnalysisRecord) => void;
  initialText?: string;
  initialSample?: SampleReport | null;
}

const SUPPORTED_LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Spanish', label: 'Español (Spanish)' },
  { code: 'French', label: 'Français (French)' },
  { code: 'German', label: 'Deutsch (German)' },
  { code: 'Hindi', label: 'हिन्दी (Hindi)' },
  { code: 'Arabic', label: 'العربية (Arabic)' },
  { code: 'Chinese (Simplified)', label: '中文 (Simplified Chinese)' },
  { code: 'Portuguese', label: 'Português (Portuguese)' },
  { code: 'Bengali', label: 'বাংলা (Bengali)' },
  { code: 'Russian', label: 'Русский (Russian)' },
];

export const AnalyzerDashboard: React.FC<AnalyzerDashboardProps> = ({ 
  onAnalysisSuccess,
  initialText = '',
  initialSample = null
}) => {
  const [inputText, setInputText] = useState(initialText || initialSample?.text || '');
  const [selectedLevel, setSelectedLevel] = useState<'simple' | 'detailed'>('simple');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSample = (sample: SampleReport) => {
    setInputText(sample.text);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setInputText('');
    setErrorMessage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setInputText(content);
          setErrorMessage(null);
        }
      };
      reader.readAsText(file);
    } else {
      // For images or PDFs in simple prototype, read text or notify
      setErrorMessage('Please upload a plain text file (.txt) or copy and paste the report contents directly into the box.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        setErrorMessage(null);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMessage('Please enter or paste medical text to analyze.');
      return;
    }
    if (inputText.trim().length < 15) {
      setErrorMessage('The text is too brief. Please enter a full medical report, lab result, or prescription notes.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Reviewing clinical terminology & test markers...');

    // Progress step updates
    const timer1 = setTimeout(() => {
      setLoadingStep('Translating technical terms into everyday analogies...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setLoadingStep('Formulating thoughtful doctor questions...');
    }, 2400);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          explanationLevel: selectedLevel,
          language: selectedLanguage,
          saveToHistory: true,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || 'Failed to analyze report.');
      }

      onAnalysisSuccess(result.data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while analyzing the medical text. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2 border border-teal-200/70">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Healthcare Analysis Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Analyze Medical Report & Prescription
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Paste your clinical lab results, pathology findings, radiology notes, or medication orders for plain-language interpretation.
          </p>
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Quick Samples:</span>
          {SAMPLE_REPORTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{sample.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Safety Notice Card */}
      <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-teal-950 leading-relaxed">
          <strong className="font-semibold text-teal-900">Patient Safety Standard:</strong> MedExplain explains terminology and ranges for educational literacy only. It does not diagnose diseases or recommend medication changes. Always discuss these findings directly with your physician.
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="medical-text" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Medical Report Text or Prescription Orders</span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
                id="file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload .txt File</span>
              </button>

              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs px-2.5 py-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Drag & Drop textarea container */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl transition-all ${
              dragActive ? 'ring-2 ring-teal-500 bg-teal-50/20' : ''
            }`}
          >
            <textarea
              id="medical-text"
              rows={9}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder={`Paste your medical report here...\n\nExample:\nTest: Complete Blood Count (CBC)\nWBC: 6.8 K/uL (Normal)\nPlatelets: 284 K/uL (Normal)\nHemoglobin: 10.4 g/dL (Low)\nMCV: 74.5 fL (Low)\nImpression: Microcytic hypochromic red cell indices...`}
              className="w-full p-4 rounded-xl text-slate-800 text-sm font-mono border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200/50 outline-hidden transition-all bg-slate-50/50"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Drag & drop files or paste clipboard text directly.</span>
            <span>{inputText.length} characters</span>
          </div>
        </div>

        {/* Options Row: Explanation Level & Target Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Explanation Level */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Explanation Detail Level</span>
            </div>
            <p className="text-xs text-slate-500">
              Select how simple or detailed you want the medical breakdown to be.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setSelectedLevel('simple')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  selectedLevel === 'simple'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-medium ring-2 ring-teal-200/50'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                {selectedLevel === 'simple' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="block text-sm font-bold">Simple</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">
                  Everyday analogies, 6th-grade vocabulary, concise bullet points.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLevel('detailed')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  selectedLevel === 'detailed'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-medium ring-2 ring-teal-200/50'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                {selectedLevel === 'detailed' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <span className="block text-sm font-bold">Detailed</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">
                  Clinical context, physiological mechanisms, reference range depth.
                </span>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Languages className="w-4 h-4 text-teal-600" />
              <span>Target Language</span>
            </div>
            <p className="text-xs text-slate-500">
              Select the language in which you would like the explanation provided.
            </p>

            <div className="pt-1">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-200/50 outline-hidden transition-all"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-2">
                All terminology definitions, findings, and doctor questions will be translated.
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Analysis Issue:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Submit Button & Progress Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Analysis will be automatically saved to your SQLite history.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 shadow-lg transition-all ${
              isLoading || !inputText.trim()
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing Report...</span>
              </>
            ) : (
              <>
                <span>Generate Plain-Language Explanation</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Loading Progress Feedback Bar */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2 animate-pulse">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-800">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                {loadingStep || 'MedExplain is processing your report...'}
              </span>
              <span>Gemini 3.8 Flash</span>
            </div>
            <div className="w-full bg-teal-200/60 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full animate-[shimmer_2s_infinite] w-3/4"></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
