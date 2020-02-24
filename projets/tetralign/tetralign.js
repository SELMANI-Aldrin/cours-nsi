// Constantes

const caseVide = 0;
const joueurX = 1;
const joueurO = 2;
const finVictoire = 1;
const finMatchNul = 2;

const nombreColonnes = 7;
const nombreLignes = 6;

var tetralign = {};

tetralign.initialisation = function() {
    // Fonction appelée automatiquement au chargement de la page html. Initialise toutes
    // les variables nécessaires au bon fonctionnement du jeu.

    tetralign.initialiseGrille();
    tetralign.initialiseAlignements();
    tetralign.initialiseJeu();

    var passerBoutton = document.getElementById("passer");
    passerBoutton.disabled = false;

}

tetralign.nouvelleGrille = function() {
    // Crée une nouvelle grille (vide).

    var g = Array(nombreColonnes);
    for (var c = 0; c < nombreColonnes; c++) {
        g[c] = Array(nombreLignes);
        for (var l = 0; l < nombreLignes; l++) {
            g[c][l] = caseVide;
        }
    }
    return g;
}

tetralign.effaceGrille = function(g) {
    // Vide une grille déjà existante.

    for (var c = 0; c < nombreColonnes; c++) {
        for (var l = 0; l < nombreLignes; l++) {
            g[c][l] = caseVide;
        }
    }
}

tetralign.copieGrille = function(g) {
    // Renvoie une copie d'une grille existante.

    var copie = Array(nombreColonnes);
    for (var c = 0; c < nombreColonnes; c++) {
        copie[c] = Array(nombreLignes);
        for (var l = 0; l < nombreLignes; l++) {
            copie[c][l] = g[c][l];
        }
    }
    return copie;
}

tetralign.initialiseGrille = function() {
    // Crée la table html qui contiendra la grille du jeu


    // La grille représentant l'état du jeu. Il ne faut jamais la modifier "à la main", car
    // sinon son état ne serait pas synchronisé avec l'affichage en html. Utiliser la fonction
    // marqueCase pour cela.
    tetralign.grille = tetralign.nouvelleGrille();

    // Chaque case de la grille doit être repérable par un identifiant unique. Pour se
    // souvenir des identifiants associés à chaque case, on les stocke dans une grille
    // spécialement prévue à cet effet.
    tetralign.identifiants = tetralign.nouvelleGrille();

    // À l'inverse, on veut retrouver les coordonnées associées à un identifiant donné.
    // Pour cela, on utilise un dictionnaire.
    tetralign.coordonnees = {};

    var identifiant = 0;
    var table = document.getElementById("grille");
    for (var l = 0; l < nombreLignes; l++) {

        // On crée la ligne <tr> dans la table
        var tr = document.createElement("tr");

        for (var c = 0; c < nombreColonnes; c++) {

            // Puis une case pour chaque colonne
            var td = document.createElement("td");
            td.className = "Colonne" + String(c);
            td.onclick = tetralign.cliqueCase;
            td.onmouseenter = tetralign.survoleCase;
            td.onmouseleave = tetralign.survoleCase;

            // Chaque case contient un pion. Le pion est créé à l'avance, mais il sera rendu
            // invisible si la case est vide: cela permet d'éviter un redimensionnement intempestif
            // de la table si on rajoute/retire des éléments à l'intérieur des cases en cours de jeu.
            var div = document.createElement("div");
            div.id = "Pion" + String(identifiant);
            div.className = "pion";

            tetralign.identifiants[c][l] = div.id;
            tetralign.coordonnees[div.id] = [c, l];

            // On rajoute le <div> au <td>, puis le <td> au <tr>.
            td.appendChild(div);
            tr.appendChild(td);

            // On passe à l'identifiant suivant:
            identifiant += 1;
        }

        // On rajoute le <tr> à la <table>.
        table.appendChild(tr);
    }
}

tetralign.initialiseAlignements = function() {
    tetralign.alignements = [];

    for (var c = 0; c < nombreColonnes; c++) {
        for (var l = 0; l < nombreLignes; l++) {

            // Alignements horizontaux:
            if (c <= nombreColonnes - 4) {
                var coups = Array(4);
                for (i = 0; i < 4; i++) {
                    coups[i] = [c + i, l];
                }
                tetralign.alignements.push(coups);
            }

            // Alignements verticaux:
            if (l <= nombreLignes - 4) {
                var coups = Array(4);
                for (i = 0; i < 4; i++) {
                    coups[i] = [c, l + i];
                }
                tetralign.alignements.push(coups);
            }

            // Alignements diagonaux bas-droite:
            if (c <= nombreColonnes - 4 && l <= nombreLignes - 4) {
                var coups = Array(4);
                for (i = 0; i < 4; i++) {
                    coups[i] = [c + i, l + i];
                }
                tetralign.alignements.push(coups);
            }

            // Alignements diagonaux haut-droite:
            if (c <= nombreColonnes - 4 && l >= 3) {
                var coups = Array(4);
                for (i = 0; i < 4; i++) {
                    coups[i] = [c + i, l - i];
                }
                tetralign.alignements.push(coups);
            }
        }
    }
}

tetralign.initialiseJeu = function() {
    // La variable qui contient le joueur courant (joueurX ou joueurO)
    tetralign.joueurCourant = joueurX;

    // Le joueur courant est-il humain (ou ordinateur) ?
    tetralign.joueurHumain = true;
}

tetralign.hauteurPion = function(colonne) {
    // Renvoie la hauteur à laquelle un pion devrait tomber s'il arrivait dans la colonne donnée.
    // Si la colonne est pleine, renvoie le code d'erreur -1.

    var hauteur = 0;
    while (hauteur < nombreLignes && tetralign.grille[colonne][hauteur] != caseVide) {
        hauteur += 1;
    }

    if (hauteur == nombreLignes) {
        return -1;
    } else {
        return hauteur;
    }
}

tetralign.colonnePleine = function(colonne) {
    // La colonne donnée est-elle pleine ?
    return tetralign.grille[colonne][nombreLignes - 1] != caseVide;
}

tetralign.extraitNumeroColonne = function(id) {
    // On récupère le numéro de colonne (les identifiants sont de la forme "Colonne<n>", donc le
    // numéro commence au caractère de rang 7):
    return parseInt(id.substring(7));
}

tetralign.cliqueCase = function(event) {
    // On ignore le clic si le tour est celui de l'ordinateur
    if (tetralign.joueurHumain) {
        var colonne = tetralign.extraitNumeroColonne(event.target.className);

        // On ignore le clic si la colonne est déjà pleine
        if ( ! tetralign.colonnePleine(colonne)) {

        }
    }
}

tetralign.survoleCase = function(event) {
    var id = event.target.className;
    var colonne = tetralign.extraitNumeroColonne(id);
    if (event.type == "mouseenter" && !tetralign.colonnePleine(colonne)) {
        var elements = document.getElementsByClassName(id);
        for (i in elements) {
            if (elements[i].nodeName == "TD") {
                elements[i].style.backgroundColor = "lemonchiffon";
            }
        }
    }
    if (event.type == "mouseleave") {
        var elements = document.getElementsByClassName(id);
        for (i in elements) {
            if (elements[i].nodeName == "TD") {
                elements[i].style.backgroundColor = "";
            }
        }
    }
}
