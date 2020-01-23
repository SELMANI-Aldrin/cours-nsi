// Un dictionnaire associant à chaque région la liste de ses départements:
var territoire = {
	"Bourgogne": ["Côte d'Or", "Nièvre", "Saône et Loire", "Yonne"],
	"Franche-Comté": ["Jura", "Doubs", "Haute Saône", "Territoire de Belfort"],
};

// On déclare toutes les variables qui seront utilisées dans ce script. Elles seront initialisées
// plus tard dans le fichier.
var formulaire;
var listeRegions;
var listeDepartements;
var resultat;

// On déclare toutes les fonctions qui seront définies un peu plus loin. L'avantage de faire cela
// est que l'ordre dans lequel on définit les fonctions n'a plus d'importance. Sinon, il faut que
// toutes les fonctions soient définies avant d'être appelées, ce qui peut être très pénible à
// réaliser, voire impossible.
var afficheResultat;
var initialiseListeRegions;
var initialiseListeDepartements;
var nouvelleRegion;
var nouveauDepartement;
var init;

afficheResultat = function() {
	var r = listeRegions.selectedIndex;
	var region = listeRegions.options[r].value;
	var d = listeDepartements.selectedIndex;
	var departement = listeDepartements.options[d].value;

	if (r == 0 || d == 0) {
		resultat.innerHTML = "<p>Le choix actuel de votre lieu de résidence est incomplet</p>";
	} else {
		s = "<p>Région choisie: ";
		s += "<span class='gras'>" + region + "</span>";
		s += " - Département choisi: ";
		s += "<span class='gras'>" + departement + "</span>";
		s += "</p>";
		resultat.innerHTML = s;
	}
}

initialiseListeRegions = function() {
	for(var region in territoire) {
		var opt = document.createElement("option");
		opt.appendChild(document.createTextNode(region));
		opt.value = region;
		listeRegions.appendChild(opt);
	}
	listeRegions.selectedIndex = 0;
	listeDepartements.disabled = true;
};

initialiseListeDepartements = function(region) {
	var options = listeDepartements.options;

	listeDepartements.selectedIndex = 0;

	// On vide la liste actuelle des options (sauf la première, qui demande de faire un choix) pour
	// les départements:
	while (options.length > 1) {
		options[1] = null;
	}

	if (region != "__choix__") {
		listeDepartements.disabled = false;
		var departements = territoire[region];
		for(var d in departements) {
			departement = departements[d];
			var opt = document.createElement("option");
			opt.appendChild(document.createTextNode(departement));
			opt.value = departement;
			listeDepartements.appendChild(opt);
		}
	} else {
		listeDepartements.disabled = true;
	}
}

nouvelleRegion = function() {
	var index = listeRegions.selectedIndex;
	var region = listeRegions.options[index].value;
	/*console.log("Changement de région: " + region);*/
	initialiseListeDepartements(region);
	afficheResultat();
}

nouveauDepartement = function() {
	afficheResultat();
}

init = function() {
	formulaire = document.forms["residence"];
	listeRegions = formulaire.regions;
	listeDepartements = formulaire.departements;
	resultat = document.getElementById("resultat");

	initialiseListeRegions();
	afficheResultat();
};
