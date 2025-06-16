from flask import Flask, render_template, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='static')

def load_biomarker_data():
    """Load and process biomarker data from JSON file."""
    try:
        # First try to load from static directory
        static_path = os.path.join('static', 'extracted_data.json')
        if os.path.exists(static_path):
            with open(static_path, 'r') as f:
                data = json.load(f)
        else:
            # Fallback to data directory
            data_path = os.path.join('data', 'extracted_data.json')
            with open(data_path, 'r') as f:
                data = json.load(f)
                
            # Copy to static directory for future use
            os.makedirs('static', exist_ok=True)
            with open(static_path, 'w') as f:
                json.dump(data, f, indent=2)
        
        # Process and validate data
        processed_data = []
        for record in data:
            try:
                # Convert date string to datetime and back to ensure consistent format
                date_obj = datetime.strptime(record['date'], '%Y-%m-%d')
                processed_record = {
                    'date': date_obj.strftime('%Y-%m-%d'),
                    **{k: float(v) if isinstance(v, (int, float)) else None 
                       for k, v in record.items() if k != 'date'}
                }
                processed_data.append(processed_record)
            except (ValueError, TypeError) as e:
                print(f"Error processing record: {e}")
                continue
        
        # Sort by date
        processed_data.sort(key=lambda x: x['date'])
        return processed_data
                
    except Exception as e:
        print(f"Error loading biomarker data: {e}")
        return []

@app.route('/')
def index():
    """Render the main dashboard page."""
    return render_template('index.html')

@app.route('/data')
def get_data():
    """API endpoint to get biomarker data."""
    data = load_biomarker_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)