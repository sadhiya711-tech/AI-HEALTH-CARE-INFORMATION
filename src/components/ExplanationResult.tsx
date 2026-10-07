import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Stethoscope, 
  BookOpen, 
  ShieldAlert, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  FileText, 
  ArrowLeft, 
  Share2, 
  Download, 
  Calendar,
  Tag,
  Sparkles,
  Layers,
  MessageSquare
} from 'lucide-react';
import { AnalysisRecord } from '../types';

interface ExplanationResultProps {
  record: AnalysisRecord;
  onBackToAnalyzer: () => void;
  onAnalyzeAnother: () => void;
}

export const ExplanationResult: React.FC<ExplanationResultProps> = ({ 
  record, 
  onBackToAnalyzer,
  onAnalyzeAnother 
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});

  const handleCopyQuestions = () => {
    const text = record.doctor_questions
      .map((q, idx) => `${idx + 1}. ${q}`)
      .join('\n');
    navigator.clipboard.writeText(`Questions for My Doctor regarding ${record.title}:\n\n${text}`);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
  };

  const handleCopySummary = () => {
    const content = `MedExplain Summary: ${record.title}\n\nSimple Explanation:\n${record.simple_explanation}\n\nKey Information:\n${record.key_information.map(k => `• ${k}`).join('\n')}\n\nQuestions for Doctor:\n${record.doctor_questions.map(q => `• ${q}`).join('\n')}\n\nDisclaimer: This information is for educational purposes only and is not a substitute for professional medical advice.`;
    navigator.clipboard.writeText(content);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const toggleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(record.simple_explanation);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const toggleQuestionCheck = (idx: number) => {
    setCheckedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 print:p-0">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <button
          onClick={onBackToAnalyzer}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analyzer</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeak}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isSpeaking
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-600" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen Aloud'}</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={onAnalyzeAnother}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
          >
            Analyze New Report
          </button>
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {record.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-500" />
              <span>Level: {record.explanation_level === 'simple' ? 'Simple (Layperson)' : 'Detailed (Comprehensive)'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              Language: {record.language}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(record.created_at).toLocaleDateString()} at {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {record.title}
        </h1>

        {/* Mandatory Safety Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900 block mb-0.5">Educational Purpose Notice</span>
            This information is for educational purposes only and is not a substitute for professional medical advice, clinical diagnosis, or medication prescription. Always review your findings directly with your physician.
          </div>
        </div>
      </div>

      {/* 1. Simple Explanation Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Simple Overview</h2>
              <p className="text-xs text-slate-500">Jargon-free summary of your medical document</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100/80 text-slate-800 text-sm sm:text-base leading-relaxed space-y-3">
          <p>{record.simple_explanation}</p>
        </div>
      </div>

      {/* 2. Key Information from the Text */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Key Information & Takeaways</h2>
            <p className="text-xs text-slate-500">Essential findings distilled from your results</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-2">
          {record.key_information.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Important Medical Terms & Meanings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Important Medical Terms & Meanings</h2>
            <p className="text-xs text-slate-500">Every technical phrase decoded with plain-language analogies</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {record.medical_terms.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>{item.term}</span>
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Medical Term
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 font-semibold block text-xs mb-0.5">Plain Meaning:</strong>
                  {item.meaning}
                </div>

                {(item.clinical_context || item.clinicalContext) && (
                  <div className="text-xs text-slate-500 pt-1">
                    <span className="font-medium text-slate-700">Clinical Purpose: </span>
                    {item.clinical_context || item.clinicalContext}
                  </div>
                )}
              </div>

              {item.analogy && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 leading-snug">
                  <span className="font-bold block mb-0.5">Everyday Analogy:</span>
                  💡 {item.analogy}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Questions to Ask Your Healthcare Professional */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Questions for Your Doctor</h2>
              <p className="text-xs text-slate-500">Take this checklist to your next clinic visit</p>
            </div>
          </div>

          <button
            onClick={handleCopyQuestions}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            {copiedQuestions ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedQuestions ? 'Copied to Clipboard' : 'Copy All Questions'}</span>
          </button>
        </div>

        <div className="space-y-3 pt-2">
          {record.doctor_questions.map((question, idx) => (
            <div 
              key={idx}
              onClick={() => toggleQuestionCheck(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                checkedQuestions[idx]
                  ? 'bg-emerald-50/60 border-emerald-300 line-through text-slate-500'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checkedQuestions[idx]}
                onChange={() => toggleQuestionCheck(idx)}
                className="mt-1 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium leading-relaxed flex-1">
                {question}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Original Medical Text Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 print:hidden">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>{showOriginal ? 'Hide Original Medical Text' : 'View Original Medical Text Provided'}</span>
          </span>
          <span className="text-xs text-teal-600 font-medium">
            {showOriginal ? 'Collapse' : 'Expand'}
          </span>
        </button>

        {showOriginal && (
          <div className="pt-2">
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-96">
              {record.original_text}
            </pre>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg print:hidden">
        <div>
          <h3 className="font-bold text-base">Have another medical report or prescription?</h3>
          <p className="text-xs text-teal-100">Upload or paste another document to decipher technical jargon.</p>
        </div>
        <button
          onClick={onAnalyzeAnother}
          className="px-6 py-2.5 rounded-xl bg-white hover:bg-teal-50 text-teal-900 font-semibold text-sm shadow-sm transition-all"
        >
          Analyze Another Report
        </button>
      </div>
    </div>
  );
};
