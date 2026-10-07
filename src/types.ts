export interface MedicalTermDetail {
  term: string;
  meaning: string;
  clinicalContext?: string;
  clinical_context?: string;
  analogy?: string;
}

export interface AnalysisRecord {
  id: string;
  title: string;
  original_text: string;
  explanation_level: 'simple' | 'detailed';
  language: string;
  category: string;
  simple_explanation: string;
  key_information: string[];
  medical_terms: MedicalTermDetail[];
  doctor_questions: string[];
  created_at: string;
}

export interface AdminStats {
  totalAnalyses: number;
  recentAnalyses: AnalysisRecord[];
  topCategories: Array<{ name: string; count: number }>;
  topTerms: Array<{ term: string; count: number }>;
  languageDistribution: Record<string, number>;
  levelDistribution: { simple: number; detailed: number };
  averageReportChars: number;
}
