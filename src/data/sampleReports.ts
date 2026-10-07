export interface SampleReport {
  id: string;
  title: string;
  category: string;
  preview: string;
  text: string;
}

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: 'sample-cbc',
    title: 'Complete Blood Count (CBC) with Mild Anemia',
    category: 'Hematology',
    preview: 'WBC 6.8 K/uL, RBC 3.92 M/uL (Low), Hgb 10.4 g/dL (Low), MCV 74.5 fL (Low)...',
    text: `PATIENT REPORT: OUTPATIENT HEMATOLOGY PANEL
Specimen: Whole Blood (EDTA)
Patient ID: 884-9021-X
Collection Date: 10/04/2026

TEST RESULT BREAKDOWN:
- White Blood Cell Count (WBC): 6.8 K/uL [Reference: 4.5 - 11.0 K/uL] -> NORMAL
- Red Blood Cell Count (RBC): 3.92 M/uL [Reference: 4.20 - 5.80 M/uL] -> LOW
- Hemoglobin (Hgb): 10.4 g/dL [Reference: 12.0 - 15.5 g/dL] -> LOW
- Hematocrit (Hct): 31.8 % [Reference: 37.0 - 48.0 %] -> LOW
- Mean Corpuscular Volume (MCV): 74.5 fL [Reference: 80.0 - 100.0 fL] -> LOW
- Mean Corpuscular Hemoglobin (MCH): 24.1 pg [Reference: 27.0 - 33.0 pg] -> LOW
- RDW (Red Cell Distribution Width): 16.2 % [Reference: 11.5 - 14.5 %] -> HIGH
- Platelet Count: 284 K/uL [Reference: 150 - 450 K/uL] -> NORMAL

PATHOLOGIST IMPRESSION:
Peripheral smear reveals hypochromia and microcytosis. Morphologic features consistent with microcytic hypochromic red cell indices. Clinical correlation with serum ferritin, iron saturation, and total iron binding capacity (TIBC) recommended to evaluate for iron store depletion.`
  },
  {
    id: 'sample-cmp',
    title: 'Comprehensive Metabolic Panel (CMP) – Fasting Glucose & Kidney',
    category: 'Endocrinology & Nephrology',
    preview: 'Fasting Glucose 128 mg/dL (High), eGFR 84 mL/min, BUN 18 mg/dL, Creatinine 0.95 mg/dL...',
    text: `CLINICAL BIOCHEMISTRY LABORATORY
PANEL: Comprehensive Metabolic Panel (CMP - 14 tests)
Fasting Status: 10 hours overnight fasting confirmed

METABOLIC & ELECTROLYTES:
- Sodium: 139 mEq/L [Ref: 135 - 145 mEq/L] - NORMAL
- Potassium: 4.2 mEq/L [Ref: 3.5 - 5.1 mEq/L] - NORMAL
- Chloride: 101 mEq/L [Ref: 98 - 107 mEq/L] - NORMAL
- Carbon Dioxide (Bicarbonate): 25 mEq/L [Ref: 22 - 29 mEq/L] - NORMAL
- Calcium: 9.4 mg/dL [Ref: 8.5 - 10.2 mg/dL] - NORMAL
- Fasting Glucose: 128 mg/dL [Ref: 70 - 99 mg/dL] - HIGH (ELEVATED)

RENAL FUNCTION:
- Blood Urea Nitrogen (BUN): 18 mg/dL [Ref: 7 - 20 mg/dL] - NORMAL
- Serum Creatinine: 0.95 mg/dL [Ref: 0.60 - 1.20 mg/dL] - NORMAL
- Estimated GFR (eGFR non-African American): 84 mL/min/1.73m2 [Ref: >60 mL/min] - NORMAL

HEPATIC ENZYMES:
- Total Bilirubin: 0.7 mg/dL [Ref: 0.2 - 1.2 mg/dL] - NORMAL
- Total Protein: 7.1 g/dL [Ref: 6.0 - 8.3 g/dL] - NORMAL
- Albumin: 4.3 g/dL [Ref: 3.5 - 5.0 g/dL] - NORMAL
- Alkaline Phosphatase (ALP): 62 U/L [Ref: 44 - 121 U/L] - NORMAL
- AST (SGOT): 22 U/L [Ref: 10 - 40 U/L] - NORMAL
- ALT (SGPT): 26 U/L [Ref: 7 - 56 U/L] - NORMAL

CLINICAL COMMENT:
Isolated fasting hyperglycemia noted (128 mg/dL). Renal filtration and hepatic transaminases within normal physiological parameters. Recommend fasting repeat and glycated hemoglobin (HbA1c) determination for glycemic assessment.`
  },
  {
    id: 'sample-rx',
    title: 'Outpatient Prescription with Medical Abbreviations',
    category: 'Pharmacotherapy',
    preview: 'Rx 1: Metformin 500mg PO BID pc. Rx 2: Atorvastatin 20mg PO QHS. Rx 3: Omeprazole 20mg...',
    text: `CLINIC DISCHARGE PRESCRIPTION & DOSING INSTRUCTIONS
Prescribing Physician: Dr. Sarah Vance, MD
Date: October 5, 2026

PRESCRIPTION ORDERS:
1. Metformin HCl 500 mg tablets
Sig: 1 tab PO BID pc (with breakfast and dinner).
Dispense: #60 (sixty) tablets. Refills: 3.
Indication: Blood glucose modulation.

2. Atorvastatin calcium 20 mg oral tablets
Sig: 1 tab PO QHS.
Dispense: #30 (thirty) tablets. Refills: 3.
Indication: Lipid-lowering / hyperlipidemia management.

3. Omeprazole 20 mg delayed-release capsules
Sig: 1 cap PO QD ac (take 30-60 minutes prior to first morning meal).
Dispense: #30 (thirty) capsules. Refills: 1.
Indication: Gastroesophageal reflux protection.

PATIENT WARNINGS:
- Do not discontinue medications without discussing with your physician.
- Report any persistent muscle pain or dark urine immediately while taking Atorvastatin.`
  },
  {
    id: 'sample-cxr',
    title: 'Chest Radiograph (X-Ray) Diagnostic Report',
    category: 'Radiology',
    preview: 'Technique: PA and Lateral Chest. Cardiomediastinal silhouette normal. Clear lung fields...',
    text: `DEPARTMENT OF DIAGNOSTIC RADIOLOGY
EXAMINATION: CHEST RADIOGRAPH - 2 VIEWS (PA AND LATERAL)
CLINICAL INDICATION: 48-year-old with intermittent dry cough and mild dyspnea on exertion.

FINDINGS:
- The cardiomediastinal silhouette is within normal limits for size and contour.
- The trachea is midline.
- No focal consolidations, large pleural effusions, or pneumothorax identified.
- Mild bilateral peribronchial cuffing noted, non-specific, potentially reactive or post-viral bronchial wall thickening.
- The costophrenic sulci and cardiophrenic angles are sharp and clear bilaterally.
- Visualized osseous structures of the thorax demonstrate no acute fracture or osteolytic lesion.

IMPRESSION:
1. No acute cardiopulmonary process or pneumonia.
2. Mild non-specific peribronchial thickening, which can be correlated clinically with reactive airway changes or resolving upper respiratory illness.
3. Stable cardiac size.`
  }
];
