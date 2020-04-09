from flask import Flask

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
  return app.send_static_file("index.html")

@app.route('/style.css')
def css():
  return app.send_static_file("style.css")

@app.route('/script.js')
def javascript():
  return app.send_static_file("script.js")

app.run(debug=True)