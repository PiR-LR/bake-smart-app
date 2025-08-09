from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from recettes.views import RecetteViewSet, IngredientViewSet
from recettes import views  # Ajout de cet import


router = routers.DefaultRouter()
router.register(r'recettes', RecetteViewSet)
router.register(r'ingredients', IngredientViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('planifier/', views.planifier_production, name='planifier_production'),

]