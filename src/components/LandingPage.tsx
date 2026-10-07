import React from 'react';
import { 
  HeartPulse, 
  ArrowRight, 
  FileCheck2, 
  HelpCircle, 
  ShieldAlert, 
  Sparkles, 
  Languages, 
  Stethoscope, 
  BookOpenCheck,
  CheckCircle2,
  Lock,
  MessageSquareHeart,
  Activity
} from 'lucide-react';
import { SAMPLE_REPORTS, SampleReport } from '../data/sampleReports';

interface LandingPageProps {
  onStartAnalysis: (sample?: SampleReport) => void;
  onExploreHistory: () => void;
  onOpenGlossary: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartAnalysis, 
  onExploreHistory,
  onOpenGlossary 
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-teal-50/70 via-cyan-50/30 to-white rounded-3xl border border-teal-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-6 border border-teal-200">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Healthcare Information Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Understand Your Medical Reports in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              Plain, Simple Language
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            People often find medical reports, prescriptions, and healthcare terminology confusing and stressful. 
            <strong className="text-slate-800 font-semibold"> MedExplain</strong> translates complex clinical results into clear, everyday explanations—empowering you to have meaningful, informed conversations with your doctor.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartAnalysis()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Analyze Report Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreHistory}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-base border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileCheck2 className="w-5 h-5 text-teal-600" />
              <span>Browse Saved History</span>
            </button>
          </div>

          {/* Core Healthcare Safety Box */}
          <div className="mt-10 max-w-2xl mx-auto p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-left shadow-xs flex items-start gap-3.5">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              <span className="font-bold text-amber-900 block mb-0.5">Strict Educational Purpose Disclaimer:</span>
              This application provides educational healthcare literacy explanations and does not provide medical diagnoses, treatment decisions, or prescriptions. Always consult your licensed physician or healthcare provider regarding any health condition or medications.
            </div>
          </div>
        </div>

        {/* Decorative background grid/accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 1-Click Demo Samples Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-600" />
              <span>Try Instant Sample Reports</span>
            </h2>
            <p className="text-sm text-slate-500">
              Select any real-world clinical scenario to test MedExplain with a single click.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg border border-teal-200 shrink-0">
            Hackathon Demo Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_REPORTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onStartAnalysis(sample)}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                    {sample.category}
                  </span>
                  <span className="text-xs text-teal-600 font-semibold group-hover:underline flex items-center gap-1">
                    Load & Analyze <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors text-base mb-1.5">
                  {sample.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {sample.preview}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Transformation Comparison: Before vs After */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
              The MedExplain Transformation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Turning Confusing Medical Jargon into Clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Before */}
            <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Before • Raw Lab Text</span>
                <span className="text-xs text-slate-400 font-mono">Confusing</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-rose-200/90 leading-relaxed border border-rose-950">
                &ldquo;Microcytic hypochromic red cell indices noted with MCV 74.5 fL and Hgb 10.4 g/dL. Clinical correlation with serum ferritin advised.&rdquo;
              </div>
              <p className="text-xs text-slate-400">
                Patients often experience anxiety when searching online, confusing indices with severe illnesses.
              </p>
            </div>

            {/* After */}
            <div className="p-5 rounded-2xl bg-teal-950/60 border border-teal-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">After • MedExplain Translation</span>
                <span className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Clear & Calming
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-teal-900/40 text-xs text-teal-100 leading-relaxed border border-teal-800/50">
                &ldquo;Your red blood cells are slightly smaller than average (MCV) and carrying slightly less oxygen (Hemoglobin), a common sign of low iron stores. Your doctor will likely check your iron levels (ferritin).&rdquo;
              </div>
              <div className="text-xs text-teal-300/90 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Includes 4 ready-to-ask questions for your doctor's appointment.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features & Guardrails Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            What MedExplain Delivers for Patients
          </h2>
          <p className="text-sm text-slate-600">
            Engineered specifically to demystify health records with empathy, clarity, and uncompromising safety.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Simple & Detailed Modes</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Toggle between 6th-grade intuitive reading level with everyday analogies or detailed clinical context with physiological explanations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Medical Terms & Meanings</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every complex acronym and medical term (like MCV, BID, eGFR, Dyspnea) is decoded with plain definitions and intuitive real-life analogies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Doctor Discussion Questions</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get 4 to 6 thoughtful, practical questions to write down or bring to your next healthcare appointment to make the most of your visit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Multi-Language Support</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explain reports directly in English, Spanish, French, German, Hindi, Chinese, and more for multilingual families and caregivers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">SQLite Report History</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All previous analyses are safely logged in your local SQLite database for quick reference, trend reviewing, and print/exporting.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Ethical Safety Guardrails</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Strictly non-diagnostic: will never prescribe medication, modify dosages, or suggest self-treatment without professional consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Manifesto Banner */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-teal-200 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Our 4 Core Safety Commitments</h3>
            <p className="text-xs text-slate-600">Built into the model system instructions and UI design</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 text-xs space-y-1">
            <span className="font-bold text-emerald-800 block">1. No Diagnosis</span>
            <span className="text-slate-600">We describe the documented lab ranges without diagnosing illnesses or conditions.</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 text-xs space-y-1">
            <span className="font-bold text-emerald-800 block">2. No Prescribing</span>
            <span className="text-slate-600">We never recommend drugs, supplements, or clinical interventions.</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 text-xs space-y-1">
            <span className="font-bold text-emerald-800 block">3. Never Alter Dosages</span>
            <span className="text-slate-600">Prescription instructions are explained as written; changes are strictly doctor-managed.</span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-teal-100 text-xs space-y-1">
            <span className="font-bold text-emerald-800 block">4. Doctor-Empowering</span>
            <span className="text-slate-600">We bridge communication gaps so patients arrive confident and informed.</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to Decode Your Medical Information?</h2>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
          Paste your lab results, imaging notes, or prescriptions to receive a clear, easy-to-read explanation.
        </p>
        <button
          onClick={() => onStartAnalysis()}
          className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-lg shadow-teal-600/25 inline-flex items-center gap-2"
        >
          <span>Open MedExplain Analyzer</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
