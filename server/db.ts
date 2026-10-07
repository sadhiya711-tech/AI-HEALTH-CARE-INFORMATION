import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

export interface AnalysisRecord {
  id: string;
  title: string;
  original_text: string;
  explanation_level: 'simple' | 'detailed';
  language: string;
  category: string;
  simple_explanation: string;
  key_information: string[]; // JSON array
  medical_terms: Array<{
    term: string;
    meaning: string;
    clinical_context?: string;
    analogy?: string;
  }>; // JSON array
  doctor_questions: string[]; // JSON array
  created_at: string;
}

let dbInstance: any = null;
const DB_PATH = path.resolve(process.cwd(), 'medexplain.sqlite');

export async function getDatabase() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    try {
      const buffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(buffer);
    } catch (e) {
      console.warn('Failed to load existing SQLite file, creating fresh DB:', e);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Create tables
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      original_text TEXT NOT NULL,
      explanation_level TEXT NOT NULL,
      language TEXT NOT NULL,
      category TEXT NOT NULL,
      simple_explanation TEXT NOT NULL,
      key_information TEXT NOT NULL,
      medical_terms TEXT NOT NULL,
      doctor_questions TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Check if we need seed data
  const countRes = dbInstance.exec("SELECT COUNT(*) as count FROM analyses");
  const count = countRes[0]?.values[0]?.[0] || 0;

  if (count === 0) {
    seedInitialData(dbInstance);
  }

  persistDatabase();
  return dbInstance;
}

export function persistDatabase() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (err) {
    console.error('Error saving SQLite database file:', err);
  }
}

function seedInitialData(db: any) {
  const sample1: AnalysisRecord = {
    id: 'demo-cbc-01',
    title: 'Complete Blood Count (CBC) Panel with Mild Microcytic Anemia',
    original_text: `PATIENT LAB REPORT: HEMATOLOGY
Test Name: Complete Blood Count (CBC) with Differential
WBC: 6.8 K/uL (Ref: 4.5 - 11.0 K/uL) [NORMAL]
RBC: 3.92 M/uL (Ref: 4.20 - 5.80 M/uL) [LOW]
Hemoglobin (Hgb): 10.4 g/dL (Ref: 12.0 - 15.5 g/dL) [LOW]
Hematocrit (Hct): 31.8% (Ref: 37.0 - 48.0%) [LOW]
MCV: 74.5 fL (Ref: 80.0 - 100.0 fL) [LOW]
MCH: 24.1 pg (Ref: 27.0 - 33.0 pg) [LOW]
RDW: 16.2% (Ref: 11.5 - 14.5%) [HIGH]
Platelets: 284 K/uL (Ref: 150 - 450 K/uL) [NORMAL]
Impression: Microcytic hypochromic red cell indices, mild microcytic anemia pattern. Clinical correlation with iron studies recommended.`,
    explanation_level: 'simple',
    language: 'English',
    category: 'Hematology',
    simple_explanation: 'This routine blood count looks at your red blood cells, white blood cells, and platelets. Overall, your infection-fighting white blood cells and clotting platelets are completely normal. However, your red blood cells and hemoglobin are slightly below the expected range, and your red blood cells appear slightly smaller than average (microcytic). In everyday terms, this often points toward low iron stores, meaning your body might need more iron to build healthy oxygen-carrying cells.',
    key_information: [
      'Normal white blood cell count (6.8 K/uL) indicates no active sign of systemic bacterial infection.',
      'Platelet levels (284 K/uL) are healthy, so your blood clotting ability is normal.',
      'Hemoglobin (10.4 g/dL) and Hematocrit (31.8%) are mildly low, which may explain sensations of fatigue or low energy.',
      'MCV (74.5 fL) indicates smaller-than-normal red blood cells, commonly seen when iron levels are low.',
      'The laboratory notes that additional iron studies (like Ferritin) may help clarify the cause.'
    ],
    medical_terms: [
      {
        term: 'Hemoglobin (Hgb)',
        meaning: 'A protein inside red blood cells that carries oxygen from your lungs to the rest of your body.',
        clinical_context: 'Tested to determine how well oxygen is delivered to your organs and muscles.',
        analogy: 'Think of hemoglobin as the delivery trucks that transport fresh oxygen packages around your body.'
      },
      {
        term: 'MCV (Mean Corpuscular Volume)',
        meaning: 'A measurement of the physical average size of your red blood cells.',
        clinical_context: 'Helps your doctor classify what type of anemia might be present (e.g. iron deficiency vs. B12 deficiency).',
        analogy: 'Imagine measuring the cup size of individual sponges soaking up water.'
      },
      {
        term: 'Microcytic Anemia',
        meaning: 'A condition where your body has fewer red blood cells than normal, and those cells are smaller than standard size.',
        clinical_context: 'Commonly caused by low iron stores, dietary factors, or minor chronic blood loss.',
        analogy: 'Like having a fleet of compact cars instead of full-sized vans to deliver supplies.'
      },
      {
        term: 'Platelets (Thrombocytes)',
        meaning: 'Tiny cell fragments that stick together to form clots and stop bleeding when you get a cut.',
        clinical_context: 'Ensures your blood coagulates properly.',
        analogy: 'The emergency road repair crew that patches any punctures in blood vessels.'
      }
    ],
    doctor_questions: [
      'Could my low hemoglobin be related to low iron or diet, and should we test my Ferritin level?',
      'Do you recommend starting an iron supplement, and which type is gentlest on the stomach?',
      'Are there specific foods I should add to my daily meals to help rebuild my blood levels?',
      'When should we repeat this blood test to check if my numbers have improved?'
    ],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  };

  const sample2: AnalysisRecord = {
    id: 'demo-lipid-02',
    title: 'Lipid Cardiovascular Risk Profile',
    original_text: `LABORATORY REPORT: CLINICAL BIOCHEMISTRY
Lipid Panel with Non-HDL Calculation
Total Cholesterol: 238 mg/dL (Desirable: <200 mg/dL) [HIGH]
Triglycerides: 185 mg/dL (Normal: <150 mg/dL) [BORDERLINE HIGH]
HDL Cholesterol: 42 mg/dL (Optimal: >50 mg/dL) [LOW]
LDL Cholesterol (calc): 159 mg/dL (Optimal: <100 mg/dL) [ELEVATED]
Cholesterol / HDL Ratio: 5.67 (Desirable: <4.0) [HIGH]
Non-HDL Cholesterol: 196 mg/dL (Optimal: <130 mg/dL) [HIGH]
Clinical Note: Moderate elevation of atherogenic lipoproteins. Recommend lifestyle cardiovascular evaluation.`,
    explanation_level: 'detailed',
    language: 'English',
    category: 'Cardiology',
    simple_explanation: 'This lipid panel evaluates the types of fats circulating in your bloodstream. Your results show higher than optimal levels of LDL ("bad" cholesterol) and total triglycerides, while your HDL ("protective" cholesterol) is on the lower side. Together, these markers indicate that fatty deposits could accumulate inside artery walls over time if left unaddressed. Doctors typically address this by reviewing heart-healthy diet changes, physical exercise, and cardiovascular risk factors.',
    key_information: [
      'Total Cholesterol is 238 mg/dL (above the desirable target of 200 mg/dL).',
      'LDL ("Low-Density Lipoprotein") is 159 mg/dL; lowering this reduces plaque buildup in arteries.',
      'HDL ("High-Density Lipoprotein") is 42 mg/dL; higher HDL helps clear excess fat from the bloodstream.',
      'Triglycerides are mildly elevated at 185 mg/dL, often influenced by dietary carbohydrates, sugars, and physical activity.',
      'The overall cholesterol-to-HDL ratio is 5.67, suggesting an opportunity for preventive cardiovascular optimization.'
    ],
    medical_terms: [
      {
        term: 'LDL Cholesterol',
        meaning: 'Low-density lipoprotein, often called "bad cholesterol" because high amounts can form plaque inside blood vessels.',
        clinical_context: 'Primary target in managing cardiovascular wellness and stroke risk prevention.',
        analogy: 'Trash left behind on the highway that can narrow the lanes if not swept up.'
      },
      {
        term: 'HDL Cholesterol',
        meaning: 'High-density lipoprotein, referred to as "good cholesterol" because it carries excess cholesterol back to the liver for disposal.',
        clinical_context: 'Higher values are protective against coronary artery disease.',
        analogy: 'The street sweeping vehicles that keep the road clear of debris.'
      },
      {
        term: 'Triglycerides',
        meaning: 'The most common form of stored fat in the body, derived from unused calories.',
        clinical_context: 'Elevations are linked with metabolic health, dietary intake, and insulin response.',
        analogy: 'Stored fuel in a reserve tank that builds up when more fuel is put in than burned.'
      },
      {
        term: 'Atherogenic',
        meaning: 'Having the potential to cause the formation of fatty plaques inside blood vessel walls.',
        clinical_context: 'Used by cardiologists to describe the risk profile of cholesterol particles.',
        analogy: 'Plaque or scale building up inside plumbing pipes over many years.'
      }
    ],
    doctor_questions: [
      'What lifestyle modifications (such as dietary fats or exercise regimens) would you prioritize first?',
      'Based on my overall medical history and family background, what is my 10-year cardiovascular risk score?',
      'Do you recommend any advanced tests, such as a Coronary Calcium Scan (CAC) or ApoB test?',
      'Would you recommend an ongoing medication like a statin, or can we trial a 3-month lifestyle program first?'
    ],
    created_at: new Date(Date.now() - 86400000).toISOString()
  };

  const sample3: AnalysisRecord = {
    id: 'demo-rx-03',
    title: 'Outpatient Prescription: Metformin & Lisinopril Instructions',
    original_text: `PRESCRIPTION ORDERS & INSTRUCTIONS
Rx 1: Metformin HCl 500 mg PO BID with meals. Disp: #60. Refills: 3.
Indication: Glycemic management.
Sig: Take 1 tablet twice daily with morning and evening meal.

Rx 2: Lisinopril 10 mg PO QD in AM. Disp: #30. Refills: 3.
Indication: Essential hypertension.
Sig: Take 1 tablet once daily in the morning with water. Monitor BP weekly.
Precaution: Report persistent dry cough or dizziness upon standing.`,
    explanation_level: 'simple',
    language: 'English',
    category: 'Pharmacotherapy',
    simple_explanation: 'This document contains instructions for two standard outpatient medications: Metformin and Lisinopril. Metformin helps balance blood sugar levels and should always be taken with food to prevent an upset stomach. Lisinopril is taken once daily in the morning to gently relax blood vessels and maintain healthy blood pressure. The doctor notes to watch for lightheadedness or a dry cough, which are known mild side effects to discuss at your visit.',
    key_information: [
      'Metformin 500 mg: Take 1 pill twice each day (PO BID), strictly with meals (breakfast and dinner).',
      'Taking Metformin with food reduces gastrointestinal side effects like stomach cramping or nausea.',
      'Lisinopril 10 mg: Take 1 pill once every morning (PO QD) with water.',
      'Routine blood pressure tracking once a week is requested to confirm the dose is working well.',
      'Never alter your dosage or discontinue these medications without consulting your prescribing physician.'
    ],
    medical_terms: [
      {
        term: 'PO (Per Os)',
        meaning: 'Medical Latin abbreviation meaning "by mouth" (swallowed orally).',
        clinical_context: 'Specifies the route of medication administration.',
        analogy: 'Directions stating "swallow with water, do not inhale or apply on skin".'
      },
      {
        term: 'BID (Bis In Die)',
        meaning: 'Latin medical abbreviation meaning "twice a day".',
        clinical_context: 'Indicates the medication dosing schedule, usually spaced roughly 12 hours apart.',
        analogy: 'Like brushing your teeth in the morning and at night.'
      },
      {
        term: 'QD (Quaque Die)',
        meaning: 'Latin medical abbreviation meaning "once every day".',
        clinical_context: 'Taken consistently at the same hour each day.',
        analogy: 'A single daily routine, such as your morning cup of water.'
      },
      {
        term: 'Hypertension',
        meaning: 'High blood pressure, meaning the force of blood pumping against artery walls is consistently elevated.',
        clinical_context: 'Managed to protect the kidneys, heart, and brain.',
        analogy: 'Water running through a garden hose with higher pressure than designed for.'
      }
    ],
    doctor_questions: [
      'What should I do if I accidentally miss a dose of Metformin or Lisinopril?',
      'Are there any over-the-counter pain relievers (like ibuprofen) that I should avoid while on Lisinopril?',
      'What blood pressure target range are we aiming for during my home readings?',
      'When should we schedule routine kidney function or HbA1c lab checks?'
    ],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  };

  insertAnalysis(db, sample1);
  insertAnalysis(db, sample2);
  insertAnalysis(db, sample3);
}

function insertAnalysis(db: any, record: AnalysisRecord) {
  const stmt = db.prepare(`
    INSERT INTO analyses (
      id, title, original_text, explanation_level, language, category,
      simple_explanation, key_information, medical_terms, doctor_questions, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([
    record.id,
    record.title,
    record.original_text,
    record.explanation_level,
    record.language,
    record.category,
    record.simple_explanation,
    JSON.stringify(record.key_information),
    JSON.stringify(record.medical_terms),
    JSON.stringify(record.doctor_questions),
    record.created_at
  ]);
  stmt.free();
}

export async function saveAnalysisToDb(record: AnalysisRecord): Promise<void> {
  const db = await getDatabase();
  insertAnalysis(db, record);
  persistDatabase();
}

export async function getAllAnalysesFromDb(): Promise<AnalysisRecord[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM analyses ORDER BY created_at DESC");
  if (!res || res.length === 0) return [];
  const columns = res[0].columns;
  const values = res[0].values;
  return values.map((row: any[]) => {
    const obj: any = {};
    columns.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return {
      ...obj,
      key_information: JSON.parse(obj.key_information || '[]'),
      medical_terms: JSON.parse(obj.medical_terms || '[]'),
      doctor_questions: JSON.parse(obj.doctor_questions || '[]'),
    };
  });
}

export async function getAnalysisByIdFromDb(id: string): Promise<AnalysisRecord | null> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM analyses WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return {
      id: row.id,
      title: row.title,
      original_text: row.original_text,
      explanation_level: row.explanation_level,
      language: row.language,
      category: row.category,
      simple_explanation: row.simple_explanation,
      key_information: JSON.parse(row.key_information || '[]'),
      medical_terms: JSON.parse(row.medical_terms || '[]'),
      doctor_questions: JSON.parse(row.doctor_questions || '[]'),
      created_at: row.created_at,
    };
  }
  stmt.free();
  return null;
}

export async function deleteAnalysisFromDb(id: string): Promise<boolean> {
  const db = await getDatabase();
  const stmt = db.prepare("DELETE FROM analyses WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  persistDatabase();
  return true;
}

export async function getAdminStatsFromDb() {
  const db = await getDatabase();
  const all = await getAllAnalysesFromDb();
  const total = all.length;

  const categoryMap: Record<string, number> = {};
  const termMap: Record<string, number> = {};
  const languageMap: Record<string, number> = {};
  const levelMap: Record<string, number> = { simple: 0, detailed: 0 };

  let totalChars = 0;

  all.forEach(rec => {
    categoryMap[rec.category] = (categoryMap[rec.category] || 0) + 1;
    languageMap[rec.language] = (languageMap[rec.language] || 0) + 1;
    levelMap[rec.explanation_level] = (levelMap[rec.explanation_level] || 0) + 1;
    totalChars += rec.original_text.length;

    rec.medical_terms?.forEach(t => {
      termMap[t.term] = (termMap[t.term] || 0) + 1;
    });
  });

  const topCategories = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topTerms = Object.entries(termMap)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalAnalyses: total,
    recentAnalyses: all.slice(0, 5),
    topCategories,
    topTerms,
    languageDistribution: languageMap,
    levelDistribution: levelMap,
    averageReportChars: total > 0 ? Math.round(totalChars / total) : 0,
  };
}
