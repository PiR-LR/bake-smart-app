from django import forms
from django_select2 import forms as s2forms
from .models import Recette, Ingredient

class RecetteForm(forms.ModelForm):
    class Meta:
        model = Recette
        fields = ['nom', 'description', 'autolyse', 'repos_autolyse', 'petrissage', 'pointage', 'pointage_froid', 'division', 'detente', 'faconnage', 'appret', 'cuisson'] # ingredients supprimé ici