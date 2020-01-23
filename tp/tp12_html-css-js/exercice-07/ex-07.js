var calculateur = {};

calculateur.init = function() {
	calculateur.zones = [];
	calculateur.zones.push(document.getElementById("zone-triangle"));
	calculateur.zones.push(document.getElementById("zone-sphere"));
	calculateur.zones.push(document.getElementById("zone-parabole"));

	calculateur.images = [];
	calculateur.images.push(document.getElementById("img-triangle"));
	calculateur.images.push(document.getElementById("img-sphere"));
	calculateur.images.push(document.getElementById("img-parabole"));

	calculateur.forms = [];
	calculateur.forms.push(document.getElementById("form-triangle"));
	calculateur.forms.push(document.getElementById("form-sphere"));
	calculateur.forms.push(document.getElementById("form-parabole"));

	calculateur.resultats = [];
	calculateur.resultats.push(document.getElementById("resultat-triangle"));
	calculateur.resultats.push(document.getElementById("resultat-sphere"));
	calculateur.resultats.push(document.getElementById("resultat-parabole"));

	for (i = 0; i < 3; i++) {
		var img = calculateur.images[i];
		var form = calculateur.forms[i];
		var zone = calculateur.zones[i];
		var resultat = calculateur.resultats[i];

		img.style.gridColumnStart = 1;
		img.style.gridColumnEnd = 1;
		img.style.gridRow = 1;
		form.style.gridColumnStart = 2;
		form.style.gridColumnEnd = 2;
		form.style.gridRow = 1;
		zone.style.gridTemplateColumns = "30% 1fr";

		img.onclick = calculateur.echangeZone(zone, img, form);

		resultat.innerHTML = "";
	}

	calculateur.inputs = {};
	var noms = [
		"param-a", "param-b", "param-c",
		"param-r", "coeff-a", "coeff-b",
		"coeff-c"
	];
	for(var n in noms) {
		nom = noms[n];
		calculateur.inputs[nom] = document.getElementById(nom);
		calculateur.inputs[nom].value = "";
	}
};

calculateur.echangeZone = function(zone, img, form) {
	var callback = function() {
		var col = img.style.gridColumnStart;
		img.style.gridColumnStart = 3 - col;
		img.style.gridColumnEnd = 3 - col;
		form.style.gridColumnStart = col;
		form.style.gridColumnEnd = col;
		img.style.gridRow = 1;
		form.style.gridRow = 1;
		if (col == 1)
			zone.style.gridTemplateColumns = "1fr 30%"
		else
			zone.style.gridTemplateColumns = "30% 1fr";
	};

	return callback;
};

calculateur.aire = function() {
	var a = parseFloat(calculateur.inputs["param-a"].value);
	var b = parseFloat(calculateur.inputs["param-b"].value);
	var c = parseFloat(calculateur.inputs["param-c"].value);
	var resultat = calculateur.resultats[0];

	if (isNaN(a) || a < 0.0) {
		resultat.innerHTML = "La longueur <span style='font-style: italic'>a</span> n'est pas valide";
		return;
	}
	if (isNaN(b) || b < 0.0) {
		resultat.innerHTML = "La longueur <span style='font-style: italic'>b</span> n'est pas valide";
		return;
	}
	if (isNaN(c) || c < 0.0) {
		resultat.innerHTML = "La longueur <span style='font-style: italic'>c</span> n'est pas valide";
		return;
	}

	if (a > b + c || b > a + c || c > a + b) {
		resultat.innerHTML = "Les 3 longueurs ne permettent pas de former un triangle";
		return;
	}

	var p = (a + b + c) / 2;
	var aire = Math.sqrt(p*(p-a)*(p-b)*(p-c));
	resultat.innerHTML = "Aire du triangle:&nbsp;" + aire;

}

calculateur.volume = function() {
	var r = parseFloat(calculateur.inputs["param-r"].value);
	var resultat = calculateur.resultats[1];

	if (isNaN(r) || r < 0.0) {
		resultat.innerHTML = "La rayon <span style='font-style: italic'>r</span> n'est pas valide";
		return;
	}

	var volume = 4.0/3.0*Math.PI*Math.pow(r, 3);
	resultat.innerHTML = "Volume de la sphère:&nbsp;" + volume;

}

calculateur.racines = function() {
	var a = parseFloat(calculateur.inputs["coeff-a"].value);
	var b = parseFloat(calculateur.inputs["coeff-b"].value);
	var c = parseFloat(calculateur.inputs["coeff-c"].value);
	var resultat = calculateur.resultats[2];

	if (isNaN(a) || a == 0.0) {
		resultat.innerHTML = "Le coefficient <span style='font-style: italic'>a</span> n'est pas un nombre (ou est nul)";
		return;
	}
	if (isNaN(b)) {
		resultat.innerHTML = "Le coefficient <span style='font-style: italic'>b</span> n'est pas un nombre";
		return;
	}
	if (isNaN(c)) {
		resultat.innerHTML = "Le coefficient <span style='font-style: italic'>c</span> n'est pas un nombre";
		return;
	}

	var lignes = [];
	var delta = b*b - 4*a*c;
	if (delta < 0) {
		lignes.push("<p>&Delta;=" + delta + " &rArr; deux racines complexes conjuguées&nbsp;:</p>")
		var re = -b/(2*a);
		var im = Math.sqrt(-delta)/2*a
		lignes.push("<p>z<sub>i</sub>&nbsp;=&nbsp;" + re + "&nbsp;&plusmn;&nbsp; i&sdot;" + im + "</p>")
	}
	if (delta == 0.0) {
		lignes.push("<p>&Delta;=" + delta + " &rArr; une racine double&nbsp;:</p>")
		var x = -b/(2*a);
		lignes.push("<p>x<sub>0</sub>&nbsp;=&nbsp;" + x + "</p>")

	}
	if (delta > 0.0) {
		lignes.push("<p>&Delta;=" + delta + " &rArr; deux racine réelles distinctes&nbsp;:</p>")
		var x1 = (-b - Math.sqrt(delta))/(2*a);
		var x2 = (-b + Math.sqrt(delta))/(2*a);
		lignes.push("<p>x<sub>1</sub>&nbsp;=&nbsp;" + x1 + "<br />")
		lignes.push("x<sub>2</sub>&nbsp;=&nbsp;" + x2 + "</p>")

	}

	resultat.innerHTML = lignes.join("\n");
}
