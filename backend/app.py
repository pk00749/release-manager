from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import os
from config import VERSIONS, JSON_TEMPLATE

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

def ensure_version_file(version):
    filename = f"version_{version.replace('.', '_')}.json"
    filepath = os.path.join('versions', filename)
    
    if not os.path.exists('versions'):
        os.makedirs('versions')
    
    if not os.path.exists(filepath):
        data = JSON_TEMPLATE.copy()
        data['version'] = version
        data['release_date'] = datetime.now().strftime('%Y-%m-%d')
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
    
    return filepath

@app.route('/api/versions', methods=['GET'])
def get_versions():
    return jsonify(VERSIONS)

@app.route('/api/version/<version>', methods=['GET'])
def get_version_info(version):
    filepath = ensure_version_file(version)
    with open(filepath, 'r') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/api/version/<version>', methods=['PUT'])
def update_version_info(version):
    filepath = ensure_version_file(version)
    data = request.json
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=4)
    
    return jsonify({"message": "Version updated successfully"})

if __name__ == '__main__':
    app.run(debug=True)