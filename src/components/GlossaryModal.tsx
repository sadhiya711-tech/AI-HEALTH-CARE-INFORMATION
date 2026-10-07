import React, { useState } from 'react';
import { BookOpen, Search, Tag, X, Sparkles } from 'lucide-react';

interface GlossaryEntry {
  term: string;
  category: string;
  definition: string;
  example: string;
}

const GLOSSARY_TERMS: GlossaryEntry[] = [
  {
    term: 'PO (Per Os)',
    category: 'Prescriptions',
    definition: 'Latin for "by mouth". Indicates the medication is to be taken orally (swallowed).',
    example: 'Take 1 tablet PO daily with water.'
  },
  {
    term: 'BID (Bis In Die)',
    category: 'Prescriptions',
    definition: 'Latin for "twice a day". Dosing is typically spaced approximately 12 hours apart.',
    example: 'Amoxicillin 500mg PO BID.'
  },
  {
    term: 'TID (Ter In Die)',
    category: 'Prescriptions',
    definition: 'Latin for "three times a day", typically taken with morning, afternoon, and evening meals.',
    example: 'Take 1 capsule TID with food.'
  },
  {
    term: 'PRN (Pro Re Nata)',
    category: 'Prescriptions',
    definition: 'Latin for "as needed". Indicates medication is only taken when specific symptoms arise.',
    example: 'Ibuprofen 400mg PO PRN for headache.'
  },
  {
    term: 'QD (Quaque Die)',
    category: 'Prescriptions',
    definition: 'Latin for "every day" or "once daily".',
    example: 'Lisinopril 10mg PO QD in the morning.'
  },
  {
    term: 'QHS (Quaque Hora Somni)',
    category: 'Prescriptions',
    definition: 'Take every night at bedtime.',
    example: 'Atorvastatin 20mg PO QHS.'
  },
  {
    term: 'CBC (Complete Blood Count)',
    category: 'Lab Tests',
    definition: 'A standard blood test that counts red blood cells, white blood cells, hemoglobin, and platelets.',
    example: 'Ordered during routine physicals or to investigate fatigue or infection.'
  },
  {
    term: 'CMP (Comprehensive Metabolic Panel)',
    category: 'Lab Tests',
    definition: 'A 14-part blood test that evaluates kidney function, liver enzymes, electrolytes, and blood sugar.',
    example: 'Used to check metabolic equilibrium and organ health.'
  },
  {
    term: 'eGFR (Estimated Glomerular Filtration Rate)',
    category: 'Lab Tests',
    definition: 'A calculation measuring how efficiently your kidneys filter waste from the blood.',
    example: 'Values above 60 mL/min generally reflect healthy kidney filtration.'
  },
  {
    term: 'HbA1c (Glycated Hemoglobin)',
    category: 'Lab Tests',
    definition: 'Measures your average blood sugar levels over the past 2 to 3 months.',
    example: 'Used to monitor long-term glycemic control and diabetes risk.'
  },
  {
    term: 'LDL (Low-Density Lipoprotein)',
    category: 'Cardiology',
    definition: 'Often termed "bad cholesterol" because excess amounts can accumulate as plaque on arterial walls.',
    example: 'Optimal target is usually under 100 mg/dL.'
  },
  {
    term: 'HDL (High-Density Lipoprotein)',
    category: 'Cardiology',
    definition: 'Often termed "good cholesterol" because it helps transport excess cholesterol to the liver for disposal.',
    example: 'Protective cardiovascular marker when above 50 mg/dL.'
  },
  {
    term: 'BUN (Blood Urea Nitrogen)',
    category: 'Lab Tests',
    definition: 'Measures the amount of nitrogen in your blood that comes from the waste product urea.',
    example: 'Evaluates kidney function and hydration status.'
  },
  {
    term: 'Microcytic Anemia',
    category: 'Hematology',
    definition: 'A state where red blood cells are smaller than normal, frequently linked to low iron reserves.',
    example: 'Identified by a low MCV number on a CBC panel.'
  },
  {
    term: 'Dyspnea',
    category: 'Symptoms',
    definition: 'The medical term for shortness of breath or labored breathing.',
    example: 'Patient reports mild dyspnea on exertion.'
  },
  {
    term: 'Hypertension',
    category: 'Cardiology',
    definition: 'Chronic elevation of arterial blood pressure above recommended guidelines.',
    example: 'Commonly treated with lifestyle modifications and medications like Lisinopril.'
  }
];

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  if (!isOpen) return null;

  const categories = Array.from(new Set(GLOSSARY_TERMS.map(t => t.category)));

  const filtered = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = 
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Medical Abbreviations & Glossary</h2>
              <p className="text-xs text-slate-500">Quick plain-language reference for prescriptions and lab markers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search term (e.g., BID, CBC, eGFR)..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-hidden"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => setSelectedCat('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedCat === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedCat === cat ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {filtered.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 text-sm">{item.term}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
              <p className="text-[11px] text-slate-400 italic">Example: {item.example}</p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching medical glossary terms found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Always confirm prescription directions with your pharmacist or doctor.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
