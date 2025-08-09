// Fichier : supabase-data.js

const SUPABASE_URL = "https://avbsciiwsdttbmxfnyaw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YnNjaWl3c2R0dGJteGZueWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NjAwMjAsImV4cCI6MjA3MDIzNjAyMH0.HxmIL35gXM-dLM0uicc4GDDdgdghT79qG3sNLRJ8Dc0";

// Cette fonction se connecte à Supabase et renvoie la liste des ingrédients.
export async function fetchIngredients() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/ingredients`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    console.error('Erreur lors de la récupération des ingrédients :', response.statusText);
    return []; // Retourne un tableau vide en cas d'erreur
  }

  const data = await response.json();
  return data;
}