from flask import Flask, render_template, request
import datetime

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
  return app.send_static_file("index.html")

@app.route('/style.css')
def css():
  return app.send_static_file("style.css")

@app.route('/resultat', methods=['POST'])
def resultat():
  result = request.form
  n = result['nom']
  p = result['prenom']
  return render_template("resultat.html", nom=n, prenom=p)

app.run(debug=True)

