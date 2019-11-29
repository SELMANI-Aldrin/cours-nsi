class testeur:
    def __init__(self, fonction_à_tester, début=1, fin=256, max_erreurs = 10):
        self.fonction_à_tester = fonction_à_tester
        self.début = début
        self.fin = fin
        self.max_erreurs = max_erreurs

    def teste(self, début=None, fin=None, max_erreurs=None):
        if début == None:
            début = self.début
        if fin == None:
            fin = self.fin
        if max_erreurs == None:
            max_erreurs = self.max_erreurs

        nbr_erreurs = 0
        for n in range(début, fin):
            try:
                self.définition_test(n)
            except AssertionError as err:
                print(err)
                nbr_erreurs += 1
                if nbr_erreurs > max_erreurs:
                    break
        if nbr_erreurs == 0:
            print("Tous les tests ont été validés entre {} et {} !".format(début, fin-1))
        else:
            print("----------")
            print("Trop d'erreurs: on arrête le test...")

    def définition_test(self, n):
        pass

class testeur_puissance(testeur):
    def définition_test(self, n):
        p = self.fonction_à_tester(n)

        # On s'assure que p est une puissance de deux:
        pp = p
        while pp > 1 and pp % 2 == 0:
            pp = pp // 2
        assert pp == 1, "Pour n={} on obtient p={}: {} n'est pas une puissance de 2".format(n, p, p)

        # On s'assure que p <= n:
        assert p <= n, "Pour n={} on obtient p={}: On n'a pas la condition {} <= {}".format(n, p, p, n)

        # On s'assure que c'est le plus grand nombre à satisfaire ces critères:
        assert 2*p > n, "Pour n={} on obtient p={}: {} n'est pas la plus grande puissance de deux <= {}".format(n, p, p, n)

def test_puissance(fonction_à_tester, début=1, fin=256, max_erreurs=10):
    testeur_puissance(fonction_à_tester, début, fin, max_erreurs).teste()

class testeur_dec_vers_bin(testeur):
    def définition_test(self, n):
        chaîne1 = self.fonction_à_tester(n)
        chaîne2 = bin(n)
        assert chaîne1 == chaîne2, \
            "Pour n={} on obtient {} alors qu'on devrait avoir {}".format(n, chaîne1, chaîne2)

def test_dec_vers_bin(fonction_à_tester, début=0, fin=256, max_erreurs=10):
    testeur_dec_vers_bin(fonction_à_tester, début, fin, max_erreurs).teste()

class testeur_bin_vers_dec(testeur):
    def définition_test(self, n):
        binaire = bin(n)[2:]
        nn = self.fonction_à_tester(binaire)
        assert nn == n, "Pour n=0b{} on obtient {} au lieu de {}".format(binaire, nn, n)

def test_bin_vers_dec(fonction_à_tester, début=0, fin=256, max_erreurs=10):
    testeur_bin_vers_dec(fonction_à_tester, début, fin, max_erreurs).teste()

class testeur_dec_vers_hex(testeur):
    def définition_test(self, n):
        chaîne1 = self.fonction_à_tester(n)
        chaîne2 = hex(n)
        assert chaîne1.upper() == chaîne2.upper(), \
            "Pour n={} on obtient {} alors qu'on devrait avoir {}".format(n, chaîne1, chaîne2)

def test_dec_vers_hex(fonction_à_tester, début=0, fin=256, max_erreurs=10):
    testeur_dec_vers_hex(fonction_à_tester, début, fin, max_erreurs).teste()

class testeur_hex_vers_dec(testeur):
    def définition_test(self, n):
        hexa = hex(n)[2:]
        nn = self.fonction_à_tester(hexa)
        assert nn == n, "Pour n=0x{} on obtient {} au lieu de {}".format(hexa, nn, n)

def test_hex_vers_dec(fonction_à_tester, début=0, fin=256, max_erreurs=10):
    testeur_hex_vers_dec(fonction_à_tester, début, fin, max_erreurs).teste()
