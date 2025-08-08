// Base de données des ingrédients et de leur pourcentage d'eau.
// C'est la référence pour tous les calculs de l'outil 1.

const INGREDIENTS_HYDRATATION = {
    // Liquides
    "eau": 100,
    "lait_entier": 88,
    "lait_demi_ecreme": 90,
    "creme_35": 60,
    "oeuf_entier": 75,
    "jaune_oeuf": 50,
    "blanc_oeuf": 88,

    // Matières grasses
    "beurre_82": 16, // Un beurre à 82% de MG contient environ 16% d'eau
    "beurre_sec_84": 14,
    "mimetic_essentiel": 20, // Valeur indicative pour la démo
    "mimetic_primeur": 20,   // Valeur indicative pour la démo

    // Levures (peuvent avoir un impact minime)
    "levure_fraiche": 70, // La levure fraîche est très humide
    "levure_seche": 7
};
