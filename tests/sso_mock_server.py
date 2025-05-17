from flask import Flask, request, jsonify, redirect, url_for, session
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'sso_secret_key'

# JWT配置
JWT_SECRET = 'your_jwt_secret'
JWT_ALGORITHM = 'HS256'
# JWT配置
app.config['JWT_TOKEN_LOCATION'] = ['headers']  # 从请求头中获取token
app.config['JWT_HEADER_NAME'] = 'Authorization'  # 指定请求头名称
app.config['JWT_HEADER_TYPE'] = 'Bearer'  # 指定token类型

# 模拟用户数据库
USERS = {
    "test_user": "test_password"
}


@app.route('/sso/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # 创建JWT token
        payload = {
            'user': "test_user",
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        session['access_token'] = token

        # 获取回调URL
        redirect_uri = request.args.get('redirect_uri', 'http://localhost:5001/callback')
        return redirect(f"{redirect_uri}?code=12345")

    return '''
        <form method="post">
            <h2>SSO Login</h2>
            <div>
                <label>Username:</label>
                <input type="text" name="username" value="test_user">
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value="test_password">
            </div>
            <button type="submit">Login</button>
        </form>
    '''


@app.route('/sso/token', methods=['POST'])
def token():
    code = request.form.get('code')
    if code == '12345':
        payload = {
            'user': 'test_user',
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        print(f"create: {token}")
        return jsonify({
            'access_token': token,
            'token_type': 'Bearer',
            'expires_in': 1800
        })
    return "Invalid code", 401


@app.route('/sso/verify', methods=['GET'])
def verify():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401

    token = auth_header.split(' ')[1]
    try:
        print(f"verify: {token}")
        payload = jwt.decode(token, JWT_SECRET, algorithms='HS256')
        return jsonify({
            'user': payload['user'],
            'status': 'authenticated'
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError as ite:
        return jsonify({'error': f'Invalid token: {ite}'}), 401


if __name__ == '__main__':
    app.run(port=5002, debug=True)