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

# 模拟用户数据库
USERS = {
    "test_user": "test_password"
}


@app.route('/sso/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if username in USERS and USERS[username] == password:
            # 创建JWT token
            payload = {
                'user': username,
                'exp': datetime.utcnow() + timedelta(minutes=30)
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
            session['token'] = token

            # 获取回调URL
            redirect_uri = request.args.get('redirect_uri', 'http://localhost:5001/callback')
            return redirect(f"{redirect_uri}?code=12345")

        return "Invalid credentials", 401

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
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
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
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return jsonify({
            'user': payload['user'],
            'status': 'authenticated'
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401


if __name__ == '__main__':
    app.run(port=5002, debug=True)