export interface ComprehensiveBiomarkerData {
  date: string
  // Existing biomarkers
  totalCholesterol: number
  hdlCholesterol: number
  ldlCholesterol: number
  triglycerides: number
  creatinine: number
  vitaminD: number
  vitaminB12: number
  hba1c: number

  // Complete Blood Count
  hemoglobin: number
  rbcCount: number
  hematocrit: number
  mcv: number
  mch: number
  mchc: number
  wbcCount: number
  neutrophils: number
  lymphocytes: number
  monocytes: number
  eosinophils: number
  basophils: number
  plateletCount: number
  esr: number

  // Liver Function
  totalProtein: number
  albumin: number
  globulin: number
  totalBilirubin: number
  directBilirubin: number
  indirectBilirubin: number
  alkalinePhosphatase: number
  sgot: number
  sgpt: number
  ggt: number

  // Kidney Function Extended
  urea: number
  bun: number
  uricAcid: number
  sodium: number
  potassium: number
  chloride: number

  // Thyroid Function
  t3: number
  t4: number
  tsh: number

  // Iron Studies
  serumIron: number
  tibc: number
  transferrinSaturation: number

  // Additional Minerals
  calcium: number
  magnesium: number
  phosphorus: number

  // Glucose
  fastingGlucose: number

  // Cardiac
  troponinI: number

  // Prostate (for males)
  psa: number

  // Vitamins Extended
  folicAcid: number
}

export const comprehensiveData: ComprehensiveBiomarkerData[] = [
  {
    date: "2023-11-20",
    // Existing data
    totalCholesterol: 132,
    hdlCholesterol: 35,
    ldlCholesterol: 72,
    triglycerides: 195,
    creatinine: 1.19,
    vitaminD: 39.7,
    vitaminB12: 366,
    hba1c: 5.5,

    // New comprehensive data
    hemoglobin: 16.0,
    rbcCount: 5.75,
    hematocrit: 46.2,
    mcv: 80.3,
    mch: 27.8,
    mchc: 34.6,
    wbcCount: 8.6,
    neutrophils: 50.4,
    lymphocytes: 38.4,
    monocytes: 2.9,
    eosinophils: 7.7,
    basophils: 0.3,
    plateletCount: 178,
    esr: 24,

    totalProtein: 7.31,
    albumin: 4.43,
    globulin: 2.88,
    totalBilirubin: 0.7,
    directBilirubin: 0.14,
    indirectBilirubin: 0.56,
    alkalinePhosphatase: 59.95,
    sgot: 18.9,
    sgpt: 30,
    ggt: 22.4,

    urea: 19.26,
    bun: 9,
    uricAcid: 7.61,
    sodium: 139.79,
    potassium: 3.93,
    chloride: 105.78,

    t3: 92,
    t4: 7.37,
    tsh: 3.603,

    serumIron: 80.7,
    tibc: 302,
    transferrinSaturation: 26.72,

    calcium: 9.9,
    magnesium: 2.12,
    phosphorus: 4.44,

    fastingGlucose: 103,
    troponinI: 2.1,
    psa: 4.66,
    folicAcid: 3.42,
  },
  {
    date: "2025-04-05",
    // Updated values based on the latest report
    totalCholesterol: 136,
    hdlCholesterol: 36,
    ldlCholesterol: 65,
    triglycerides: 177,
    creatinine: 1.18,
    vitaminD: 18.73,
    vitaminB12: 259,
    hba1c: 5.8,

    hemoglobin: 15.2,
    rbcCount: 5.83,
    hematocrit: 46.6,
    mcv: 80,
    mch: 26,
    mchc: 33,
    wbcCount: 7.87,
    neutrophils: 51.0,
    lymphocytes: 32.99,
    monocytes: 6.5,
    eosinophils: 9.22,
    basophils: 0.29,
    plateletCount: 166,
    esr: 24,

    totalProtein: 7.01,
    albumin: 4.09,
    globulin: 2.92,
    totalBilirubin: 0.79,
    directBilirubin: 0.16,
    indirectBilirubin: 0.63,
    alkalinePhosphatase: 68,
    sgot: 19,
    sgpt: 31,
    ggt: 20,

    urea: 21,
    bun: 9.81,
    uricAcid: 6.8,
    sodium: 138.7,
    potassium: 3.93,
    chloride: 98.6,

    t3: 95,
    t4: 11.56,
    tsh: 4.75,

    serumIron: 79,
    tibc: 302,
    transferrinSaturation: 26.72,

    calcium: 9.2,
    magnesium: 1.84,
    phosphorus: 4.0,

    fastingGlucose: 98,
    troponinI: 2.1,
    psa: 4.66,
    folicAcid: 3.42,
  },
]

export interface BiomarkerCategory {
  name: string
  icon: string
  biomarkers: string[]
  description: string
}

export const biomarkerCategories: BiomarkerCategory[] = [
  {
    name: "Lipid Profile",
    icon: "Heart",
    biomarkers: ["totalCholesterol", "hdlCholesterol", "ldlCholesterol", "triglycerides"],
    description: "Cardiovascular risk assessment and lipid metabolism",
  },
  {
    name: "Complete Blood Count",
    icon: "Droplets",
    biomarkers: [
      "hemoglobin",
      "rbcCount",
      "hematocrit",
      "mcv",
      "mch",
      "mchc",
      "wbcCount",
      "neutrophils",
      "lymphocytes",
      "monocytes",
      "eosinophils",
      "basophils",
      "plateletCount",
      "esr",
    ],
    description: "Blood cell analysis and hematological assessment",
  },
  {
    name: "Liver Function",
    icon: "Activity",
    biomarkers: [
      "totalProtein",
      "albumin",
      "globulin",
      "totalBilirubin",
      "directBilirubin",
      "indirectBilirubin",
      "alkalinePhosphatase",
      "sgot",
      "sgpt",
      "ggt",
    ],
    description: "Hepatic function and liver enzyme assessment",
  },
  {
    name: "Kidney Function",
    icon: "Filter",
    biomarkers: ["creatinine", "urea", "bun", "uricAcid"],
    description: "Renal function and waste product clearance",
  },
  {
    name: "Thyroid Function",
    icon: "Zap",
    biomarkers: ["t3", "t4", "tsh"],
    description: "Thyroid hormone regulation and metabolism",
  },
  {
    name: "Iron Studies",
    icon: "Magnet",
    biomarkers: ["serumIron", "tibc", "transferrinSaturation"],
    description: "Iron metabolism and anemia assessment",
  },
  {
    name: "Electrolytes",
    icon: "Waves",
    biomarkers: ["sodium", "potassium", "chloride"],
    description: "Fluid balance and electrolyte homeostasis",
  },
  {
    name: "Minerals & Vitamins",
    icon: "Pill",
    biomarkers: ["calcium", "magnesium", "phosphorus", "vitaminD", "vitaminB12", "folicAcid"],
    description: "Essential nutrients and mineral balance",
  },
  {
    name: "Glucose & Cardiac",
    icon: "HeartPulse",
    biomarkers: ["fastingGlucose", "hba1c", "troponinI"],
    description: "Diabetes monitoring and cardiac risk assessment",
  },
  {
    name: "Specialized Tests",
    icon: "Microscope",
    biomarkers: ["psa"],
    description: "Specialized screening and diagnostic markers",
  },
]

export const comprehensiveBiomarkerInfo = {
  // Existing biomarkers (enhanced)
  totalCholesterol: {
    name: "Total Cholesterol",
    unit: "mg/dL",
    normalRange: "< 200",
    category: "Lipid Profile",
    description: "Total amount of cholesterol in blood",
    clinicalSignificance: "Primary screening tool for cardiovascular risk assessment",
    interpretation: {
      optimal: "< 200 mg/dL - Desirable level",
      borderline: "200-239 mg/dL - Borderline high",
      high: "≥ 240 mg/dL - High risk",
    },
    factors: "Diet, genetics, age, physical activity, medications",
    recommendations: "Low saturated fat diet, regular exercise, weight management",
  },

  // Complete Blood Count
  hemoglobin: {
    name: "Hemoglobin",
    unit: "g/dL",
    normalRange: "13.0-17.0 (M), 12.0-15.5 (F)",
    category: "Complete Blood Count",
    description: "Oxygen-carrying protein in red blood cells",
    clinicalSignificance: "Essential for oxygen transport throughout the body",
    interpretation: {
      low: "< 13.0 g/dL (M), < 12.0 g/dL (F) - Anemia",
      normal: "13.0-17.0 g/dL (M), 12.0-15.5 g/dL (F) - Normal",
      high: "> 17.0 g/dL (M), > 15.5 g/dL (F) - Polycythemia",
    },
    factors: "Iron deficiency, chronic disease, blood loss, kidney disease",
    recommendations: "Iron-rich foods, vitamin C, treat underlying causes",
  },

  rbcCount: {
    name: "RBC Count",
    unit: "million/cmm",
    normalRange: "4.50-5.50",
    category: "Complete Blood Count",
    description: "Number of red blood cells per unit volume",
    clinicalSignificance: "Indicates oxygen-carrying capacity of blood",
    interpretation: {
      low: "< 4.50 - Anemia, blood loss",
      normal: "4.50-5.50 - Normal range",
      high: "> 5.50 - Polycythemia, dehydration",
    },
    factors: "Altitude, smoking, kidney disease, bone marrow disorders",
    recommendations: "Adequate hydration, iron supplementation if deficient",
  },

  wbcCount: {
    name: "WBC Count",
    unit: "cells/cmm",
    normalRange: "4000-11000",
    category: "Complete Blood Count",
    description: "White blood cell count indicating immune system status",
    clinicalSignificance: "Primary indicator of immune system function and infection",
    interpretation: {
      low: "< 4000 - Immunosuppression, bone marrow disorders",
      normal: "4000-11000 - Normal immune function",
      high: "> 11000 - Infection, inflammation, leukemia",
    },
    factors: "Infections, medications, stress, autoimmune diseases",
    recommendations: "Treat underlying infections, avoid immunosuppressive factors",
  },

  plateletCount: {
    name: "Platelet Count",
    unit: "Lakh/cmm",
    normalRange: "1.50-4.00",
    category: "Complete Blood Count",
    description: "Blood clotting cells essential for hemostasis",
    clinicalSignificance: "Critical for blood clotting and wound healing",
    interpretation: {
      low: "< 1.50 - Thrombocytopenia, bleeding risk",
      normal: "1.50-4.00 - Normal clotting function",
      high: "> 4.00 - Thrombocytosis, clotting risk",
    },
    factors: "Bone marrow disorders, medications, autoimmune diseases",
    recommendations: "Avoid blood thinners if low, monitor for bleeding",
  },

  // Liver Function Tests
  sgot: {
    name: "SGOT (AST)",
    unit: "U/L",
    normalRange: "< 50",
    category: "Liver Function",
    description: "Aspartate aminotransferase - liver enzyme",
    clinicalSignificance: "Indicates liver cell damage or muscle injury",
    interpretation: {
      normal: "< 50 U/L - Normal liver function",
      elevated: "50-100 U/L - Mild liver damage",
      high: "> 100 U/L - Significant liver injury",
    },
    factors: "Alcohol, medications, viral hepatitis, muscle damage",
    recommendations: "Avoid alcohol, hepatotoxic drugs, regular monitoring",
  },

  sgpt: {
    name: "SGPT (ALT)",
    unit: "U/L",
    normalRange: "< 50",
    category: "Liver Function",
    description: "Alanine aminotransferase - liver-specific enzyme",
    clinicalSignificance: "More specific indicator of liver cell damage than AST",
    interpretation: {
      normal: "< 50 U/L - Normal liver function",
      elevated: "50-100 U/L - Mild hepatocellular injury",
      high: "> 100 U/L - Significant liver damage",
    },
    factors: "Fatty liver, viral hepatitis, medications, alcohol",
    recommendations: "Weight loss, avoid alcohol, treat underlying liver disease",
  },

  // Thyroid Function
  tsh: {
    name: "TSH",
    unit: "μIU/mL",
    normalRange: "0.50-8.90",
    category: "Thyroid Function",
    description: "Thyroid stimulating hormone from pituitary gland",
    clinicalSignificance: "Primary screening test for thyroid function disorders",
    interpretation: {
      low: "< 0.50 - Hyperthyroidism",
      normal: "0.50-8.90 - Normal thyroid function",
      high: "> 8.90 - Hypothyroidism",
    },
    factors: "Age, medications, stress, autoimmune diseases",
    recommendations: "Regular monitoring, thyroid hormone replacement if needed",
  },

  t3: {
    name: "T3 (Triiodothyronine)",
    unit: "ng/dL",
    normalRange: "58-159",
    category: "Thyroid Function",
    description: "Active thyroid hormone regulating metabolism",
    clinicalSignificance: "Most metabolically active thyroid hormone",
    interpretation: {
      low: "< 58 - Hypothyroidism",
      normal: "58-159 - Normal thyroid function",
      high: "> 159 - Hyperthyroidism",
    },
    factors: "Thyroid disease, medications, severe illness",
    recommendations: "Thyroid hormone therapy if deficient",
  },

  t4: {
    name: "T4 (Thyroxine)",
    unit: "μg/dL",
    normalRange: "4.87-11.72",
    category: "Thyroid Function",
    description: "Primary thyroid hormone produced by thyroid gland",
    clinicalSignificance: "Precursor to active T3 hormone",
    interpretation: {
      low: "< 4.87 - Hypothyroidism",
      normal: "4.87-11.72 - Normal thyroid function",
      high: "> 11.72 - Hyperthyroidism",
    },
    factors: "Thyroid disorders, medications, pregnancy",
    recommendations: "Thyroid hormone replacement therapy if indicated",
  },

  // Iron Studies
  serumIron: {
    name: "Serum Iron",
    unit: "μg/dL",
    normalRange: "70-180 (M), 50-170 (F)",
    category: "Iron Studies",
    description: "Amount of iron bound to transferrin in blood",
    clinicalSignificance: "Indicates iron availability for cellular functions",
    interpretation: {
      low: "< 70 μg/dL - Iron deficiency",
      normal: "70-180 μg/dL - Adequate iron stores",
      high: "> 180 μg/dL - Iron overload",
    },
    factors: "Diet, blood loss, absorption disorders, chronic disease",
    recommendations: "Iron-rich foods, vitamin C, treat underlying causes",
  },

  // Add more biomarkers as needed...
  fastingGlucose: {
    name: "Fasting Glucose",
    unit: "mg/dL",
    normalRange: "70-100",
    category: "Glucose Metabolism",
    description: "Blood sugar level after 8-12 hours of fasting",
    clinicalSignificance: "Primary screening test for diabetes mellitus",
    interpretation: {
      normal: "70-100 mg/dL - Normal glucose metabolism",
      prediabetes: "101-125 mg/dL - Prediabetes",
      diabetes: "≥ 126 mg/dL - Diabetes mellitus",
    },
    factors: "Diet, physical activity, medications, stress, illness",
    recommendations: "Healthy diet, regular exercise, weight management",
  },

  psa: {
    name: "PSA (Prostate Specific Antigen)",
    unit: "ng/mL",
    normalRange: "0-4",
    category: "Specialized Tests",
    description: "Protein produced by prostate gland cells",
    clinicalSignificance: "Screening marker for prostate cancer and BPH",
    interpretation: {
      normal: "0-4 ng/mL - Normal prostate function",
      borderline: "4-10 ng/mL - Requires further evaluation",
      high: "> 10 ng/mL - High suspicion for prostate cancer",
    },
    factors: "Age, prostate size, inflammation, recent procedures",
    recommendations: "Regular screening after age 50, urological consultation if elevated",
  },
}
