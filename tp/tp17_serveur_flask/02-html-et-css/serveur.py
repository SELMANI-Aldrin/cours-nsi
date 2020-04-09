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
        <title>Flask avec html et css</title>
    </head>
    <body>
      <h1>Cette page a du style !</h1>

      <p>Flask, c'est vraiment top !</p>
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

app.run(debug=True)