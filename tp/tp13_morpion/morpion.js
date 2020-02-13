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

// Quel est l'adversaire. Renvoie "X" si le joueur est "O", et inversement.
var adversaire = function(joueur) {
    switch (joueur) {
        case "X":
            return "O";
        case "O":
            return "X";
    }
}

// Change le joueur courant. Alterne entre "O" et "X"
var prochainJoueur = function() {
    joueurCourant = adversaire(joueurCourant);
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

        if (valeurCase(coord) == "" && !termine) {
            // On ne peut jouer que sur une case vide et si le jeu n'est pas
            // déjà terminé

            marqueCase(coord, joueurCourant);

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
            if (valeurCase(coord) == joueurCourant) {
                n = n + 1;
            }
        }

        // A-t-on un alignement de 3 cases ?
        if (n == 3) {

            // Oui : on marque cet alignement dans la grille
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

            // puis on affiche le message de victoire
            afficheVictoire();
            return true;
        }
    }
    return false;
}

var effacePlateau = function() {
    for (var i in coordonnees) {
        var coord = coordonnees[i];
        marqueCase(coord, "");
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
// 1 si son contenu est "X", 2 si c'est "O". En cas d'erreur, renvoie undefined.
var valeurCase = function(coord) {
    var c = cases[coord];

    // On s'assure que la coordonnée était valide (si elle est présente dans les
    // clés du dictionnaire).
    if (c != undefined) {
        return c.innerHTML;
    }

    // Si on arrive à ce point, c'est qu'il y a eu une erreur: coordonnée incorrecte ou bien
    // contenu de case incorrect. On renvoie un code d'erreur.
    return undefined
}

var marqueCase = function(coord, valeur) {
    // Place une marque dans la case de coordonnée 'coord'.
    // Valeur peut valoir "" (case vide), "X" ou "O".

    // Ne fait rien s'il y a une erreur (coordonnée fausse ou valeur incorrecte).

    // Aucune vérification n'est faite sur le contenu précédent de la case.

    var c = cases[coord];
    if (c != undefined) {
        c.innerHTML = valeur;
        switch (valeur) {
            case "":
                c.innerHTML = "";
                c.style.backgroundColor = "#ffffff";
                break
            case "X":
                c.innerHTML = "X";
                c.style.color = "blue";
                break;
            case "O":
                c.innerHTML = "O";
                c.style.color = "red";
                break;
        }
    }
}

// Renvoie un dictionnaire où on associe à chaque case de la grille sa valeur.
// Utile pour travailler sur une position donnée (calculer un score, programmer
// une IA) sans avoir à accéder au html.
//
// Attention, ce dictionnaire est totalement découplé du html: on peut s'en
// servir pour travailler ou modifier une position en mémoire, mais pas pour
// changer le terrain affiché.
//
// L'autre grand avantage: on peut créer de nouvelles positions sans modifier
// le html, ce qui est indispensable pour prévoir plusieurs coups à l'avance
// dans une IA.
var positionCourante = function() {
    var dico = {}
    for (var c in coordonnees) {
        var coord = coordonnees[c];
        dico[coord] = valeurCase(coord);
    }
    return dico;
}

// Renvoie une copie d'une position. Très utile pour analyser l'effet d'un coup
// potentiel dans une IA.
var dupliquePosition = function(position) {
    var copie = {};
    for (var c in position) {
        copie[c] = position[c];
    }
    return copie;
}

// Calcule un score pour une position, par rapport au joueur X.
// L'algorithme fonctionne en parcourant tous les alignements de cases.
// Ensuite:
// - Un alignement de 3 valeurs identiques renvoie un score de 100 pour X,
//   -100 pour O.
//
// En dehors des alignements victorieux, on ajoute les scores partiels:
// - Un alignement de 2 valeurs identiques + une case vide rapporte 10 pour X,
//   -10 pour O.
// - Une seule case marquée rapport 1 pour X, -1 pour O.
var calculeScorePosition = function(position) {
    var score = 0;
    for (var a in alignements) {
        var nX = 0;
        var nO = 0;
        for (c in alignements[a]) {
            var coord = alignements[a][c];
            switch (position[coord]) {
                case "X":
                    nX += 1;
                    break;
                case "O":
                    nO += 1
                    break;
            }
        }

        if (nX == 3) {
            return 100;
        } else if (nO == 3) {
            return -100;
        } else if (nX == 2 && nO == 0) {
            score += 10;
        } else if (nO == 2 && nX == 0) {
            score -= 10;
        } else if (nX == 1 && nO == 0) {
            score += 1;
        } else if (nO == 1 && nX == 0) {
            score -= 1;
        }
    }
    return score;
}

var minimax = function(position, joueur) {
    var score = calculeScorePosition(position);
    if (joueur == "O") {
        // Le score est calculé par rapport au joueur "X": on prend l'opposé
        // si le joueur est "O".
        score = score;
    }

    // Est-ce une position victorieuse ?
    if (score == 100 || score == -100) {
        return score;
    }



    // Si non, on calcule le score en utilisant l'algorithme minimax.
    score = -200;
    var coup = -1;
    for (var coord in position) {
        if (position[coord] == "") {
            var copie = dupliquePosition(position);
            copie[coord] = joueur;
            var nouveauScore = -minimax(copie, adversaire(joueur));
            if (nouveauScore > score) {
                score = nouveauScore;
                coup = coord;
            }
        }
    }

    if (coup == -1) {
        return 0; // Aucun coup valide, c'est un match nul.
    } else {
        return score;
    }
}
