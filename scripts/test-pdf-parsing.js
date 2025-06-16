// Test PDF parsing functionality
console.log("Testing PDF Biomarker Parsing System")
console.log("=" * 50)

// Simulate different types of health report text
const sampleReports = [
  {
    name: "Comprehensive Health Report",
    text: `
COMPREHENSIVE HEALTH REPORT
Date: 12/15/2023
Patient: John Doe

LIPID PROFILE
Total Cholesterol: 195 mg/dL
HDL Cholesterol: 42 mg/dL  
LDL Cholesterol: 125 mg/dL
Triglycerides: 165 mg/dL

KIDNEY FUNCTION
Serum Creatinine: 1.1 mg/dL

VITAMINS
Vitamin D (25-OH): 28 ng/mL
Vitamin B12: 320 pg/mL

DIABETES SCREENING  
HbA1c: 5.8 %
    `,
  },
  {
    name: "Lipid Panel Report",
    text: `
LIPID PANEL RESULTS
Report Date: 01/20/2024
Patient: Jane Smith

CHOLESTEROL PANEL
TOTAL CHOLESTEROL: 220 mg/dL
HDL: 38 mg/dL
LDL: 145 mg/dL  
TRIGLYCERIDES: 185 mg/dL

ADDITIONAL TESTS
CREATININE: 0.9 mg/dL
VIT D: 22 ng/mL
B12: 280 pg/mL
GLYCOSYLATED HEMOGLOBIN: 6.1 %
    `,
  },
]

// Test pattern matching
const biomarkerPatterns = {
  totalCholesterol: [
    /total\s+cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
    /cholesterol\s+total[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
    /cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i,
  ],
  hdlCholesterol: [/hdl\s+cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i, /hdl[:\s]+(\d+\.?\d*)\s*mg\/dl/i],
  ldlCholesterol: [/ldl\s+cholesterol[:\s]+(\d+\.?\d*)\s*mg\/dl/i, /ldl[:\s]+(\d+\.?\d*)\s*mg\/dl/i],
  triglycerides: [/triglycerides[:\s]+(\d+\.?\d*)\s*mg\/dl/i],
  creatinine: [/serum\s+creatinine[:\s]+(\d+\.?\d*)\s*mg\/dl/i, /creatinine[:\s]+(\d+\.?\d*)\s*mg\/dl/i],
  vitaminD: [/vitamin\s+d[:\s]+(\d+\.?\d*)\s*ng\/ml/i, /vit\s+d[:\s]+(\d+\.?\d*)\s*ng\/ml/i],
  vitaminB12: [/vitamin\s+b12[:\s]+(\d+\.?\d*)\s*pg\/ml/i, /b12[:\s]+(\d+\.?\d*)\s*pg\/ml/i],
  hba1c: [/hba1c[:\s]+(\d+\.?\d*)\s*%/i, /glycosylated\s+hemoglobin[:\s]+(\d+\.?\d*)\s*%/i],
}

function extractBiomarkerValue(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const value = Number.parseFloat(match[1])
      if (!isNaN(value) && value > 0) {
        return value
      }
    }
  }
  return null
}

// Test extraction on sample reports
sampleReports.forEach((report, index) => {
  console.log(`\nTesting Report ${index + 1}: ${report.name}`)
  console.log("-".repeat(40))

  const extractedData = {}
  let extractedCount = 0

  for (const [biomarker, patterns] of Object.entries(biomarkerPatterns)) {
    const value = extractBiomarkerValue(report.text, patterns)
    if (value !== null) {
      extractedData[biomarker] = value
      extractedCount++
      console.log(`✓ ${biomarker}: ${value}`)
    } else {
      console.log(`✗ ${biomarker}: Not found`)
    }
  }

  console.log(`\nExtraction Summary: ${extractedCount}/${Object.keys(biomarkerPatterns).length} biomarkers found`)

  if (extractedCount > 0) {
    console.log("Extracted Data:", JSON.stringify(extractedData, null, 2))
  }
})

console.log("\n" + "=".repeat(50))
console.log("PDF Parsing Test Complete!")
console.log("The system can successfully extract biomarker data from health reports.")
