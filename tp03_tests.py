def test_puissance(fonction_à_tester, début=1, fin=256):
    try:
        for n in range(début, fin):
            p = fonction_à_tester(n)

            # On s'assure que p est une puissance de deux:
            pp = p
            while pp > 1 and pp % 2 == 0:
                pp = pp // 2
            assert pp == 1, "n={}, p={}: {} n'est pas une puissance de 2".format(n, p, p)

            # On s'assure que p <= n:
            assert p <= n, "n={}, p={}: On n'a pas la condition {} <= {}".format(n, p, p, n)

            # On s'assure que c'est le plus grand nombre à satisfaire ces critères:
            assert 2*p > n, "n={}, p={}: {} n'est pas la plus grande puissance de deux <= {}".format(n, p, p, n)
    except AssertionError as err:
        print(err)
    else:
        print("Tous les tests ont été validés entre {} et {} !".format(début, fin-1))

def test_dec_vers_bin(fonction_à_tester, début=0, fin=256):
    try:
        for n in range(début, fin):
            chaîne1 = fonction_à_tester(n)
            chaîne2 = bin(n)
            assert chaîne1 == chaîne2, \
                "Pour n={} on trouve {} alors qu'on devrait avoir {}".format(n, chaîne1, chaîne2)
    except AssertionError as err:
        print(err)
    else:
        print("Tous les tests ont été validés entre {} et {} !".format(début, fin-1))

def test_bin_vers_dec(fonction_à_tester, début=0, fin=256):
    try:
        for n in range(début, fin):
            binaire = bin(n)[2:]
            nn = fonction_à_tester(binaire)
            assert nn == n, "Pour n=0b{} on a eu {} au lieu de {}".format(binaire, nn, n)
    except AssertionError as err:
        print(err)
    else:
        print("Tous les tests ont été validés entre {} et {} !".format(début, fin-1))

def test_dec_vers_hex(fonction_à_tester, début=0, fin=256):
    try:
        for n in range(début, fin):
            chaîne1 = fonction_à_tester(n)
            chaîne2 = hex(n)
            assert chaîne1 == chaîne2, \
                "Pour n={} on trouve {} alors qu'on devrait avoir {}".format(n, chaîne1, chaîne2)
    except AssertionError as err:
        print(err)
    else:
        print("Tous les tests ont été validés entre {} et {} !".format(début, fin-1))

def test_hex_vers_dec(fonction_à_tester, début=0, fin=256):
    try:
        for n in range(début, fin):
            hexa = hex(n)[2:]
            nn = fonction_à_tester(hexa)
            assert nn == n, "Pour n=0b{} on a eu {} au lieu de {}".format(hexa, nn, n)
    except AssertionError as err:
        print(err)
    else:
        print("Tous les tests ont été validés entre {} et {} !".format(début, fin-1))
