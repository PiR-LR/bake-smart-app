const SUPABASE_URL = "https://avbsciiwsdttbmxfnyaw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YnNjaWl3c2R0dGJteGZueWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjAwMjAsImV4cCI6MjA3MDIzNjAyMH0.HxmIL35gXM-dLM0uicc4GDDdgdghT79qG3sNLRJ8Dc0";

// Récupère les ingrédients de la table 'ingredients' de Supabase.
async function fetchIngredients() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/ingredients`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    console.error('Échec de la récupération des ingrédients :', response.statusText);
    return [];
  }
  
  const data = await response.json();
  console.log("Ingrédients récupérés de Supabase :", data);
  return data;
}

// Remplit dynamiquement un élément <select> avec les options d'ingrédients.
function populateIngredientSelect(selectElement, ingredients) {
  // On vide le menu déroulant et on ajoute une option par défaut
  selectElement.innerHTML = '<option value="">-- Sélectionnez un ingrédient --</option>'; 
  
  ingredients.forEach(ingredient => {
    const option = document.createElement('option');
    option.value = ingredient.nom; // Ou un identifiant unique si vous en avez un
    option.textContent = `${ingredient.nom}`;
    selectElement.appendChild(option);
  });
}

// Fonction principale à exécuter au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
  const ingredients = await fetchIngredients();
  
  if (ingredients.length > 0) {
    // Sélectionnez tous les menus déroulants d'ingrédients
    const selectElements = document.querySelectorAll('.ingredient-select');
    
    selectElements.forEach(select => {
      populateIngredientSelect(select, ingredients);
    });
  }
});