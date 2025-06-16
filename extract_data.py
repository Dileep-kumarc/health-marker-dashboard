import fitz
import json
import os
import re
from datetime import datetime
from dateutil import parser

def validate_date(date_str):
    """Validate that a date is reasonable (not in future, not too old)."""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        now = datetime.now()
        # Check if date is not in future and not older than 10 years
        if date <= now and date >= now.replace(year=now.year - 10):
            return True
        print(f"Date {date_str} is outside reasonable range")
        return False
    except:
        print(f"Invalid date format: {date_str}")
        return False

def extract_date(text):
    """Extract date from the report text."""
    date_patterns = [
        r'Registration\s*:\s*(\d{2}/[A-Za-z]{3}/\d{4})',
        r'_(\d{4}_\d{2}_\d{2})_',
        r'Date\s*:\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})',
        r'Date\s*of\s*Report\s*:\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})'
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            try:
                date_str = match.group(1)
                parsed_date = parser.parse(date_str.replace('_', '/'))
                date_str = parsed_date.strftime('%Y-%m-%d')
                if validate_date(date_str):
                    return date_str
            except:
                continue
    return None

def clean_text(text):
    """Clean up text by removing extra spaces and normalizing line endings."""
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', text)
    # Remove spaces before newlines
    text = re.sub(r' \n', '\n', text)
    # Remove spaces after newlines
    text = re.sub(r'\n ', '\n', text)
    # Normalize multiple newlines to double newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text

def extract_section(text, section_name):
    """Extract a section from the text based on the section name."""
    if not section_name:
        return text
        
    patterns = [
        # Pattern for section with number
        rf"{section_name}\s*\d*.*?(?=\n\n[A-Z][A-Z\s]+(?:\d+)?[,\n]|\Z)",
        # Pattern for section without number
        rf"{section_name}.*?(?=\n\n[A-Z][A-Z\s]+(?:\d+)?[,\n]|\Z)"
    ]
    
    for pattern in patterns:
        section_match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if section_match:
            section = section_match.group(0)
            print(f"\nFound section: {section_name}")
            print("-" * 40)
            print(section[:200] + "...")  # Print first 200 chars of section
            return section
    
    return text

def extract_biomarker_value(text, marker, section_name=None):
    """Extract biomarker value using regex patterns."""
    # Get the relevant section
    text = extract_section(text, section_name)
    text = clean_text(text)
    
    # First try to find exact matches with units
    exact_patterns = [
        # Method and value pattern (most common in these reports)
        rf"Method:.*?\n\s*(\d+\.?\d*)\s*(?:mg/dl|ng/ml|µg/dl|g/dl|%|pg/mL)[^\n]*\n[^\n]*{re.escape(marker)}",
        # Value after marker
        rf"{re.escape(marker)}.*?(\d+\.?\d*)\s*(?:mg/dl|ng/ml|µg/dl|g/dl|%|pg/mL)",
        # Value on next line after marker
        rf"{re.escape(marker)}.*?\n\s*(\d+\.?\d*)\s*(?:mg/dl|ng/ml|µg/dl|g/dl|%|pg/mL)"
    ]
    
    # Then try more general patterns
    general_patterns = [
        rf"{re.escape(marker)}\s*(\d+\.?\d*)",
        rf"{re.escape(marker)}.*?\n\s*(\d+\.?\d*)",
        rf"Method:.*?\n\s*(\d+\.?\d*)[^\n]*\n[^\n]*{re.escape(marker)}"
    ]
    
    # Try exact patterns first
    for pattern in exact_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
        for match in matches:
            try:
                value = float(match.group(1))
                context = text[max(0, match.start()-50):min(len(text), match.end()+50)]
                print(f"\nPotential match for {marker}:")
                print(f"Pattern: {pattern}")
                print(f"Value: {value}")
                print(f"Context: {context}")
                
                if validate_biomarker_value(marker, value):
                    return value
            except:
                continue
    
    # If no exact matches, try general patterns
    for pattern in general_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
        for match in matches:
            try:
                value = float(match.group(1))
                context = text[max(0, match.start()-50):min(len(text), match.end()+50)]
                print(f"\nPotential match for {marker} (general pattern):")
                print(f"Pattern: {pattern}")
                print(f"Value: {value}")
                print(f"Context: {context}")
                
                if validate_biomarker_value(marker, value):
                    return value
            except:
                continue
    
    return None

def validate_biomarker_value(marker, value):
    """Validate that a biomarker value is within reasonable ranges."""
    ranges = {
        'Total Cholesterol': (100, 500),    # mg/dL
        'HDL': (20, 100),                   # mg/dL
        'LDL': (30, 300),                   # mg/dL
        'Triglycerides': (30, 1000),        # mg/dL
        'Creatinine': (0.3, 4.0),           # mg/dL - updated to more realistic range
        'Vitamin D': (5, 150),              # ng/mL
        'Vitamin B12': (150, 2000),         # pg/mL - updated minimum value
        'HbA1c': (3, 15),                   # %
        'Glucose': (50, 500),               # mg/dL
        'ALT': (0, 500),                    # U/L
        'AST': (0, 500),                    # U/L
    }
    
    if marker in ranges:
        min_val, max_val = ranges[marker]
        if min_val <= value <= max_val:
            return True
        print(f"WARNING: Value {value} is outside reasonable range for {marker}: {min_val}-{max_val}")
        return False
    return True

def ensure_consistent_biomarkers(data):
    """Ensure all entries have the same biomarkers, using None for missing values."""
    all_biomarkers = set()
    # First pass: collect all biomarker names
    for entry in data:
        all_biomarkers.update(key for key in entry.keys() if key != 'date')
    
    # Second pass: fill in missing values
    for entry in data:
        for marker in all_biomarkers:
            if marker not in entry:
                entry[marker] = None
                print(f"Added missing biomarker {marker} as None for date {entry.get('date')}")
    
    return data

def process_pdf(file_path):
    """Process a single PDF file and extract biomarker values."""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    date = extract_date(text)
    if not date:
        print(f"WARNING: Could not extract valid date from {file_path}")
        return None
        
    data = {
        "date": date
    }
    
    biomarkers = {
        'Total Cholesterol': {
            'names': ['TOTAL CHOLESTEROL', 'CHOLESTEROL'],
            'section': 'LIPID PROFILE'
        },
        'HDL': {
            'names': ['H D L CHOLESTEROL', 'HDL CHOLESTEROL', 'HDL-C'],
            'section': 'LIPID PROFILE'
        },
        'LDL': {
            'names': ['L D L CHOLESTEROL', 'LDL CHOLESTEROL', 'LDL-C'],
            'section': 'LIPID PROFILE'
        },
        'Triglycerides': {
            'names': ['TRIGLYCERIDES'],
            'section': 'LIPID PROFILE'
        },
        'Creatinine': {
            'names': ['CREATININE'],
            'section': 'RENAL FUNCTION TEST'
        },
        'Vitamin D': {
            'names': ['VITAMIN D', 'VIT D', '25-OH VITAMIN D'],
            'section': None
        },
        'Vitamin B12': {
            'names': ['VITAMIN B12', 'VIT B12'],
            'section': None
        },
        'HbA1c': {
            'names': ['HBA1C', 'GLYCATED HEMOGLOBIN'],
            'section': None
        }
    }

    for marker, info in biomarkers.items():
        for name in info['names']:
            value = extract_biomarker_value(text, name, info['section'])
            if value is not None:
                data[marker] = value
                break
    
    doc.close()
    return data

def main():
    input_dir = "sample_reports"
    output_file = "data/extracted_data.json"
    static_output = "static/extracted_data.json"
    
    data = []
    
    for filename in os.listdir(input_dir):
        if filename.endswith(".pdf"):
            file_path = os.path.join(input_dir, filename)
            print(f"\nProcessing {filename}...")
            
            report_data = process_pdf(file_path)
            if report_data:
                data.append(report_data)
    
    if data:
        # Sort by date and ensure consistent biomarkers
        data.sort(key=lambda x: x['date'])
        data = ensure_consistent_biomarkers(data)
        
        # Save to data directory
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"\nSaved extracted data to {output_file}")
        
        # Save to static directory for web access
        os.makedirs(os.path.dirname(static_output), exist_ok=True)
        with open(static_output, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Saved extracted data to {static_output}")
    else:
        print("No valid data was extracted from the PDFs")