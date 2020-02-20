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

// La fonction associée au click sur chacune des 9 cases de la grille
var cliqueCase = function(event) {
    // On commence par griser le boutton qui permet de passer le premier tour:
    var passerBoutton = document.getElementById("passer");
    passerBoutton.disabled = true;

    // On récupère l'id de la case cliquée, qui correspond aussi à la coordonnée de la
    // case dans la grille
    coord = event.target.id;
    console.log("Click sur la case:", coord);

    if (valeurCase(coord) == "" && !termine) {
        // On ne peut jouer que sur une case vide et si le jeu n'est pas
        // déjà terminé

        marqueCase(coord, joueurCourant);

        var victoire = testeVictoire();
        if (!victoire) {
            prochainJoueur();
            // Si on est dans cliqueCase, c'est que le coup a été joué par le joueur.
            // Le prochain le sera forcément par l'ordinateur

            // On appelle la fonction coupOrdinateur après 100 millisecondes, afin de laisser
            // au navigateur le temps d'afficher le coup courant (sinon on pourrait penser
            // qu'il est figé). C'est le rôle de la fonction setTimeout, qui permet d'appeler une
            // autre fonction après un certain laps de temps.
            setTimeout(coupOrdinateur, 100);
        } else {
            termine = true;
        }
    }
}

// Permet de laisser l'ordinateur jouer le premier tour
var passerPremierTour = function() {
    // On commence par griser le boutton qui permet de passer le premier tour:
    var passerBoutton = document.getElementById("passer");
    passerBoutton.disabled = true;

    // On appelle la fonction coupOrdinateur après 100 millisecondes, afin de laisser
    // au navigateur le temps d'afficher le coup courant (sinon on pourrait penser
    // qu'il est figé).
    setTimeout(coupOrdinateur, 100);
}

// On demande à l'ordinateur de jouer le prochain coup
var coupOrdinateur = function() {
    console.log("Je réfléchis...");
    // On affiche temporairement le message "je réfléchis..."
    var reflexion = document.getElementById("reflexion");
    reflexion.style.opacity = 1;

    // on laisse passer une centaine de millisecondes avant de continuer le calcul
    // du meilleur coup, sinon le navigateur ne peut pas mettre à jour l'affichage
    // avant la fin de la réflexion (qui peut être longue).
    setTimeout(suiteCoupOrdinateur, 100);
}

// La suite de la fonction précédente: normalement, le navigateur a eu le temps
// de mettre à jour son affichage (message "je réfléchis...") avant de l'appeler.
var suiteCoupOrdinateur = function() {
    // On utilise une recherche avec 8 coups à l'avance. C'est un peu long pour le premier
    // coup (le meilleur est dans un coin), mais c'est optimal pour une grille 9x9.
    var coup = negamaxAlphaBeta(positionCourante(), joueurCourant, -1000000, 100000, 0, 8);

    // On efface le message "je réfléchis..."
    var reflexion = document.getElementById("reflexion");
    reflexion.style.opacity = 0;

    console.log("Je joue en " + coup);
    marqueCase(coup, joueurCourant);

    var victoire = testeVictoire();
    if (!victoire) {
        prochainJoueur();
        // Contrairement à ce qui se passe pour cliqueCase, le prochain coup sera joué par
        // l'humain: il n'y a donc rien à faire ici, on attend le click du joueur.
    } else {
        termine = true;
    }
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
    var passerBoutton = document.getElementById("passer");
    passerBoutton.disabled = false;
}

// Remplit le dictionnaire cases en recherchant l'élément html correspondant.
var initialiseCases = function() {
    for (var i in coordonnees) {
        var coord = coordonnees[i];
        cases[coord] = document.getElementById(coord.toString());

        // On lie l'événement 'onclick' sur cette case de la table à la fonction
        // correspondante:
        cases[coord].onclick = cliqueCase;
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
    var passerBoutton = document.getElementById("passer");
    passerBoutton.disabled = false;
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
            score += 100;
        } else if (nO == 3) {
            score -= 100;
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

// Le terrain est-il entièrement rempli (probablement un match nul, sauf alignement de
// 3 pions)
var positionPleine = function(position) {
    for (var coord in position) {
        if (position[coord] == "") {
            return false;
        }
    }
    return true;
}

// A-t-on une position terminale ? C'est le cas si on a au moins un alignement de 3 pions,
// ou bien en cas de match nul.
var positionTerminale = function(position) {
    if (positionPleine(position)) {
        return true;
    } else {
        // A-t-on des alignements de 3 pions identiques ?
        for (var a in alignements) {
            var nX = 0;
            var nO = 0;
            for (var c in alignements[a]) {
                var coord = alignements[a][c];
                switch (position[coord]) {
                    case "X":
                        nX += 1;
                        break;
                    case "O":
                        nO += 1;
                        break;
                }
                if (nX == 3 || nO == 3) {
                    return true;
                }
            }
        }
    }
    return false;
}

// On recherche le meilleur coup en utilisant l'algorithme minimax (ou plutôt,
// sa variante negamax) décrit sur la page wikipedia correspondante:
// https://fr.wikipedia.org/wiki/Algorithme_minimax
var negamax = function(position, joueur, profondeur, profondeur_max) {
    if (profondeur == profondeur_max || positionTerminale(position)) {
        if (joueur == "X") {
            return calculeScorePosition(position);
        } else {
            return -calculeScorePosition(position);
        }
    } else {
        // Si non, on calcule le score en utilisant l'algorithme minimax.
        var score = -100000;
        var coup = -1;
        for (var coord in position) {
            if (position[coord] == "") {
                var copie = dupliquePosition(position);
                copie[coord] = joueur;
                var nouveauScore = -negamax(copie, adversaire(joueur), profondeur + 1, profondeur_max);
                if (nouveauScore > score) {
                    score = nouveauScore;
                    coup = coord;
                }
            }
        }

        if (profondeur == 0) {
            return coup;
        } else {
            return score;
        }
    }
}

// Une amélioration de la fonction précédente, *beaucoup* plus rapide. On utilise directement
// l'algorithme trouvé ici:
//
// https://en.wikipedia.org/wiki/Negamax#Negamax_with_alpha_beta_pruning
//
var negamaxAlphaBeta = function(position, joueur, alpha, beta, profondeur, profondeur_max) {
    if (profondeur == profondeur_max || positionTerminale(position)) {
        if (joueur == "X") {
            return calculeScorePosition(position);
        } else {
            return -calculeScorePosition(position);
        }
    } else {
        // Si non, on calcule le score en utilisant l'algorithme minimax.
        var score = -100000;
        var coup = -1;
        for (var coord in position) {
            if (position[coord] == "") {
                var copie = dupliquePosition(position);
                copie[coord] = joueur;
                var nouveauScore = -negamaxAlphaBeta(copie, adversaire(joueur), -beta, -alpha, profondeur + 1, profondeur_max);
                if (nouveauScore > score) {
                    score = nouveauScore;
                    coup = coord;
                }
                alpha = Math.max(alpha, score);
                if (alpha >= beta) {
                    break;
                }
            }
        }

        if (profondeur == 0) {
            return coup;
        } else {
            return score;
        }
    }
}
