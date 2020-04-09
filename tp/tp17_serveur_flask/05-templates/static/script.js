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