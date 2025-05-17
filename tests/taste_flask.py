from flask import Flask, session, url_for, redirect

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret"

@app.route('/')
def index():
    if 'user_name' not in session:
        session['user_name'] = "guest"
    return f'<p>{session['user_name']}</p>'

@app.route('/home')
def home():
    print(session)
    return f'home {session['user_name']}'

@app.route('/page1')
def page1():
    if 'page' not in session:
        session['page'] = "1"
    return redirect(url_for("page"))

@app.route('/page')
def page():
    if 'page' not in session:
        session['page'] = "1"
    return f'<p>page {session['page']}</p>'


if __name__ == "__main__":
    app.run(host='localhost', port=5003, debug=True)
