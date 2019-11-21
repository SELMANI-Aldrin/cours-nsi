from time import time

from tri import tri_à_bulles
from data import lecture_fichier

if __name__ == '__main__':
    voitures = lecture_fichier()

    def clé_pollution(voiture):
        return (-voiture["co2"], voiture["marque"], voiture["modèle"])
    voitures.sort(key=clé_pollution)

    print("Palmarès des modèles les plus polluants (un seul par marque):\n")
    déjà_vu = []
    nombre_à_afficher = 5
    nombre = 0
    i = 0
    while i < len(voitures) and nombre < nombre_à_afficher:
        v = voitures[i]
        if v["marque"] not in déjà_vu:
            nombre += 1
            print(f"{nombre}: {v['marque']} / {v['modèle']} émet {v['co2']} g/km de CO2")
            déjà_vu.append(v["marque"])
        i += 1

    def clé_consommation(voiture):
        return (voiture["consommation moyenne"], -voiture["puissance"], voiture["marque"], voiture["modèle"])
    voitures.sort(key=clé_consommation)

    print("\n\nPalmarès de modèles les plus économes en carburant (un seul par marque):\n")
    déjà_vu = []
    nombre_à_afficher = 5
    nombre = 0
    i = 0
    while i < len(voitures) and nombre < nombre_à_afficher:
        v = voitures[i]
        if v["marque"] not in déjà_vu:
            nombre += 1
            print(f"{nombre}: {v['marque']} / {v['modèle']} consomme {v['consommation moyenne']:.2}L/100km")
            déjà_vu.append(v["marque"])
        i += 1
