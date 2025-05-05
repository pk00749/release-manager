from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this import
import os
import json

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://localhost:6000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
DATA_DIR = 'data'

# 读取 apps.json
def read_apps_json():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'apps.json'), 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

# 主页面
@app.route('/')
def index():
    apps = read_apps_json()
    return jsonify(list(apps.keys()))

# 应用页面
@app.route('/<app_name>')
def app_page(app_name):
    version_dir = os.path.join('versions', app_name)
    if os.path.isdir(version_dir):
        versions = [f.replace('.json', '') for f in os.listdir(version_dir) if f.endswith('.json')]
        return jsonify(versions)
    else:
        return jsonify({"error": "App not found"}), 404

# tag 页面
@app.route('/<app_name>/<tag_name>', methods=['GET', 'POST'])
def tag_page(app_name, tag_name):
    tag_file = os.path.join('versions', app_name, f'{tag_name}.json')
    if request.method == 'GET':
        try:
            with open(tag_file, 'r') as f:
                data = json.load(f)
                # 添加GitHub仓库链接
                apps = read_apps_json()
                data['github_repo'] = apps.get(app_name, '')
                return jsonify(data)
        except FileNotFoundError:
            return jsonify({"error": "Tag not found"}), 404
    elif request.method == 'POST':
        data = request.get_json()
        try:
            # 确保目录存在
            os.makedirs(os.path.dirname(tag_file), exist_ok=True)
            with open(tag_file, 'w') as f:
                json.dump(data, f)
            return jsonify({"message": "Tag info saved successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/<app_name>/<tag_name>/create-uat-cr', methods=['POST'])
def create_uat_cr(app_name, tag_name):
    # 这里添加调用Jira API创建UAT CR的逻辑
    return jsonify({"message": "UAT CR created successfully", "cr_number": "CR-123"})

@app.route('/<app_name>/<tag_name>/deploy-test', methods=['POST'])
def deploy_to_test(app_name, tag_name):
    # 这里添加调用Jenkins API部署到测试环境的逻辑
    return jsonify({"message": "Deployed to test environment successfully"})

@app.route('/<app_name>/<tag_name>/create-prod-cr', methods=['POST'])
def create_prod_cr(app_name, tag_name):
    # 这里添加调用Jira API创建生产CR的逻辑
    return jsonify({"message": "Production CR created successfully", "cr_number": "CR-456"})

@app.route('/<app_name>/<tag_name>/deploy-prod', methods=['POST'])
def deploy_to_prod(app_name, tag_name):
    # 这里添加调用Jenkins API部署到生产环境的逻辑
    return jsonify({"message": "Deployed to production environment successfully"})

if __name__ == '__main__':
    app.run(host='localhost', port=6000, debug=True)