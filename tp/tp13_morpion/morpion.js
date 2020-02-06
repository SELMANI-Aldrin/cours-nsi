// Les coordonnees des 9 cases du plateau de jeu. Le chiffre des dizaines
// représente le numéro de ligne, le chiffre des unités le numéro de colonne.
var coordonnees = [11, 12, 13, 21, 22, 23, 31, 32, 33]

// Un tableau contenant tous les alignements de trois cases (utilisé pour
// tester une position gagnante).
var alignements = [
    // horizontales
    [11, 12, 13],
    [21, 22, 23],
    [31, 32, 33],
    // verticales
    [11, 21, 31],
    [12, 22, 32],
    [13, 23, 33],
    // diagonales,
    [11, 22, 33],
    [13, 22, 31]
]

// Un dictionnaire associant à chaque coordonnée de case l'élément <td> html
// correspondant.
var cases = {}

// A qui est-ce le tour de jouer ? Peut valoir "X" ou "O"
var joueurCourant = "X";

// Le jeu est-il terminé
var termine = false;

// Change le joueur courant. Alterne entre "O" et "X"
var prochainJoueur = function() {
    switch (joueurCourant) {
        case "X":
            joueurCourant = "O";
            break;
        case "O":
            joueurCourant = "X";
            break;
    }
    afficheJoueurCourant();
}

// Affiche le fait que le joueur courant a gagné la partie
var afficheVictoire = function() {
    var victoire = document.getElementById("victoire-fond");
    victoire.style.display = "block";
    var joueur = document.getElementById("victoire-joueur");
    joueur.innerHTML = joueurCourant;
    switch (joueurCourant) {
        case "X":
            joueur.style.color = "blue";
            break;
        case "O":
            joueur.style.color = "red";
            break;
    }

    window.onclick = function(event) {
        if (event.target == victoire) {
            victoire.style.display = "none";
        }
    }
}

// On veut une fonction qui sera appelée lors d'un clique sur une des cases du
// plateau de jeu. Il y a cependant un problème: on doit fournir une coordonnée
// pour indiquer la case cliquée, mais la fonction associée à 'onclick' ne peut avoir
// aucun paramètre.
//
// Solution (un peu compliquée, mais on n'a pas le choix en javascript): la fonction
// cliqueCase prend un paramètre coord, et renvoie une fonction sans paramètre qui,
// elle, sera associée à 'onclick'. Une telle fonction s'appelle traditionnellement une
// fonction callback en informatique. Chaque fonction callback ainsi créée se souviendra
// de la valeur de coord au moment de sa création.
//
// Concrètement, le programme créera 9 fonctions callback différentes, avec chacunes
// des 9 coordonnées du plateau de jeu.
var cliqueCase = function(coord) {
    var callback = function() {
        // On affiche un message d'information dans la console
        console.log("Click sur la case:", coord);

        if (valeurCase(coord) == 0 && !termine) {
            // On ne peut jouer que sur une case vide

            switch (joueurCourant) {
                case "X":
                    marqueCase(coord, 1);
                    break;
                case "O":
                    marqueCase(coord, 2);
                    break;
            }

            var victoire = testeVictoire();
            if (!victoire) {
                prochainJoueur();
            } else {
                termine = true;
            }
        }
    }

    return callback;
}

// On teste si la position courante est une victoire pour le joueur courant.
var testeVictoire = function() {
    for (var a in alignements) {
        var n = 0;
        for (var c in alignements[a]) {
            var coord = alignements[a][c];
            if ((valeurCase(coord) == 1 && joueurCourant == "X") ||
                (valeurCase(coord) == 2 && joueurCourant == "O")) {
                n = n + 1;
            }
        }
        if (n == 3) {
            for (var c in alignements[a]) {
                var coord = alignements[a][c];
                var cellule = cases[coord];
                switch (joueurCourant) {
                case "X":
                    cellule.style.backgroundColor = "#aaaaff";
                    break
                case "O":
                    cellule.style.backgroundColor = "#ffaaaa";
                    break;
                }
            }
            afficheVictoire();
            return true;
        }
    }
    return false;
}

var effacePlateau = function() {
    for (var i in coordonnees) {
        var coord = coordonnees[i];
        marqueCase(coord, 0);
    }

    joueurCourant = "X";
}

var recommenceJeu = function() {
    effacePlateau();
    joueurCourant = "X";
    afficheJoueurCourant();
    termine = false;
}

// Remplit le dictionnaire cases en recherchant l'élément html correspondant.
var initialiseCases = function() {
    for (var i in coordonnees) {
        var coord = coordonnees[i];
        cases[coord] = document.getElementById(coord.toString());

        // On lie l'événement 'onclick' sur cette case de la table à la fonction
        // correspondante:
        cases[coord].onclick = cliqueCase(coord);
    }

}

var afficheJoueurCourant = function() {
    var courant = document.getElementById("courant");

    switch (joueurCourant) {
        case "X":
            courant.innerHTML = "X";
            courant.style.color = "blue";
            break;
        case "O":
            courant.innerHTML = "O";
            courant.style.color = "red";
            break;
    }
}

// Lancée à chaque chargement de page. Initialise toutes les données avec un
// plateau vide.
var initialisation = function () {
    initialiseCases();
    afficheJoueurCourant();
}

// Renvoie 0 si la case dont la coordonnée est fournie en paramètre est vide,
// 1 si son contenu est "X", 2 si c'est "O". En cas d'erreur, renvoie -1.
var valeurCase = function(coord) {
    var c = cases[coord];

    // On s'assure que la coordonnée était valide (si elle est présente dans les
    // clés du dictionnaire).
    if (c != undefined) {
        switch (c.innerHTML) {
            case "":
                return 0;
            case "X":
                return 1;
            case "O":
                return 2;
        }
    }

    // Si on arrive à ce point, c'est qu'il y a eu une erreur: coordonnée incorrecte ou bien
    // contenu de case incorrect. On renvoie un code d'erreur.
    return -1
}

var marqueCase = function(coord, valeur) {
    // Place une marque dans la case de coordonnée 'coord'.
    // Valeur peut valoir 0 (case vide), 1 (case X) ou 2 (case O).

    // Ne fait rien s'il y a une erreur (coordonnée fausse ou valeur incorrecte).

    // Aucune vérification n'est faite sur le contenu précédent de la case.

    var c = cases[coord];
    if (c != undefined) {
        switch (valeur) {
            case 0:
                c.innerHTML = "";
                c.style.backgroundColor = "#ffffff";
                break
            case 1:
                c.innerHTML = "X";
                c.style.color = "blue";
                break;
            case 2:
                c.innerHTML = "O";
                c.style.color = "red";
                break;
        }
    }
}
