// Constantes

const caseVide = 0;
const joueurX = 1;
const joueurO = 2;
const jeuEnCours = 0;
const finVictoire = 1;
const finMatchNul = 2;

const fondPionJaune = "yellow";
const bordPionJaune = "1px solid goldenrod";
const fondPionRouge = "red";
const bordPionRouge = "1px solid brown";
const fondAlignementComplet = "darkgray";

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
            td.id = "case" + String(identifiant);
            td.className = "Colonne" + String(c);
            td.onclick = tetralign.cliqueCase;
            td.onmouseenter = tetralign.survoleCase;
            td.onmouseleave = tetralign.survoleCase;

            // Chaque case contient un pion. Le pion est créé à l'avance, mais il sera rendu
            // invisible si la case est vide: cela permet d'éviter un redimensionnement intempestif
            // de la table si on rajoute/retire des éléments à l'intérieur des cases en cours de jeu.
            var div = document.createElement("div");
            div.id = "pion" + String(identifiant);
            // On donne au div la même classe que le td qui le contient, car le clic peut se faire soit
            // sur le pion, soit à côté du pion (donnant pour cible le div ou le td, selon le cas).
            div.className = "pion";

            tetralign.identifiants[c][nombreLignes - l - 1] = String(identifiant);
            tetralign.coordonnees[String(identifiant)] = [c, l];

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

    // Le jeu est-il toujours en cours ?
    tetralign.jeuTermine = false;
}

tetralign.hauteurPion = function(grille, colonne) {
    // Renvoie la hauteur à laquelle un pion devrait tomber s'il arrivait dans la colonne donnée.
    // Si la colonne est pleine, renvoie le code d'erreur -1.

    var hauteur = 0;
    while (hauteur < nombreLignes && grille[colonne][hauteur] != caseVide) {
        hauteur += 1;
    }

    if (hauteur == nombreLignes) {
        return -1;
    } else {
        return hauteur;
    }
}

tetralign.colonnePleine = function(grille, colonne) {
    // La colonne donnée est-elle pleine ?
    return grille[colonne][nombreLignes - 1] != caseVide;
}

tetralign.coupsDisponibles = function(grille) {
    var coups = [];
    for (var c = 0; c < nombreColonnes; c++) {
        if ( ! tetralign.colonnePleine(grille, c)) {
            coups.push(c);
        }
    }
    return coups;
}

tetralign.extraitIdentifiantColonne = function(event) {
    // On extrait l'identifiant de colonne de la cible de l'événement (c'est-à-dire le nom de la classe
    // CSS de l'élément <td> correspondant).
    if (event.target.nodeName == "DIV") {
        // Le clic (ou le survol) a eu lieu sur le pion: on recherche le <td> qui le contient.
        return event.target.parentElement.className;
    } else {
        // Le clic a eu lieu directement dans le <td>, on récupère donc le nom de la classe.
        return event.target.className;
    }
}

tetralign.extraitNumeroColonne = function(id) {
    // On récupère le numéro de colonne (les identifiants sont de la forme "Colonne<n>", donc le
    // numéro commence au caractère de rang 7):
    return parseInt(id.substring(7));
}

tetralign.cliqueCase = function(event) {
    // On ignore le clic si le tour est celui de l'ordinateur ou si le jeu est fini.
    if ( ! tetralign.jeuTermine && tetralign.joueurHumain) {
        var id = tetralign.extraitIdentifiantColonne(event)
        var colonne = tetralign.extraitNumeroColonne(id);

        // On ignore le clic si la colonne est déjà pleine
        if ( ! tetralign.colonnePleine(tetralign.grille, colonne)) {
            // Quoi qu'il arrive, le prochain joueur ne sera pas humain: on retire donc la surbrillance
            // sur la colonne.
            tetralign.changeSurbrillance(id, "");

            var hauteur = tetralign.hauteurPion(tetralign.grille, colonne);
            tetralign.marqueCase(colonne, hauteur, tetralign.joueurCourant);
            tetralign.changeJoueurCourant();
            // Le prochain joueur sera l'ordinateur;
            tetralign.joueurHumain = false;
            // On demande au navigateur d'appeler la fonction de jeu de l'ordinateur après un
            // délais de 100ms. Ce délais est indispensable pour permettre au navigateur
            // d'actualiser son affichage avant de passer en phase de réflexion. Dans le cas
            // contraire, on devrait attendre la fin du coup de l'ordinateur pour que le coup de
            // l'humain s'affiche, donnant l'impression que le navigateur est bloqué.
            setTimeout(tetralign.coupOrdinateur, 100);

            // Enfin, on s'assure que le bouton permettant de laisser passer le premier tour est
            // bien grisé, puisqu'au moins un coup a été joué par l'humain.
            var bouttonPasser = document.getElementById("passer");
            bouttonPasser.disabled = true;
        }
    }
}

tetralign.adversaire = function(joueur) {
    // Renvoie l'adversaire de joueur.
    switch (joueur) {
        case joueurX:
            return joueurO;
        case joueurO:
            return joueurX;
    }
}

tetralign.changeJoueurCourant = function() {
    // Change le joueur courant pour passer à son adversaire. Met à jour l'affichage sur la
    // page web.
    tetralign.joueurCourant = tetralign.adversaire(tetralign.joueurCourant);
}

tetralign.coupOrdinateur = function() {
    // On ne fait rien si le jeu est terminé ou si c'est au tour du joueur humain (normalement,
    // cela ne devrait jamais se produire en dehors d'un bug, puisque cette fonction ne devrait
    // pas être appelée dans ce cas).
    if ( ! tetralign.jeuTermine && ! tetralign.joueurHumain) {
        var coups = tetralign.coupsDisponibles(tetralign.grille);
        var colonne = coups[Math.floor(Math.random() * (coups.length - 1))];
        var hauteur = tetralign.hauteurPion(tetralign.grille, colonne)
        tetralign.marqueCase(colonne, hauteur, tetralign.joueurCourant);
        tetralign.changeJoueurCourant();
        // Le prochain joueur sera le joueur humain;
        tetralign.joueurHumain = true;
    }
}

tetralign.changeSurbrillance = function(id, couleur) {
    // On utilise cette fonction pour changer le fond d'une colonne donnée: sert à marquer
    // à l'utilisateur la colonne sous le curseur de la souris.
    var elements = document.getElementsByClassName(id);
    for (i in elements) {
        if (elements[i].nodeName == "TD") {
            elements[i].style.backgroundColor = couleur;
        }
    }
}

tetralign.survoleCase = function(event) {
    // On ne fait rien si le jeu est terminé ou si ce n'est pas au tour du joueur humain.
    if ( ! tetralign.jeuTermine && tetralign.joueurHumain) {
        var id = tetralign.extraitIdentifiantColonne(event);
        var colonne = tetralign.extraitNumeroColonne(id);
        if (event.type == "mouseenter" && !tetralign.colonnePleine(tetralign.grille, colonne)) {
            tetralign.changeSurbrillance(id, "lemonchiffon");
        }
        if (event.type == "mouseleave") {
            tetralign.changeSurbrillance(id, "");
        }
    } else {
        // Par sécurité, on enlève toute trace d'une éventuelle surbrillance si le joueur actuel
        // n'est pas le joueur humain.
        tetralign.changeSurbrillance(id, "");
    }
}

tetralign.marqueCase = function(colonne, ligne, joueur) {
    tetralign.grille[colonne][ligne] = joueur;
    var pion = document.getElementById("pion" + tetralign.identifiants[colonne][ligne]);
    switch (joueur) {
        case joueurX:
            pion.style.backgroundColor = fondPionJaune;
            pion.style.border = bordPionJaune;
            break;
        case joueurO:
            pion.style.backgroundColor = fondPionRouge;
            pion.style.border = bordPionRouge;
            break;
    }
    pion.style.opacity = 1;
    var resultat = tetralign.testeVictoire();
    if (resultat == finMatchNul || resultat == finVictoire) {
        tetralign.jeuTermine = true;
        tetralign.afficheVictoire(resultat);
    }
}

tetralign.afficheVictoire = function(statut) {
    var victoireFond = document.getElementById("victoire-fond");
    victoireFond.style.display = "block";
    var victoire = document.getElementById("victoire");
    var nul = document.getElementById("match-nul");
    if (statut == finVictoire) {
        victoire.style.display = "block";
        nul.style.display = "none";
        var pionInfo = document.getElementById("victoire-joueur");
        switch (tetralign.joueurCourant) {
            case joueurX:
                pionInfo.style.backgroundColor = fondPionJaune;
                pionInfo.style.border = bordPionJaune;
                break;
            case joueurO:
                pionInfo.style.backgroundColor = fondPionRouge;
                pionInfo.style.border = bordPionRouge;
                break;
        }
    } else {
        victoire.style.display = "none";
        nul.style.display = "block";
    }

    window.onclick = function(event) {
        if (event.target == victoireFond || event.target == victoire) {
            victoireFond.style.display = "none";
        }
    }
}

tetralign.recommencerJeu = function() {
    tetralign.effaceGrille(tetralign.grille);
    tetralign.joueurCourant = joueurX;
    tetralign.joueurHumain = true;
    tetralign.jeuTermine = false;
    var bouttonPasser = document.getElementById("passer");
    bouttonPasser.disabled = false;
    for (var c = 0; c < nombreColonnes; c++) {
        for (var l = 0; l < nombreLignes; l++) {
            var pion = document.getElementById("pion" + tetralign.identifiants[c][l]);
            pion.style.opacity = 0;
            var cellule = document.getElementById("case" + tetralign.identifiants[c][l]);
            cellule.style.backgroundColor = "";
        }
    }
}

tetralign.passerPremierTour = function() {
    var bouttonPasser = document.getElementById("passer");
    bouttonPasser.disabled = true;
    tetralign.changeJoueurCourant();
    tetralign.joueurHumain = false;
    setTimeout(tetralign.coupOrdinateur, 100);
}

tetralign.testeVictoire = function() {
    // Teste la présence d'un éventuel alignement sur la grille. Met ces alignements en
    // surbrillance le cas échéant.

    // Teste aussi un éventuel match nul (grille complètement pleine, sans aucun alignement).

    // Un tableau contenant les indices des aligements complétés.
    var termines = [];

    // On parcourt tous les alignements et on recherche ceux qui sont complétés.
    for (var a in tetralign.alignements) {
        var nX = 0;
        var nO = 0;
        for (var d = 0; d < 4; d++) {
            var c = tetralign.alignements[a][d][0];
            var l = tetralign.alignements[a][d][1];
            switch (tetralign.grille[c][l]) {
                case joueurX:
                    nX += 1;
                    break;
                case joueurO:
                    nO += 1;
                    break;
            }
        }
        if (nX == 4 || nO == 4) {
            termines.push(a);
        }
    }

    if (termines.length > 0) {
        // On a au moins un alignement de 4 pions. Celui-ci est forcément pour le joueurCourant,
        // car c'est lui qui a posé le dernier pion.
        for (var a in termines) {
            for (var d = 0; d < 4; d++) {
                var colonne = tetralign.alignements[termines[a]][d][0];
                var ligne = tetralign.alignements[termines[a]][d][1];
                var id = "case" + tetralign.identifiants[colonne][ligne];
                console.log(id);
                var cellule = document.getElementById(id);
                cellule.style.backgroundColor = fondAlignementComplet;
            }
        }
        return finVictoire;
    } else {
        // Aucun alignement. Il faut encore s'assurer que le terrain n'est pas entièrement rempli,
        // car alors on aurait un match nul.
        if (tetralign.coupsDisponibles(tetralign.grille).length == 0) {
            return finMatchNul;
        } else {
            return jeuEnCours;
        }
    }
}
