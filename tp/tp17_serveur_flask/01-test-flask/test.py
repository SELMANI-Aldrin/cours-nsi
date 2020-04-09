from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
  return """
  <!DOCTYPE html>
  <html lang="fr">
    <head>
        <meta charset="utf-8" />
        <title>Premier essai avec flask</title>
    </head>
    <body>
      <p>Tout fonctionne parfaitement</p>
    </body>
  </html>
  """

app.run(debug=True)