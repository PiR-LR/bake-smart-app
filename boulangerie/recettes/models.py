from django.db import models

class Ingredient(models.Model):
    nom = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nom

class Recette(models.Model):
    nom = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    autolyse = models.IntegerField(blank=True, null=True)
    repos_autolyse = models.IntegerField(blank=True, null=True)
    petrissage = models.IntegerField(blank=True, null=True)
    pointage = models.IntegerField(blank=True, null=True)
    pointage_froid = models.BooleanField(default=False) # Mode Booléen, applique condition Oui/Non
    division = models.IntegerField(blank=True, null=True)
    detente = models.IntegerField(blank=True, null=True)
    faconnage = models.IntegerField(blank=True, null=True)
    appret = models.IntegerField(blank=True, null=True)
    cuisson = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.nom