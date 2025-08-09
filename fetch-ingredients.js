const SUPABASE_URL = 'https://TON-PROJET.supabase.co';
const SUPABASE_KEY = 'ta_clé_api_publique';

fetch(`${SUPABASE_URL}/rest/v1/ingredients`, {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`
  }
})
.then(res => res.json())
.then(data => {
  console.log("Ingrédients récupérés :", data);
  // Tu peux maintenant remplir une liste dans ton HTML avec ces données !
});
