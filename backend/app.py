from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

def create_initial_version(service_id):
    """创建服务的初始版本文件"""
    versions_dir = os.path.join('versions', service_id)
    
    # 如果服务目录不存在，创建它
    if not os.path.exists(versions_dir):
        os.makedirs(versions_dir)
        
    # 创建初始版本文件
    initial_version = {
        "version": "1.0.0",
        "status": "not_started",
        "release_date": (datetime.now().replace(month=12, day=31)).strftime("%Y-%m-%d"),
        "test_result": "not_tested"
    }
    
    version_file = os.path.join(versions_dir, '1.0.0.json')
    with open(version_file, 'w') as f:
        json.dump(initial_version, f, indent=4)
    
    return initial_version

# 获取服务的版本列表
@app.route('/api/<service_id>/versions')
def get_service_versions(service_id):
    try:
        versions_dir = os.path.join('versions', service_id)
        
        # 如果服务目录不存在，创建初始版本
        if not os.path.exists(versions_dir):
            create_initial_version(service_id)
            
        # 列出目录下的所有json文件
        version_files = [f for f in os.listdir(versions_dir) if f.endswith('.json')]
        versions = [os.path.splitext(f)[0] for f in version_files]
        
        return jsonify(versions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取特定版本的详细信息
@app.route('/api/versions/<service_id>/<version>')
def get_version_detail(service_id, version):
    try:
        file_path = os.path.join('versions', service_id, f'{version}.json')
        
        # 如果文件不存在且是请求1.0.0版本，创建初始版本
        if not os.path.exists(file_path) and version == '1.0.0':
            version_data = create_initial_version(service_id)
            return jsonify(version_data)
        elif not os.path.exists(file_path):
            return jsonify({'error': 'Version not found'}), 404
            
        with open(file_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 更新版本信息
@app.route('/api/versions/<service_id>/<version>', methods=['PUT'])
def update_version(service_id, version):
    try:
        file_path = os.path.join('versions', service_id, f'{version}.json')
        if not os.path.exists(file_path):
            return jsonify({'error': 'Version not found'}), 404

        data = request.get_json()
        
        # 保存更新后的数据
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4)
            
        return jsonify({'message': 'Version updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)