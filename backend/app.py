from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# 获取服务的版本列表
@app.route('/api/<service_id>/versions')
def get_service_versions(service_id):
    try:
        # 获取指定服务目录下的所有json文件
        versions_dir = os.path.join('versions', service_id)
        if not os.path.exists(versions_dir):
            return jsonify([])
            
        # 列出目录下的所有json文件
        version_files = [f for f in os.listdir(versions_dir) if f.endswith('.json')]
        # 从文件名中提取版本号
        versions = [os.path.splitext(f)[0] for f in version_files]
        
        return jsonify(versions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取特定版本的详细信息
@app.route('/api/versions/<service_id>/<version>')
def get_version_detail(service_id, version):
    try:
        file_path = os.path.join('versions', service_id, f'{version}.json')
        if not os.path.exists(file_path):
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