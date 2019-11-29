#!/usr/bin/env python3

from random import shuffle


def cree_enregistrement_voiture(voiture, entete):
    enregistrement = {}

    # On parcourt simultanément l'en-tête et la ligne correspondant à la voiture courante.
    # Si la valeur de l'en-tête n'est pas vide (il y a 3 ou 4 valeurs vides sur la partie
    # droite du fichier csv) on crée l'association dans le dictionnaire.
    for i in range(len(entete)):
        if len(entete[i]) > 0:
            if entete[i] == 'lib_mrq':
                enregistrement['marque'] = voiture[i].title()
            elif entete[i] == 'dscom':
                enregistrement['modèle'] = voiture[i].title()
            elif entete[i] == 'puiss_max':
                enregistrement['puissance'] = int(float(voiture[i].replace(",", ".")))
            elif entete[i] == 'conso_mixte':
                enregistrement['consommation moyenne'] = float(voiture[i].replace(",", "."))
            elif entete[i] == 'co2':
                enregistrement['co2'] = int(voiture[i])
            elif entete[i] == 'nox':
                enregistrement['nox'] = float(voiture[i].replace(",", "."))
            elif entete[i] == 'hybride' and voiture[i] == "oui":
                # On ne veut pas garder les hybrides dans la liste
                raise ValueError("Véhicule hybride: à rejeter")

    return enregistrement


def lecture_fichier(nombre=None):
    # On ouvre le fichier en lecture seule. Attention, le fichier n'est pas encodé en utf-8,
    # mais en iso-8859-1.
    doublons = set([])
    with open("mars-2014-complete.csv", mode="r", encoding="latin-1") as fichier_csv:
        premiere_ligne = True

        # La table des voitures. Chaque voiture sera un dictionnaire où les clés seront les en-tête
        # des colonnes du fichier csv.
        table_voitures = []

        # Attention: les trois dernières colonnes du fichier csv sont vides: il faut donc
        # systématiquement les éliminer. On peut pour cela utiliser la syntaxe liste[:-3].
        for ligne in fichier_csv:
            if premiere_ligne:
                # La première ligne du tableau doit être traitée à part: elle donne le nom
                # de chaque colonne, et sera utilisée ensuite pour créer les dictionnaires
                # caractérisant chaque véhicule.
                #
                # On utilise une compréhension de liste afin de s'assurer qu'il ne reste aucun
                # espace autour des noms grâce à la méthode str.strip
                entete = [s.strip() for s in ligne.split(";")]
                premiere_ligne = False
            else:
                # On décompose la ligne correspondant à une voiture de manière exactement similaire
                # la décomposition de l'en-tête, puis on crée le dictionnaire combinant cette ligne
                # et les valeurs de l'en-tête.
                try:
                    v = cree_enregistrement_voiture([s.strip() for s in ligne.split(";")], entete)
                    id = (v["marque"], v["modèle"], v["puissance"],
                          v["consommation moyenne"], v["co2"], v["nox"])
                    if id not in doublons:
                        table_voitures.append(v)
                        doublons.add(id)
                except ValueError:
                    pass

        shuffle(table_voitures)
        if nombre is None:
            return table_voitures
        else:
            nombre = min(nombre, len(table_voitures))
            return table_voitures[:nombre]
