// Un dictionnaire qui contient la liste de tous les plats disponibles, avec
// leurs prix.
var aliments = {}

// On remplit le dictionnaire. Notez la syntaxe qui est plus sympathique que
// celle utilisée en python. aliments.entrees est équivalent à
// aliments["entrees"] qui existe d'ailleurs aussi en javascript.
aliments.entrees = {
	  "Crudités": 12.5,
	  "Pâté en croûte": 18.0,
	  "Oeufs mayo": 9.5,
	  "Avocats": 24.75
};

aliments.plats = {
	  "Steak-frites": 30.0,
	  "Choucroute": 27.50,
	  "Cassoulet": 32.50,
	  "Couscous": 37.0
};

aliments.desserts = {
	  "Yaourt": 12.5,
	  "Fruits": 10.0,
	  "Glace": 16.50,
	  "Tartelette": 19.75
};

aliments.boissons = {
	  "Chassagne-Montrachet": 32.50,
	  "Chablis": 25.0,
	  "Vin jaune": 36.50,
	  "Eau du robinet": 0.0
};

// Pour ce script, on décide de stocker toutes les variables globales ainsi que
// toutes les fonctions dans un dictionnaire intitulé composeur. C'est une bonne
// chose de faire cela, car cela évite des collisions de noms identiques lorsque
// l'on utilise plusieurs fichiers javascript pour une même page.
var composeur = {};

composeur.initialiseListesDeroulantes = function () {
	  for (var cat in composeur.categories) {
		    var liste = composeur.listes[cat];
		    liste.onchange = composeur.testeChoixComplet;
		    for (var item in aliments[cat]) {
			      var opt = document.createElement("option");
			      opt.appendChild(document.createTextNode(item));
			      opt.value = item;
			      liste.appendChild(opt);
		    }
		    liste.selectedIndex = 0;
	  }
}

composeur.testeChoixComplet = function () {
	  var complet = true;
	  for (var cat in composeur.categories) {
		    var liste = composeur.listes[cat];
		    if (liste.selectedIndex == 0)
			      complet = false;
	  }

	  if (complet)
		    composeur.prix.disabled = false;
	  else
		    composeur.prix.disabled = true;
		composeur.facture.value = "";
}

composeur.afficheFacture = function () {
	  var lignes = [];
	  lignes.push("Prix du repas");
	  lignes.push("");

	  var normalise = function(prixunit) {
		    var ligne = "";
		    var ent = String(Math.floor(prixunit));
		    while (ent.length < 4)
			      ent = " " + ent;
		    var dec = String(Math.floor((prixunit - ent)*100));
		    if (dec.length == 1)
			      dec += "0";
		    ligne += ent + "," + dec;
		    ligne += " €";

		    return ligne;
	  }

	  var total = 0
	  for (var cat in composeur.categories) {
		    var liste = composeur.listes[cat];
		    var item = liste.children[liste.selectedIndex].value;
		    ligne = cat;
		    while (ligne.length < 10)
			      ligne += " ";
		    ligne += ": ";
		    var prixunit = aliments[cat][item];
		    total += prixunit;
		    ligne += normalise(prixunit);
		    lignes.push(ligne);
	  }
	  lignes.push("---------------------");
	  lignes.push("Total     : " + normalise(total));

	  composeur.facture.value = lignes.join("\n");
}

composeur.init = function () {
	  composeur.formulaire = document.forms["menu_form"];
	  composeur.listes = {};
	  composeur.categories = {
		    "entrees": "Entrée",
		    "plats":"Plat",
		    "desserts": "Dessert",
		    "boissons": "Boisson"
	  };
	  composeur.listes["entrees"] = composeur.formulaire.liste_entrees;
	  composeur.listes["plats"] = composeur.formulaire.liste_plats;
	  composeur.listes["desserts"] = composeur.formulaire.liste_desserts;
	  composeur.listes["boissons"] = composeur.formulaire.liste_boissons;
	  composeur.prix = composeur.formulaire.prix;
	  composeur.prix.onclick = composeur.afficheFacture;
	  composeur.facture = document.getElementById("facture");
	  composeur.facture.value = "";

	  composeur.initialiseListesDeroulantes();
	  composeur.testeChoixComplet();
};
