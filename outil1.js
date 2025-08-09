// Fichier : outil1.js (version corrigée et unifiée)

// Importe la fonction fetchIngredients depuis le nouveau module
import { fetchIngredients } from './supabase-data.js';

document.addEventListener('DOMContentLoaded', () => {
    const tool1 = document.getElementById('outil1');
    if (!tool1) return;

    window.chartLiquides = null;
    window.chartRatio = null;

    // --- NOUVEAU : ON REMPLACE LA LISTE STATIQUE ---
    // On déclare une variable pour stocker les ingrédients de la base de données
    let supabaseIngredients = {};

    // --- RÉFÉRENCES AUX ÉLÉMENTS DU DOM ---
    const form = document.getElementById('hydration-form');
    const addIngredientBtn = document.getElementById('add-ingredient-tool1');
    const dynamicContainer = document.getElementById('dynamic-ingredients-container');
    const ingredientTemplate = document.getElementById('dynamic-ingredient-template');
    const totalSechesEl = document.getElementById('total-seches-valeur');
    const totalEauEl = document.getElementById('total-eau-valeur');
    const tauxHydratationEl = document.getElementById('taux-hydratation-valeur');
    const detailContainer = document.getElementById('resultats-liquides-detail');
    
    let apportsLiquides = []; 
    let totalMatieresSeches = 0;
    let totalLiquides = 0;

    // --- FONCTION POUR REMPLIR LES SELECT AVEC LES DONNÉES DE SUPABASE ---
    const populateIngredientSelects = (ingredients) => {
        // Sélectionne tous les éléments <select> qui ont la classe 'ingredient-select'
        const selects = document.querySelectorAll('.ingredient-select');
        selects.forEach(select => {
            select.innerHTML = '<option value="">-- Choisir un ingrédient --</option>';
            ingredients.forEach(ingredient => {
                const option = document.createElement('option');
                option.value = ingredient.cle_js; // Assure-toi que cette clé correspond à ta colonne "cle_js" dans Supabase
                option.textContent = ingredient.nom_ingredient; // Nom de la colonne dans Supabase
                select.appendChild(option);
            });
        });
    };

    // --- FONCTION DE MISE À JOUR DES GRAPHIQUES ---
    const updateCharts = () => {
        if (window.chartLiquides) window.chartLiquides.destroy();
        if (window.chartRatio) window.chartRatio.destroy();

        const liquidesFiltres = apportsLiquides.filter(l => l.poidsEau > 0);
        if (liquidesFiltres.length > 0) {
            window.chartLiquides = new Chart(document.getElementById('chart-liquides').getContext('2d'), {
                type: 'pie',
                data: {
                    labels: liquidesFiltres.map(l => l.nom),
                    datasets: [{ data: liquidesFiltres.map(l => l.poidsEau), backgroundColor: ['#00BFFF', '#87CEEB', '#FFD700', '#F0E68C', '#E0FFFF', '#ADD8E6', '#F5DEB3', '#D2B48C', '#F4A460'], borderWidth: 1 }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }

        if (totalMatieresSeches > 0 || totalLiquides > 0) {
            window.chartRatio = new Chart(document.getElementById('chart-ratio').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Matières Sèches', 'Total Liquides (eau)'],
                    datasets: [{ data: [totalMatieresSeches, totalLiquides], backgroundColor: ['#A0522D', '#4682B4'], borderWidth: 1 }]
                },
                options: { responsive: true }
            });
        }
    };

    // --- FONCTION PRINCIPALE DE CALCUL ET D'AFFICHAGE ---
    const calculateAndDisplay = () => {
        totalMatieresSeches = 0;
        totalLiquides = 0;
        apportsLiquides = [];

        const poids = {
            farine: parseFloat(document.getElementById('tool1-farine').value) || 0,
            sel: parseFloat(document.getElementById('tool1-sel').value) || 0,
            sucre: parseFloat(document.getElementById('tool1-sucre').value) || 0,
            levure: parseFloat(document.getElementById('tool1-levure').value) || 0,
            eau: parseFloat(document.getElementById('tool1-eau').value) || 0,
            lait: parseFloat(document.getElementById('tool1-lait').value) || 0,
            oeuf: parseFloat(document.getElementById('tool1-oeuf').value) || 0,
            jaune: parseFloat(document.getElementById('tool1-jaune').value) || 0,
            blanc: parseFloat(document.getElementById('tool1-blanc').value) || 0,
            fat_weight: parseFloat(document.getElementById('tool1-fat-weight').value) || 0,
        };
        const fat_type_html = document.getElementById('tool1-fat-type').value;

        totalMatieresSeches = poids.farine;

        // --- MODIFIE : LA FONCTION addLiquide UTILISE MAINTENANT les pourcentages de Supabase ---
        const addLiquide = (nom, poidsTotalIngredient, cle_js, icone) => {
            const ingredientData = supabaseIngredients.find(ing => ing.cle_js === cle_js);
            if (poidsTotalIngredient > 0 && ingredientData) {
                const apportEnEau = poidsTotalIngredient * (ingredientData.eau_pourcent / 100);
                apportsLiquides.push({ nom, poidsEau: apportEnEau, poidsTotal: poidsTotalIngredient, icone });
                totalLiquides += apportEnEau;
            }
        };

        addLiquide('Eau', poids.eau, 'eau', '💧');
        addLiquide('Lait entier', poids.lait, 'lait_entier', '🥛');
        addLiquide('Oeufs entiers', poids.oeuf, 'oeuf_entier', '🥚');
        addLiquide("Jaunes d'oeufs", poids.jaune, 'jaune_oeuf', '🟡');
        addLiquide("Blancs d'oeufs", poids.blanc, 'blanc_oeuf', '⚪');
        
        if (poids.fat_weight > 0) {
            const nom_affiche = document.getElementById('tool1-fat-type').selectedOptions[0].text;
            const icone = fat_type_html.includes('huile') ? '🫙' : '🧈';
            addLiquide(nom_affiche, poids.fat_weight, fat_type_html, icone);
        }
        
        dynamicContainer.querySelectorAll('.dynamic-row').forEach(ligne => {
            const select = ligne.querySelector('.ingredient-select');
            const inputPoids = ligne.querySelector('.ingredient-poids');
            if (select && inputPoids) {
                const cle_js = select.value;
                const poidsTotalIngredient = parseFloat(inputPoids.value) || 0;
                if (poidsTotalIngredient > 0) {
                    const nom_affiche = select.selectedOptions[0].text;
                    addLiquide(nom_affiche, poidsTotalIngredient, cle_js, '🧪');
                }
            }
        });

        const tauxHydratationReel = totalMatieresSeches > 0 ? (totalLiquides / totalMatieresSeches) * 100 : 0;

        totalSechesEl.textContent = `${(poids.farine + poids.sel + poids.sucre + poids.levure).toFixed(0)} g`;
        totalEauEl.textContent = `${totalLiquides.toFixed(0)} g`;
        tauxHydratationEl.textContent = `${tauxHydratationReel.toFixed(1)} %`;
        
        detailContainer.innerHTML = '';
        if (apportsLiquides.length > 0) {
            apportsLiquides.sort((a, b) => b.poidsTotal - a.poidsTotal);
            apportsLiquides.forEach(l => {
                if (l.poidsTotal <= 0) return;
                const ligne = document.createElement('div');
                ligne.classList.add('result-line', 'detail-line');
                ligne.innerHTML = `<span class="result-emoji">${l.icone}</span><span>${l.nom}</span><strong>${l.poidsEau.toFixed(0)} g</strong>`;
                detailContainer.appendChild(ligne);
            });
        } else {
            detailContainer.innerHTML = '<p class="placeholder">Aucun ingrédient humide renseigné.</p>';
        }

        updateCharts();
    };

    /* ==================================================================== */
    /* NOUVELLE FONCTION D'IMPRESSION (ADAPTÉE)                  */
    /* ==================================================================== */
    function imprimerRecette() {
        const farine = document.getElementById('tool1-farine').value || '0';
        const sel = document.getElementById('tool1-sel').value || '0';
        const sucre = document.getElementById('tool1-sucre').value || '0';
        const levure = document.getElementById('tool1-levure').value || '0';

        const totalSecsAffiche = totalSechesEl.textContent;
        const totalLiquidesAffiche = totalEauEl.textContent;
        const thFinalAffiche = tauxHydratationEl.textContent;

        const recapContainer = document.getElementById('print-recap-parametres');
        const detailsLiquidesContainer = document.getElementById('print-details-liquides');

        recapContainer.innerHTML = '';
        detailsLiquidesContainer.innerHTML = '';

        recapContainer.innerHTML += `<p><span>Poids de farine :</span> <strong>${farine} g</strong></p>`;
        recapContainer.innerHTML += `<p><span>Sel :</span> <strong>${sel} g</strong></p>`;
        recapContainer.innerHTML += `<p><span>Sucre :</span> <strong>${sucre} g</strong></p>`;
        recapContainer.innerHTML += `<p><span>Levure :</span> <strong>${levure} g</strong></p>`;
        
        apportsLiquides.forEach(ing => {
            if (ing.poidsTotal > 0) {
                detailsLiquidesContainer.innerHTML += `<p><span>${ing.nom} (${ing.poidsTotal} g) apporte :</span> <strong>${ing.poidsEau.toFixed(1)} g d'eau</strong></p>`;
            }
        });

        document.getElementById('print-total-seches').textContent = totalSecsAffiche;
        document.getElementById('print-total-eau').textContent = totalLiquidesAffiche;
        document.getElementById('print-taux-hydratation').textContent = thFinalAffiche;

        window.print();
    }


    /* ==================================================================== */
    /* ÉCOUTEURS D'ÉVÉNEMENTS (AJOUT DE LA FONCTION ASYNC)       */
    /* ==================================================================== */
    // Fonction asynchrone pour charger les ingrédients et initialiser les événements
    const initialize = async () => {
        try {
            // Récupère les ingrédients de Supabase au début
            supabaseIngredients = await fetchIngredients();
            
            // Remplit les <select> dynamiques avec ces ingrédients
            populateIngredientSelects(supabaseIngredients);
            
            // Met en place tous les écouteurs d'événements
            form.addEventListener('input', calculateAndDisplay);
            
            addIngredientBtn.addEventListener('click', () => {
                const newIngredientRow = ingredientTemplate.content.cloneNode(true);
                dynamicContainer.appendChild(newIngredientRow);
                // Après avoir ajouté la nouvelle ligne, on remplit ses <select>
                populateIngredientSelects(supabaseIngredients);
                // Puis on ajoute les écouteurs pour les nouveaux champs
                newIngredientRow.querySelectorAll('.calc-input, .ingredient-select, .ingredient-poids')
                                .forEach(input => input.addEventListener('input', calculateAndDisplay));
            });
            
            dynamicContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-ingredient')) {
                    e.target.closest('.dynamic-row').remove();
                    calculateAndDisplay();
                }
            });
            
            const boutonImprimer = document.getElementById('imprimer-recette-outil1'); 
            if (boutonImprimer) {
                boutonImprimer.addEventListener('click', imprimerRecette);
            } else {
                console.error("Bouton d'impression avec ID 'imprimer-recette-outil1' introuvable.");
            }
            
            // Appel initial pour que tout s'affiche au chargement de la page
            calculateAndDisplay();

        } catch (error) {
            console.error("Erreur lors de l'initialisation de l'outil 1 :", error);
        }
    };
    
    // On appelle la fonction d'initialisation
    initialize();

});