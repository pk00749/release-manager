from flask import Flask, request, redirect, url_for, session, jsonify

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 用于加密session

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
            session['user'] = username  # 将用户信息存储到session中
            # 模拟登录成功后跳转到应用服务提供商（SP）的登录成功页面
            return redirect(url_for('sp_home'))
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
    if 'user' in session:
        return f"Welcome, {session['user']}! You are logged in via SSO."
    else:
        return redirect(url_for('sso_login'))

# 模拟的SSO服务提供商（IdP）的登录服务接口
@app.route('/sso/auth', methods=['GET'])
def sso_auth():
    # 模拟返回用户信息
    if 'user' in session:
        return jsonify({"user": session['user'], "status": "authenticated"})
    else:
        return jsonify({"status": "unauthenticated"}), 401

# 模拟的应用服务提供商（SP）的登录验证接口
@app.route('/sp/verify', methods=['GET'])
def sp_verify():
    # 模拟调用SSO服务提供商的接口验证用户
    auth_response = sso_auth()
    return auth_response

if __name__ == '__main__':
    app.run(port=5002, debug=True)
