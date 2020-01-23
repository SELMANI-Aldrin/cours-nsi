var initialiseFormulaires = function() {
    // on récupère des références vers les deux formulaires:
	  var sport_form = document.forms["sport-form"];
	  var payment_form = document.forms["payment-form"];

    // On place des encoches sur certaines options, qui seront sélectionnées par
    // défaut:
	  sport_form.handball.checked = true;
	  sport_form.football.checked = false;
	  sport_form.baseball.checked = false;
	  sport_form.basketball.checked = true;

	  payment_form.cb.checked = true;
	  payment_form.code.value = "";

    // La zone de résultats est initialement vide:
	  resultat = document.getElementById("resultat");
	  resultat.innerHTML = "";

}

var valideCode = function(codestr) {
    // On teste si le code dans la zone de saisie de texte est un entier compris
    // entre 1 et 9999. La fonction renvoie -1 en cas de code invalide:
	  code = parseInt(codestr);
	  if (isNaN(code) || code < 0 || code > 9999)
		    code = -1;

	  return code;
}

var validePaiement = function() {
    // Cette fonction va lire les options choisies dans les deux formulaires, et
    // va calculer la facture. Cette facture sera ensuite affichée dans la zone
    // des résultats.

	  var sport_form = document.forms["sport-form"];

    // On compte le nombre de sports pratiqués:
	  sportcount = 0;
	  if (sport_form.handball.checked == true)
		    sportcount += 1;
	  if (sport_form.football.checked == true)
		    sportcount += 1;
	  if (sport_form.baseball.checked == true)
		    sportcount += 1;
	  if (sport_form.basketball.checked == true)
		    sportcount += 1;

    // On crée un tableau qui contiendra les lignes html à placer dans la zone
    // des résultats:
	  var lignes = Array();
	  lignes.push("<hr />");

    // Quel est le mode de paiement choisi ?
	  var payment_form = document.forms["payment-form"];
	  payment = -1;
	  if (payment_form.cb.checked == true)
		    payment = 0;
	  if (payment_form.cheque.checked == true)
		    payment = 1;
	  if (payment_form.liquide.checked == true)
		    payment = 2;


    // Les choix sont ils valides (en gros: si CB est choisi, le code est-il
    // valide) ?

	  valide = true;
	  if (payment == 0) {
		    code = valideCode(payment_form.code.value);
		    if (code == -1) {
			      lignes.push("<p> Paiment impossible: le code de votre CB n'est pas un code valide !</p>");
			      valide = false;
		    }
	  }

	  if (valide) {
		    if (sportcount == 0) {
			      lignes.push("<p> Vous ne souhaitez pratiquer aucun sport...</p>");

		    } else {
			      prix_unitaire = 42;
			      prix = sportcount * prix_unitaire;

			      lignes.push("<p>");
			      lignes.push("Prix par sport pratiqué: " + prix_unitaire + " €.");
			      lignes.push("<br />");
			      if (sportcount == 1) {
				        lignes.push("Vous souhaitez pratiquer un seul sport.");
			      } else {
				        lignes.push("Vous souhaitez pratiquer " + sportcount + " sports.");
			      }
			      lignes.push("<br />");

            // L'instruction switch n'a pas d'équivalent en python. Elle
            // remplace avantageusement une longue suite de if... elif...
            // elif... elif... else...
			      switch(payment) {
				    case 0:
					      lignes.push("Prix total: " + prix + " €, payable par CB (code=" + code + ").");
					      break;
				    case 1:
					      lignes.push("Prix total: " + prix + " €, payable par chèque.");
					      break;
				    case 2:
					      lignes.push("Prix total: " + prix + " €, payable en liquide.");
					      break;
			      }
			      lignes.push("</p>");
		    }
	  }

    // Enfin, on affiche le contenu du tableau lignes dans la zone des
    // résultats:
	  resultat = document.getElementById("resultat");
	  resultat.innerHTML = lignes.join("\n");
}
