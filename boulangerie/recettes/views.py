import json
from rest_framework import viewsets
from .models import Recette, Ingredient
from .serializers import RecetteSerializer, IngredientSerializer
from .planification import generer_tableau_visuel
from django.shortcuts import render

class RecetteViewSet(viewsets.ModelViewSet):
    queryset = Recette.objects.all()
    serializer_class = RecetteSerializer

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

def planifier_production(request):
    if request.method == 'POST':
        recettes_ids = request.POST.getlist('recettes')
        recettes = Recette.objects.filter(id__in=recettes_ids)
        tableau_visuel = generer_tableau_visuel(recettes)
        tableau_json = json.dumps(tableau_visuel)  # Sérialiser en JSON
        return render(request, 'recettes/organigramme.html', {'tableau_json': tableau_json})
    else:
        recettes = Recette.objects.all()
        return render(request, 'recettes/planification.html', {'recettes': recettes})