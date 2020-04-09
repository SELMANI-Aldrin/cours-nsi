from flask import Flask, Response

app = Flask(__name__)

@app.route('/')
def index():
  return """
  <!DOCTYPE html>
  <html lang="fr">
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="style.css" />
        <script type="text/javascript" src="script.js"></script>
        <title>Flask avec html + css + javascript</title>
    </head>
    <body>
      <h1 onclick="change_couleurs(event)">Cliquez-moi !</h1>
    </body>
  </html>
  """

@app.route('/style.css')
def css():
  css = """
  h1 {
    font-size: 48px;
    color: blue;
    background-color: yellow;
  }
  """

  return Response(css, mimetype='text/css')

@app.route('/script.js')
def javascript():
  script = """

  var aleatoire_entre_bornes = function(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  var couleur_aleatoire = function() {
    var rouge = aleatoire_entre_bornes(0, 255);
    var vert = aleatoire_entre_bornes(0, 255);
    var bleu = aleatoire_entre_bornes(0, 255);
    return "rgba(" + rouge + ", " + vert + ", " + bleu + ", 1.0)";
  }

  var change_couleurs = function(event) {
    event.target.style.color = couleur_aleatoire();
    event.target.style.backgroundColor = couleur_aleatoire();
  }
  """

  return Response(script, mimetype='text/javascript')

app.run(debug=True)