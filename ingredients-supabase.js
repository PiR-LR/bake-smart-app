// Ce fichier va charger les ingrédients depuis Supabase

const SUPABASE_URL = "https://avbsciiwsdttbmxfnyaw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YnNjaWl3c2R0dGJteGZueWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjAwMjAsImV4cCI6MjA3MDIzNjAyMH0.HxmIL35gXM-dLM0uicc4GDDdgdghT79qG3sNLRJ8Dc0";

// Fonction pour charger les ingrédients depuis Supabase
async function chargerIngredientsDepuisSupabase() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/ingredients`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  const data = await response.json();
  console.log("Ingrédients depuis Supabase :", data);
  return data;
}
