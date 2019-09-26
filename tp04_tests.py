from random import randint

class testeur:
    def __init__(self, fonction_à_tester):
        self.fonction_à_tester = fonction_à_tester
        self.max_erreurs = 10
        self.nombre_tests = 100

    def lance_tests(self):
        nbr_erreurs = 0
        for n in range(self.nombre_tests):
            try:
                self.définition_test(n)
            except AssertionError as err:
                print(err)
                nbr_erreurs += 1
                if nbr_erreurs > self.max_erreurs:
                    break
        if nbr_erreurs == 0:
            print("{} tests validés avec succès !".format(self.nombre_tests))
        else:
            print("----------")
            print("Trop d'erreurs: on arrête le test...")

    def définition_test(self, n):
        pass

class testeur_entiers_aléatoires(testeur):
    def définition_test(self, n):
        if n == 0:
            N = 0
            a = b = 0
        else:
            N = randint(1, 1000)
            a = randint(-100, 100)
            b = a + randint(0, 200)

        résultat = self.fonction_à_tester(N, a, b)

        assert type(résultat) == type([]), "Pour (N, a, b)=({}, {}, {}) le résultat n'est pas un tableau".format(N, a, b)

        assert len(résultat) == N, "Pour N={} on obtient un tableau de longueur {}".format(N, len(résultat))

        tous_entiers = True
        for elt in résultat:
            if type(elt) != int:
                tous_entiers = False
        assert tous_entiers == True, "Certains éléments du tableau ne sont pas des entiers"

        for elt in résultat:
            assert a <= elt <= b, \
                "Pour (N,a,b) == ({}, {}, {}) on a un des éléments du tableau valant {}".format(N, a, b, elt)

class testeur_minimum(testeur):
    def définition_test(self, n):
        if n == 0:
            erreur = False
            try:
                self.fonction_à_tester([])
            except AssertionError:
                erreur = True
            assert erreur == True, "Attention: Pas de déclenchement d'erreur pour un tableau vide"
        else:
            t = [randint(1, 1000) for _ in range(randint(1, self.max_taille_tableau))]
            mini = self.fonction_à_tester(t)
            assert mini == min(t), "Pour tableau={}, mauvais minimum: {} au lieu de {}".format(repr(t), mini, min(t))

class testeur_maximum(testeur):
    def définition_test(self, n):
        if n == 0:
            erreur = False
            try:
                self.fonction_à_tester([])
            except AssertionError:
                erreur = True
            assert erreur == True, "Attention: Pas de déclenchement d'erreur pour un tableau vide"
        else:
            t = [randint(1, 1000) for _ in range(randint(1, self.max_taille_tableau))]
            maxi = self.fonction_à_tester(t)
            assert maxi == max(t), "Pour tableau={}, mauvais maximum: {} au lieu de {}".format(repr(t), maxi, max(t))

class testeur_nombre_occurences(testeur):
    def définition_test(self, n):
        if n == 0:
            t = []
        else:
            N = self.max_taille_tableau
            t = [randint(1, N // 4) for _ in range(randint(N // 2, N))]
            a = randint(0, N // 4 + 1)
            nombre = self.fonction_à_tester(t, a)
            assert type(nombre) == int and nombre >= 0, "Pour tableau={} le résultat ({}) n'est pas un entier naturel".format(repr(t), nombre)
            vrai_nombre = t.count(a)
            assert nombre == vrai_nombre, "Pour tableau={} on trouve {} occurences de {} alors qu'il y en a {}".format(repr(t), nombre, a, vrai_nombre)
