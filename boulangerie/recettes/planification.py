def generer_tableau_visuel(recettes):
    print("Recettes reçues :", recettes)  # Ajout de l'instruction print
    tableau = []
    for recette in recettes:
        print("Recette traitée :", recette.nom)  # Ajout de l'instruction print
        ligne = {"recette": recette.nom, "cases": []}
        etapes = [
            ("Autolyse", recette.autolyse),
            ("Pétrissage", recette.petrissage),
            ("Division", recette.division),
            ("Façonnage", recette.faconnage),
            ("Cuisson", recette.cuisson),
        ]
        for etape, duree in etapes:
            if duree is not None and duree > 0:
                nombre_cases = calculer_nombre_cases(duree)
                ligne["cases"].extend([(etape, nombre_cases)])
        tableau.append(ligne)
    print("Tableau généré :", tableau)  # Ajout de l'instruction print
    return tableau

def calculer_nombre_cases(duree):
    print("Durée :", duree)  # Ajout de l'instruction print
    if 1 <= duree <= 20:
        return 1
    elif 21 <= duree <= 35:
        return 2
    elif 36 <= duree <= 50:
        return 3
    else:
        return 4