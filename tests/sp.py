from flask import Flask, request, jsonify, redirect, url_for, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
import requests
from datetime import timedelta

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'sp_secret_key'

# JWT配置
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
# app.config['JWT_TOKEN_LOCATION'] = ['headers']  # 从请求头中获取token
# app.config['JWT_HEADER_NAME'] = 'Authorization'  # 指定请求头名称
# app.config['JWT_HEADER_TYPE'] = 'Bearer'  # 指定token类型
jwt = JWTManager(app)

SSO_SERVER = 'http://localhost:5002'


@app.route('/')
def index():
    if 'access_token' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


@app.route('/login')
def login():
    if 'access_token' in session:
        return redirect(url_for('dashboard'))
    return redirect(f"{SSO_SERVER}/sso/login?redirect_uri=http://localhost:5001/callback")


@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return "No code provided", 400

    # 使用授权码获取token
    response = requests.post(
        f"{SSO_SERVER}/sso/token",
        data={'code': code}
    )

    if response.status_code == 200:
        token_data = response.json()
        # 存储token到session
        session['access_token'] = token_data['access_token']
        return redirect(url_for('dashboard'))

    return "Failed to get token", 401


@app.route('/dashboard')
# @jwt_required(optional=True)
def dashboard():
    if 'access_token' not in session:
        return redirect(url_for('login'))
    # current_user = get_jwt_identity()
    # 验证token
    headers = {'Authorization': f"Bearer {session['access_token']}"}
    verify_response = requests.get(f"{SSO_SERVER}/sso/verify", headers=headers)

    if verify_response.status_code == 200:
        user_data = verify_response.json()
        return jsonify({
            'message': f'Welcome to the dashboard, {user_data["user"]}!',
            'user': user_data['user']
        })

    return redirect(url_for('login'))


@app.route('/protected')
def protected():
    if 'access_token' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    # 验证token
    headers = {'Authorization': f"Bearer {session['access_token']}"}
    verify_response = requests.get(f"{SSO_SERVER}/sso/verify", headers=headers)

    if verify_response.status_code == 200:
        user_data = verify_response.json()
        return jsonify({
            'message': 'This is a protected endpoint',
            'user': user_data['user']
        })

    return jsonify({'error': 'Invalid token'}), 401


@app.route('/logout')
def logout():
    session.pop('access_token', None)
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(port=5001, debug=True)