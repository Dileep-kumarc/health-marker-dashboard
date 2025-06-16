import re
import json
from datetime import datetime

def extract_biomarker_data(report_text):
    """
    Extract biomarker data from health report text
    This simulates the PDF extraction process
    """
    
    # Sample extraction patterns (would be more complex for real PDF parsing)
    patterns = {
        'total_cholesterol': r'TOTAL CHOLESTEROL.*?(\d+\.?\d*)\s*mg/dl',
        'hdl_cholesterol': r'HDL CHOLESTEROL.*?(\d+\.?\d*)\s*mg/dl',
        'ldl_cholesterol': r'LDL CHOLESTEROL.*?(\d+\.?\d*)\s*mg/dl',
        'triglycerides': r'TRIGLYCERIDES.*?(\d+\.?\d*)\s*mg/dl',
        'creatinine': r'CREATININE.*?(\d+\.?\d*)\s*mg/dl',
        'vitamin_d': r'VITAMIN D.*?(\d+\.?\d*)\s*ng/ml',
        'vitamin_b12': r'VITAMIN B12.*?(\d+\.?\d*)\s*pg/mL',
        'hba1c': r'HbA1c.*?(\d+\.?\d*)\s*%'
    }
    
    extracted_data = {}
    
    # Sample data from the provided reports
    sample_reports = [
        {
            'date': '2023-11-20',
            'total_cholesterol': 132,
            'hdl_cholesterol': 35,
            'ldl_cholesterol': 72,
            'triglycerides': 195,
            'creatinine': 1.19,
            'vitamin_d': 39.7,
            'vitamin_b12': 366,
            'hba1c': 5.5
        },
        {
            'date': '2025-04-05',
            'total_cholesterol': 136,
            'hdl_cholesterol': 36,
            'ldl_cholesterol': 65,
            'triglycerides': 177,
            'creatinine': 1.18,
            'vitamin_d': 18.73,
            'vitamin_b12': 259,
            'hba1c': 5.80
        }
    ]
    
    print("Biomarker Data Extraction Results:")
    print("=" * 50)
    
    for i, report in enumerate(sample_reports, 1):
        print(f"\nReport {i} - Date: {report['date']}")
        print("-" * 30)
        
        for key, value in report.items():
            if key != 'date':
                # Determine clinical status
                status = get_clinical_status(key, value)
                print(f"{key.replace('_', ' ').title()}: {value} - {status}")
    
    # Generate JSON output for dashboard
    json_output = json.dumps(sample_reports, indent=2)
    print(f"\nJSON Output for Dashboard:")
    print(json_output)
    
    return sample_reports

def get_clinical_status(parameter, value):
    """Determine clinical status based on reference ranges"""
    
    ranges = {
        'total_cholesterol': {'optimal': (0, 200), 'borderline': (200, 239), 'high': (240, 500)},
        'hdl_cholesterol': {'optimal': (40, 60), 'borderline': (35, 39), 'low': (0, 34)},
        'ldl_cholesterol': {'optimal': (0, 100), 'borderline': (100, 129), 'high': (130, 500)},
        'triglycerides': {'optimal': (0, 150), 'borderline': (150, 199), 'high': (200, 500)},
        'creatinine': {'optimal': (0.70, 1.18), 'high': (1.19, 5.0)},
        'vitamin_d': {'optimal': (30, 100), 'insufficient': (20, 29), 'deficient': (0, 19)},
        'vitamin_b12': {'optimal': (211, 911), 'borderline': (150, 210), 'deficient': (0, 149)},
        'hba1c': {'optimal': (4.0, 5.6), 'prediabetic': (5.7, 6.4), 'diabetic': (6.5, 15.0)}
    }
    
    if parameter not in ranges:
        return "Unknown"
    
    param_ranges = ranges[parameter]
    
    for status, (min_val, max_val) in param_ranges.items():
        if min_val <= value <= max_val:
            return status.upper()
    
    return "OUT_OF_RANGE"

# Execute the extraction
if __name__ == "__main__":
    # This would normally process actual PDF files
    # For demo purposes, we're using the extracted data from the provided reports
    
    print("EcoTown Health Tech - Biomarker Data Extraction")
    print("Processing health reports...")
    
    extracted_data = extract_biomarker_data("")
    
    print(f"\nExtraction completed successfully!")
    print(f"Total reports processed: {len(extracted_data)}")
    print("\nData ready for dashboard visualization!")
