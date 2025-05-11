from flask import Flask, request, redirect, url_for, jsonify, session
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 用于加密session

# JWT的密钥，用于签名和验证
JWT_SECRET = 'your_jwt_secret'
JWT_ALGORITHM = 'HS256'

# 模拟的用户数据库
users = {
    "test_user": {"password": "test_password"}
}

# 模拟的SSO服务提供商（IdP）登录页面
@app.route('/sso/login', methods=['GET', 'POST'])
def sso_login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username in users and users[username]['password'] == password:
            # 创建JWT令牌
            payload = {
                'user': username,
                'exp': datetime.utcnow() + timedelta(minutes=30)  # 令牌有效期30分钟
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
            session['token'] = token
            # 将JWT令牌返回给客户端
            return jsonify({"token": token})
        else:
            return "Invalid credentials", 401
    return '''
        <form method="post">
            Username: <input type="text" name="username"><br>
            Password: <input type="password" name="password"><br>
            <input type="submit" value="Login">
        </form>
    '''

# 模拟的应用服务提供商（SP）主页
@app.route('/sp/home')
def sp_home():
    # 从请求头中获取JWT令牌
    token = request.headers.get('Authorization')
    if token:
        try:
            # 验证JWT令牌
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return f"Welcome, {payload['user']}! You are logged in via SSO."
        except jwt.ExpiredSignatureError:
            return "Token has expired", 401
        except jwt.InvalidTokenError:
            return "Invalid token", 401
    else:
        return "No token provided", 401

# 模拟的SSO服务提供商（IdP）的登录服务接口
@app.route('/sso/auth', methods=['GET'])
def sso_auth():
    # 模拟返回用户信息
    token = request.headers.get('Authorization')
    if token:
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return jsonify({"user": payload['user'], "status": "authenticated"})
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"status": "invalid"}), 401
    else:
        return jsonify({"status": "unauthenticated"}), 401

# 模拟的应用服务提供商（SP）的登录验证接口
@app.route('/sp/verify', methods=['GET'])
def sp_verify():
    # 模拟调用SSO服务提供商的接口验证用户
    token = request.headers.get('Authorization')
    if token:
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return jsonify({"user": payload['user'], "status": "authenticated"})
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"status": "invalid"}), 401
    else:
        return jsonify({"status": "unauthenticated"}), 401

if __name__ == '__main__':
    app.run(port=5002, debug=True)
