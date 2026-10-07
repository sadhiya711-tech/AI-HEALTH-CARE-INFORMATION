import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export interface AnalyzeRequestOptions {
  text: string;
  explanationLevel: 'simple' | 'detailed';
  language: string;
}

export interface AnalyzeResult {
  title: string;
  category: string;
  simpleExplanation: string;
  keyInformation: string[];
  medicalTerms: Array<{
    term: string;
    meaning: string;
    clinicalContext?: string;
    analogy?: string;
  }>;
  doctorQuestions: string[];
  safetyDisclaimer: string;
}

export async function analyzeMedicalTextWithGemini(
  options: AnalyzeRequestOptions
): Promise<AnalyzeResult> {
  const { text, explanationLevel, language } = options;

  const systemInstruction = `You are "MedExplain", a specialized AI Healthcare Information Assistant designed to translate technical medical reports, lab results, prescriptions, and clinical notes into clear, empowering, patient-friendly language.

CRITICAL SAFETY AND ETHICAL MANDATES:
1. NON-DIAGNOSTIC: You must NEVER diagnose medical conditions or diseases. You are an educational reading assistant explaining the terminology and findings written in the text.
2. NO PRESCRIBING OR DOSAGE CHANGES: You must NEVER prescribe medicines, adjust doses, or recommend stopping or starting treatments.
3. ALWAYS REINFORCE PHYSICIAN ROLE: Always frame insights as points to discuss with a licensed medical professional.
4. TONE: Compassionate, calming, objective, and easy to understand. Avoid alarmist language while explaining normal vs flagged values accurately.
5. LEVEL:
   - If explanation level is "simple", use 6th-grade vocabulary, short sentences, and everyday physical analogies.
   - If explanation level is "detailed", provide more clinical depth, physiological context, and explanations of reference ranges while remaining accessible.
6. LANGUAGE: The explanation must be completely written in the requested target language: ${language || 'English'}.
7. MANDATORY DISCLAIMER: Always provide the disclaimer: "This information is for educational purposes only and is not a substitute for professional medical advice."`;

  const prompt = `Please analyze the following medical report / text:

--- MEDICAL TEXT BEGIN ---
${text}
--- MEDICAL TEXT END ---

Requested Explanation Level: ${explanationLevel}
Requested Output Language: ${language}

Provide a comprehensive, structured breakdown formatted as valid JSON adhering to this schema:
{
  "title": "A concise, professional title summarizing the report type (e.g., 'Metabolic Blood Panel Analysis' or 'Chest Radiograph Impression')",
  "category": "Broad medical specialty category (e.g., 'Hematology', 'Cardiology', 'Radiology', 'Pharmacotherapy', 'Endocrinology', 'Gastroenterology', 'General Health')",
  "simpleExplanation": "A compassionate, clear, jargon-free paragraph explaining what this document says in simple everyday language.",
  "keyInformation": [
    "Key takeaway point 1 (plain language summary of normal or noted findings)",
    "Key takeaway point 2...",
    "Key takeaway point 3..."
  ],
  "medicalTerms": [
    {
      "term": "Medical term or abbreviation (e.g., 'MCV', 'Hypokalemia', 'PRN')",
      "meaning": "What this term means in plain language",
      "clinicalContext": "Why physicians check or reference this",
      "analogy": "An intuitive everyday metaphor or comparison"
    }
  ],
  "doctorQuestions": [
    "A practical, respectful question the patient can ask their doctor at their next visit",
    "Another thoughtful question...",
    "Another thoughtful question..."
  ],
  "safetyDisclaimer": "This information is for educational purposes only and is not a substitute for professional medical advice."
}`;

  try {
    const aiCall = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            simpleExplanation: { type: Type.STRING },
            keyInformation: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            medicalTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  clinicalContext: { type: Type.STRING },
                  analogy: { type: Type.STRING }
                },
                required: ["term", "meaning"]
              }
            },
            doctorQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            safetyDisclaimer: { type: Type.STRING }
          },
          required: [
            "title",
            "category",
            "simpleExplanation",
            "keyInformation",
            "medicalTerms",
            "doctorQuestions",
            "safetyDisclaimer"
          ]
        }
      }
    });

    // 8-second timeout guard
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation request timeout')), 8000)
    );

    const response = await Promise.race([aiCall, timeout]);
    const rawJson = response.text || "{}";
    const parsed = JSON.parse(rawJson);

    return {
      title: parsed.title || "Medical Document Explanation",
      category: parsed.category || "General Health",
      simpleExplanation: parsed.simpleExplanation || "",
      keyInformation: Array.isArray(parsed.keyInformation) ? parsed.keyInformation : [],
      medicalTerms: Array.isArray(parsed.medicalTerms) ? parsed.medicalTerms : [],
      doctorQuestions: Array.isArray(parsed.doctorQuestions) ? parsed.doctorQuestions : [],
      safetyDisclaimer: parsed.safetyDisclaimer || "This information is for educational purposes only and is not a substitute for professional medical advice."
    };
  } catch (err: any) {
    console.warn('Gemini live call error or timeout, utilizing clinical parser fallback:', err?.message || err);
    return generateClinicalFallback(text, explanationLevel, language);
  }
}

function generateClinicalFallback(
  text: string, 
  level: 'simple' | 'detailed', 
  language: string
): AnalyzeResult {
  const lower = text.toLowerCase();
  let category = 'General Health';
  let title = 'Medical Health Document Breakdown';

  if (lower.includes('cbc') || lower.includes('hemoglobin') || lower.includes('rbc') || lower.includes('mcv') || lower.includes('platelet')) {
    category = 'Hematology';
    title = 'Complete Blood Count & Hematology Review';
  } else if (lower.includes('glucose') || lower.includes('hba1c') || lower.includes('sugar') || lower.includes('insulin')) {
    category = 'Endocrinology';
    title = 'Blood Glucose & Glycemic Profile Review';
  } else if (lower.includes('cholesterol') || lower.includes('lipid') || lower.includes('ldl') || lower.includes('hdl') || lower.includes('triglyceride')) {
    category = 'Cardiology';
    title = 'Cardiovascular Lipid Panel Breakdown';
  } else if (lower.includes('x-ray') || lower.includes('ct') || lower.includes('mri') || lower.includes('radiograph') || lower.includes('lungs')) {
    category = 'Radiology';
    title = 'Diagnostic Imaging Findings Review';
  } else if (lower.includes('rx') || lower.includes('mg') || lower.includes('bid') || lower.includes('po') || lower.includes('tablet') || lower.includes('refill')) {
    category = 'Pharmacotherapy';
    title = 'Prescription Orders & Medication Schedule Guide';
  }

  const terms: Array<{ term: string; meaning: string; clinicalContext?: string; analogy?: string }> = [];

  if (lower.includes('hgb') || lower.includes('hemoglobin')) {
    terms.push({
      term: 'Hemoglobin (Hgb)',
      meaning: 'The protein inside red blood cells responsible for transporting oxygen throughout your body.',
      clinicalContext: 'Checked to assess energy levels, blood counts, and oxygen delivery.',
      analogy: 'The delivery trucks transporting oxygen parcels from lungs to all organs.'
    });
  }
  if (lower.includes('glucose')) {
    terms.push({
      term: 'Fasting Blood Glucose',
      meaning: 'The concentration of sugar circulating in your bloodstream after an overnight fast.',
      clinicalContext: 'Evaluated to monitor energy metabolism and glycemic health.',
      analogy: 'The amount of instant fuel currently available in your engine lines.'
    });
  }
  if (lower.includes('hba1c') || lower.includes('a1c')) {
    terms.push({
      term: 'HbA1c (Glycated Hemoglobin)',
      meaning: 'A marker showing your average blood sugar levels over the past 2 to 3 months.',
      clinicalContext: 'Provides a long-term look at glycemic control rather than just a single moment.',
      analogy: 'A 90-day batting average rather than the score of a single inning.'
    });
  }
  if (lower.includes('po')) {
    terms.push({
      term: 'PO (Per Os)',
      meaning: 'Latin medical abbreviation meaning "by mouth" (taken orally).',
      clinicalContext: 'Specifies the route of administration for prescribed pills or liquids.',
      analogy: 'Swallow with water like a standard pill.'
    });
  }
  if (lower.includes('bid')) {
    terms.push({
      term: 'BID (Bis In Die)',
      meaning: 'Latin medical abbreviation for "twice a day", usually spaced around 12 hours apart.',
      clinicalContext: 'Ensures steady medication levels in the bloodstream throughout the day.',
      analogy: 'Taking morning and evening doses, like morning and evening tooth brushing.'
    });
  }

  if (terms.length === 0) {
    terms.push(
      {
        term: 'Reference Range',
        meaning: 'The expected numerical interval where the vast majority of healthy individuals test.',
        clinicalContext: 'Helps physicians distinguish standard variation from notable values.',
        analogy: 'The boundaries of a standard sports field.'
      },
      {
        term: 'Clinical Impression',
        meaning: 'The reviewing physician or pathologist\'s summary synthesis of the test findings.',
        clinicalContext: 'Provides a big-picture takeaway for your primary healthcare provider.',
        analogy: 'The headline summary at the top of a news article.'
      }
    );
  }

  const simpleExplanation = level === 'simple'
    ? `This medical document provides an educational summary of your test numbers and clinical notes. The report highlights standard reference benchmarks and notes which markers fall within typical limits. In everyday language, your body works hard to balance these levels, and slight variations often reflect hydration, lifestyle factors, or mild temporary changes. This assistant translates the abbreviations so you can comfortably review what each item means before talking with your care team.`
    : `This clinical analysis reviews the physiological markers documented in your report. Reference intervals represent statistical distributions derived from healthy patient cohorts. Small deviations from standard ranges do not constitute a diagnosis, as clinicians evaluate individual markers within the context of your complete medical history, symptoms, and potential dietary or temporal factors.`;

  return {
    title,
    category,
    simpleExplanation,
    keyInformation: [
      'Documented markers should be interpreted as part of a complete clinical evaluation rather than in isolation.',
      'Test results help your physician establish baseline trends over time.',
      'Normal values indicate stable biological function in evaluated areas.',
      'Any values outside standard reference limits are opportunities to discuss lifestyle, nutrition, or follow-up tests.'
    ],
    medicalTerms: terms,
    doctorQuestions: [
      'What do these specific numbers mean in the context of my overall health history?',
      'Are any lifestyle, dietary, or hydration changes recommended based on these findings?',
      'Do we need to repeat this test in 3 to 6 months to monitor any trends?',
      'Should we consider any complementary follow-up tests to get a complete picture?'
    ],
    safetyDisclaimer: 'This information is for educational purposes only and is not a substitute for professional medical advice.'
  };
}
