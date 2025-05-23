from flask import Flask, request, jsonify, session, redirect, render_template
from flask_cors import CORS  # Add this import
import os
import json
from backend import config  # 修改为相对导入
from . import config as backend_config
from .mock_data import MOCK_USERS, MOCK_SSO_CONFIG

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = 'your-secret-key'  # 用于session加密
DATA_DIR = 'data'


@app.route('/sso/config', methods=['GET'])
def sso_config():
    """返回SSO配置信息"""
    return jsonify(MOCK_SSO_CONFIG)


@app.route('/sso/authorize', methods=['GET'])
def sso_authorize():
    """SSO授权端点"""
    return redirect(f"{MOCK_SSO_CONFIG['redirect_uri']}?code=mock-auth-code")


@app.route('/sso/token', methods=['POST'])
def sso_token():
    """SSO token端点"""
    return jsonify({
        "access_token": "mock-access-token",
        "token_type": "Bearer",
        "expires_in": 3600
    })


@app.route('/sso/userinfo', methods=['GET'])
def sso_userinfo():
    """SSO用户信息端点"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Invalid token"}), 401

    return jsonify(MOCK_USERS["test.user"])


@app.route('/sso/login', methods=['POST'])
def sso_login():
    """SSO登录处理"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')  # 在实际SSO中不需要，这里仅用于演示

    if username in MOCK_USERS:
        user_data = MOCK_USERS[username]
        session['user'] = user_data
        return jsonify({
            "success": True,
            "user": user_data,
            "token": "mock-access-token"
        })

    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/sso/logout', methods=['POST'])
def sso_logout():
    """SSO登出"""
    session.pop('user', None)
    return jsonify({"success": True})

# 读取 apps.json
def read_apps_json():
    try:
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'services.json'), 'r') as f:
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
    version_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'versions', app_name)
    if os.path.isdir(version_dir):
        versions = [f.replace('.json', '') for f in os.listdir(version_dir) if f.endswith('.json')]
        return jsonify(versions)
    else:
        return jsonify({"error": "App not found"}), 404


def initial_version_info(apps, app_name, tag_name):
    version_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'versions', app_name, tag_name+'.json')

    # 创建初始版本文件
    initial_info = {
        "version": tag_name,
        "github_repo": apps.get(app_name, '') + "/tag/" + tag_name,
        "uat_status": "not_started",
        "prod_status": "not_started",
        "release_date": "",
        "test_result": "not_tested",
        "uat_cr": "",
        "jira_issue": "",
        "github_pull_request": "",
        "sonarqube_scan": "",
        "cyberflows_sast_scan": "",
        "cyberflows_cont_scan": "",
        "ice": "",
        "prod_cr": ""
    }

    with open(version_file, 'w') as ver_file:
        json.dump(initial_info, ver_file, indent=4)
        return initial_info

# tag 页面
@app.route('/<app_name>/<tag_name>', methods=['GET', 'POST'])
def tag_page(app_name, tag_name):
    tag_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'versions', app_name, f'{tag_name}.json')
    if request.method == 'GET':
        apps = read_apps_json()
        try:
            with open(tag_file, 'r') as f:
                data = json.load(f)
                # 添加GitHub仓库链接
                data['github_repo'] = apps.get(app_name, '') + "/tag/" + tag_name
                return jsonify(data)
        except FileNotFoundError:
            data = initial_version_info(apps, app_name, tag_name)
            return jsonify(data)
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
    app.run(host='localhost', port=5001, debug=True)