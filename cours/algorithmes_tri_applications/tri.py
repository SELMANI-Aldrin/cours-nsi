"""
Un module permettant de tester des algorithmes de tri.

Pour l'instant, ne permet que d'effectuer un tri à bulles. On a rajouté la
possibilité de préciser l'ordre de tri (croissant ou décroissant), ainsi qu'un
moyen pour transformer les valeurs avant comparaison à l'aide d'une fonction
optionnelle.
"""

def tri_à_bulles(tableau, ordre_décroissant=False, clé=lambda elt: elt):
    """Renvoie None

    Trie le tableau *en place*, c'est-à-dire en réordonnant ses éléments.

    L'algorithme utilisé est le tri à bulles (version Optimizing bubble sort)
    https://en.wikipedia.org/wiki/Bubble_sort

    Cette fonction ne renvoie aucune valeur (None):
    >>> tri_à_bulles([1, 3, 2])

    Elle fonctionne donc par effet de bord, en modifiant le tableau fourni en
    paramètre: il est donc indispensable que celui-ci soit accessible par une
    variable:
    >>> t = [1, 3, 2]
    >>> tri_à_bulles(t)
    >>> t
    [1, 2, 3]

    Le tableau peut contenir plusieurs éléments identiques:
    >>> t = [1, 6, 5, 1, 9, 7, 6, 3, 2, 0, 5]
    >>> tri_à_bulles(t)
    >>> t
    [0, 1, 1, 2, 3, 5, 5, 6, 6, 7, 9]

    Le tableau peut être vide, il ne se passera alors rien:
    >>> t = []
    >>> tri_à_bulles(t)
    >>> t
    []

    Par défaut, le tri s'effectue suivant l'ordre croissant des valeurs. Pour
    changer cela, utiliser le paramètre booléen optionnel ordre_décroissant:
    >>> t = [1, 6, 5, 1, 9, 7, 6, 3, 2, 0, 5]
    >>> tri_à_bulles(t, ordre_décroissant=True)
    >>> t
    [9, 7, 6, 6, 5, 5, 3, 2, 1, 1, 0]

    Lorsque les données sont complexes (par exemple des tuples), elles sont
    comparées par défaut suivant l'ordre lexicographique:
    >>> t = [('Pascal', 'Blaise', 1623),
    ...      ('Emmanuel', 'Kant', 1724),
    ...      ('Friedrich', 'Nietzsche', 1844),
    ...      ('René', 'Descartes', 1596)]
    >>> tri_à_bulles(t)
    >>> t
    [('Emmanuel', 'Kant', 1724), ('Friedrich', 'Nietzsche', 1844), ('Pascal', 'Blaise', 1623), ('René', 'Descartes', 1596)]

    On peut vouloir trier d'abord par rapport au nom de famille. Pour cela, on
    peut utiliser le paramètre optionnel clé qui doit être une fonction prenant
    en entrée une des valeurs du tableau, et retournant une version transformée
    de celle-ci qui sera directement comparées aux autres. Dans notre cas, on
    ne renvoie que le nom de famille:
    >>> t = [('Pascal', 'Blaise', 1623),
    ...      ('Emmanuel', 'Kant', 1724),
    ...      ('Friedrich', 'Nietzsche', 1844),
    ...      ('René', 'Descartes', 1596)]
    >>> def nom_de_famille(elt):
    ...     return elt[1]
    >>> tri_à_bulles(t, clé=nom_de_famille)
    >>> t
    [('Pascal', 'Blaise', 1623), ('René', 'Descartes', 1596), ('Emmanuel', 'Kant', 1724), ('Friedrich', 'Nietzsche', 1844)]

    Il est indispensable que les données du tableau soient comparables à l'aide
    des opérateurs standards (<, >, <=, etc...), sous peine de déclencher une
    exception:
    >>> t = [1, "trois", 2]
    >>> tri_à_bulles(t)
    Traceback (most recent call last):
       ...
    TypeError: '>' not supported between instances of 'int' and 'str'

    """

    hauteur_tri = len(tableau)
    # On s'assure de rentrer au minimum une fois dans la boucle (puisqu'il n'y
    # a pas d'instruction repeat...until en python).
    permutation = True
    while permutation:
        # À chaque passage de boucle, on cherche à savoir si au minimum une
        # permutation a été effectuée. Dans le cas contraire, le tableau est
        # entièrement trié et on peut arrêter prématurément.
        permutation = False

        for i in range(1, hauteur_tri):
            élément_courant = clé(tableau[i])
            élément_précédent = clé(tableau[i-1])
            if ((ordre_décroissant is False and élément_précédent > élément_courant) or
                (ordre_décroissant is True and élément_précédent < élément_courant)): 
                tableau[i-1], tableau[i] = tableau[i], tableau[i-1]
                permutation = True

        # Lorsqu'une sous-boucle est terminée, on sait qu'il y a un élément de
        # plus correctement ordonné en fin de tableau: on peut donc baisser la
        # hauteur maximale de tri à effectuer de 1 pour le passage suivant.
        hauteur_tri -= 1

    return None

if __name__ == '__main__':
    import doctest
    doctest.testmod()
