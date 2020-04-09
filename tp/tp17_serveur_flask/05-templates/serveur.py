from flask import Flask, render_template
import datetime

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
  date = datetime.datetime.now()
  h = date.hour
  m = date.minute
  s = date.second
  return render_template("index.html", heure = h, minute = m, seconde = s)

@app.route('/style.css')
def css():
  return app.send_static_file("style.css")

@app.route('/script.js')
def javascript():
  return app.send_static_file("script.js")

app.run(debug=True)

