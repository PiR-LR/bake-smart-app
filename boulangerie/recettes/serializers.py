from rest_framework import serializers
from .models import Recette, Ingredient
from .forms import RecetteForm

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class RecetteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recette
        fields = '__all__'
        form_class = RecetteForm