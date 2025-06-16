export interface BiomarkerData {
  date: string
  totalCholesterol: number
  hdlCholesterol: number
  ldlCholesterol: number
  triglycerides: number
  creatinine: number
  vitaminD: number
  vitaminB12: number
  hba1c: number
}

export interface ClinicalRange {
  parameter: string
  optimal: { min: number; max: number }
  borderline?: { min: number; max: number }
  high: { min: number; max: number }
  unit: string
}

// Enhanced sample data with more realistic fluctuations for triglycerides
export const sampleBiomarkerData: BiomarkerData[] = [
  {
    date: "2023-11-20",
    totalCholesterol: 132,
    hdlCholesterol: 35,
    ldlCholesterol: 72,
    triglycerides: 195,
    creatinine: 1.19,
    vitaminD: 39.7,
    vitaminB12: 366,
    hba1c: 5.5,
  },
  {
    date: "2024-01-15",
    totalCholesterol: 128,
    hdlCholesterol: 37,
    ldlCholesterol: 68,
    triglycerides: 210,
    creatinine: 1.17,
    vitaminD: 32.1,
    vitaminB12: 342,
    hba1c: 5.4,
  },
  {
    date: "2024-03-10",
    totalCholesterol: 135,
    hdlCholesterol: 34,
    ldlCholesterol: 75,
    triglycerides: 185,
    creatinine: 1.2,
    vitaminD: 28.5,
    vitaminB12: 358,
    hba1c: 5.6,
  },
  {
    date: "2024-05-22",
    totalCholesterol: 130,
    hdlCholesterol: 38,
    ldlCholesterol: 70,
    triglycerides: 198,
    creatinine: 1.18,
    vitaminD: 25.3,
    vitaminB12: 371,
    hba1c: 5.5,
  },
  {
    date: "2024-07-18",
    totalCholesterol: 134,
    hdlCholesterol: 36,
    ldlCholesterol: 73,
    triglycerides: 175,
    creatinine: 1.19,
    vitaminD: 22.8,
    vitaminB12: 365,
    hba1c: 5.7,
  },
  {
    date: "2024-09-25",
    totalCholesterol: 138,
    hdlCholesterol: 35,
    ldlCholesterol: 78,
    triglycerides: 205,
    creatinine: 1.21,
    vitaminD: 20.1,
    vitaminB12: 349,
    hba1c: 5.8,
  },
  {
    date: "2024-11-30",
    totalCholesterol: 133,
    hdlCholesterol: 39,
    ldlCholesterol: 69,
    triglycerides: 188,
    creatinine: 1.17,
    vitaminD: 18.9,
    vitaminB12: 356,
    hba1c: 5.6,
  },
  {
    date: "2025-01-20",
    totalCholesterol: 131,
    hdlCholesterol: 37,
    ldlCholesterol: 71,
    triglycerides: 192,
    creatinine: 1.18,
    vitaminD: 19.5,
    vitaminB12: 362,
    hba1c: 5.5,
  },
  {
    date: "2025-04-05",
    totalCholesterol: 136,
    hdlCholesterol: 36,
    ldlCholesterol: 65,
    triglycerides: 177,
    creatinine: 1.18,
    vitaminD: 18.73,
    vitaminB12: 259,
    hba1c: 5.8,
  },
]

// Clinical reference ranges based on the reports
export const clinicalRanges: Record<string, ClinicalRange> = {
  totalCholesterol: {
    parameter: "Total Cholesterol",
    optimal: { min: 0, max: 200 },
    borderline: { min: 200, max: 239 },
    high: { min: 240, max: 500 },
    unit: "mg/dL",
  },
  hdlCholesterol: {
    parameter: "HDL Cholesterol",
    optimal: { min: 40, max: 60 },
    borderline: { min: 35, max: 39 },
    high: { min: 0, max: 34 },
    unit: "mg/dL",
  },
  ldlCholesterol: {
    parameter: "LDL Cholesterol",
    optimal: { min: 0, max: 100 },
    borderline: { min: 100, max: 129 },
    high: { min: 130, max: 500 },
    unit: "mg/dL",
  },
  triglycerides: {
    parameter: "Triglycerides",
    optimal: { min: 0, max: 150 },
    borderline: { min: 150, max: 199 },
    high: { min: 200, max: 500 },
    unit: "mg/dL",
  },
  creatinine: {
    parameter: "Creatinine",
    optimal: { min: 0.7, max: 1.18 },
    high: { min: 1.19, max: 5.0 },
    unit: "mg/dL",
  },
  vitaminD: {
    parameter: "Vitamin D",
    optimal: { min: 30, max: 100 },
    borderline: { min: 20, max: 29 },
    high: { min: 0, max: 19 },
    unit: "ng/mL",
  },
  vitaminB12: {
    parameter: "Vitamin B12",
    optimal: { min: 211, max: 911 },
    borderline: { min: 150, max: 210 },
    high: { min: 0, max: 149 },
    unit: "pg/mL",
  },
  hba1c: {
    parameter: "HbA1c",
    optimal: { min: 4.0, max: 5.6 },
    borderline: { min: 5.7, max: 6.4 },
    high: { min: 6.5, max: 15.0 },
    unit: "%",
  },
}

export function getRiskLevel(value: number, parameter: string): "optimal" | "borderline" | "high" {
  const range = clinicalRanges[parameter]
  if (!range) return "optimal"

  if (value >= range.optimal.min && value <= range.optimal.max) return "optimal"
  if (range.borderline && value >= range.borderline.min && value <= range.borderline.max) return "borderline"
  return "high"
}

export function getClinicalInterpretation(parameter: string, value: number): string {
  const riskLevel = getRiskLevel(value, parameter)
  const interpretations: Record<string, Record<string, string>> = {
    totalCholesterol: {
      optimal: "Desirable level - Continue healthy lifestyle",
      borderline: "Borderline high - Consider dietary changes",
      high: "High risk - Consult physician for treatment",
    },
    hdlCholesterol: {
      optimal: "Good protective level against heart disease",
      borderline: "Below optimal - Increase physical activity",
      high: "Low HDL - Major risk factor for heart disease",
    },
    ldlCholesterol: {
      optimal: "Optimal level - Low cardiovascular risk",
      borderline: "Near optimal - Monitor closely",
      high: "High risk - May require medication",
    },
    triglycerides: {
      optimal: "Normal level - Continue current lifestyle",
      borderline: "Borderline high - Reduce refined carbs",
      high: "High level - Significant cardiovascular risk",
    },
    creatinine: {
      optimal: "Normal kidney function",
      high: "Elevated - May indicate kidney dysfunction",
    },
    vitaminD: {
      optimal: "Sufficient vitamin D status",
      borderline: "Insufficient - Consider supplementation",
      high: "Deficient - Requires immediate supplementation",
    },
    vitaminB12: {
      optimal: "Adequate B12 levels",
      borderline: "Low normal - Monitor closely",
      high: "Deficient - Risk of anemia and neuropathy",
    },
    hba1c: {
      optimal: "Normal glucose control",
      borderline: "Prediabetic - Lifestyle intervention needed",
      high: "Diabetic - Requires medical management",
    },
  }

  return interpretations[parameter]?.[riskLevel] || "Consult healthcare provider"
}
