// Fichier : outil1.js (version corrigée et unifiée)

document.addEventListener('DOMContentLoaded', () => {
    // Le code ne s'exécute que si l'outil 1 est présent sur la page
    const tool1 = document.getElementById('outil1');
    if (!tool1) return;

    // --- VARIABLES ET CONSTANTES DE L'OUTIL ---
    window.chartLiquides = null;
    window.chartRatio = null;

    const INGREDIENTS_HYDRATATION = {
        'eau': 100,
        'lait_entier': 88,
        'lait_demi_ecreme': 90,
        'creme_35': 60,
        'creme_fraiche_30': 65,
        'oeuf_entier': 75,
        'jaune_oeuf': 50,
        'blanc_oeuf': 88,
        'beurre_82': 18,
        'mimetic_essentiel': 22,
        'mimetic_primeur': 20,
        'huile': 0,
        'levain_liquide_100': 50,
        'poolish_100': 50,
    };

    // --- RÉFÉRENCES AUX ÉLÉMENTS DU DOM ---
    const form = document.getElementById('hydration-form');
    const addIngredientBtn = document.getElementById('add-ingredient-tool1');
    const dynamicContainer = document.getElementById('dynamic-ingredients-container');
    const ingredientTemplate = document.getElementById('dynamic-ingredient-template');

    // Éléments pour les résultats affichés sur la page
    const totalSechesEl = document.getElementById('total-seches-valeur');
    const totalEauEl = document.getElementById('total-eau-valeur');
    const tauxHydratationEl = document.getElementById('taux-hydratation-valeur');
    const detailContainer = document.getElementById('resultats-liquides-detail');
    
    // On déclare les variables ici pour qu'elles soient accessibles par toutes les fonctions
    let apportsLiquides = []; 
    let totalMatieresSeches = 0;
    let totalLiquides = 0;

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
        // Réinitialisation des variables globales de calcul
        totalMatieresSeches = 0;
        totalLiquides = 0;
        apportsLiquides = [];

        // 1. RÉCUPÉRATION DES VALEURS
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

        // 2. CALCULS
        totalMatieresSeches = poids.farine;

        const addLiquide = (nom, poidsTotalIngredient, cle_js, icone) => {
            if (poidsTotalIngredient > 0 && INGREDIENTS_HYDRATATION[cle_js] !== undefined) {
                const apportEnEau = poidsTotalIngredient * (INGREDIENTS_HYDRATATION[cle_js] / 100);
                apportsLiquides.push({ nom, poidsEau: apportEnEau, poidsTotal: poidsTotalIngredient, icone });
                totalLiquides += apportEnEau;
            }
        };

        // Ajout des liquides
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

        // 3. AFFICHAGE
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
    /*           NOUVELLE FONCTION D'IMPRESSION (ADAPTÉE)                   */
    /* ==================================================================== */
    function imprimerRecette() {
        // On lit les valeurs ACTUELLES des champs du formulaire
        const farine = document.getElementById('tool1-farine').value || '0';
        const sel = document.getElementById('tool1-sel').value || '0';
        const sucre = document.getElementById('tool1-sucre').value || '0';
        const levure = document.getElementById('tool1-levure').value || '0';

        // On récupère les résultats déjà calculés à l'écran
        const totalSecsAffiche = totalSechesEl.textContent;
        const totalLiquidesAffiche = totalEauEl.textContent;
        const thFinalAffiche = tauxHydratationEl.textContent;

        // On cible les conteneurs dans la fiche d'impression (votre HTML pour l'impression)
        const recapContainer = document.getElementById('print-recap-parametres');
        const detailsLiquidesContainer = document.getElementById('print-details-liquides');

        // On vide les anciens résultats pour éviter les doublons
        recapContainer.innerHTML = '';
        detailsLiquidesContainer.innerHTML = '';

        // On remplit la section "Paramètres de la Recette"
        recapContainer.innerHTML += `<p><span>Poids de farine :</span> <strong>${farine} g</strong></p>`;
        recapContainer.innerHTML += `<p><span>Sel :</span> <strong>${sel} g</strong></p>`;
        recapContainer.innerHTML += `<p><span>Sucre :</span> <strong>${sucre} g</strong></p>`;
        recapContainer.innerHTML += `<p><span>Levure :</span> <strong>${levure} g</strong></p>`;
        
        // On remplit la section "Détail des Apports en Eau"
        // On utilise la variable 'apportsLiquides' qui est maintenant à jour et accessible
        apportsLiquides.forEach(ing => {
            if (ing.poidsTotal > 0) {
                 detailsLiquidesContainer.innerHTML += `<p><span>${ing.nom} (${ing.poidsTotal} g) apporte :</span> <strong>${ing.poidsEau.toFixed(1)} g d'eau</strong></p>`;
            }
        });

        // On remplit les totaux de la fiche d'impression
        document.getElementById('print-total-seches').textContent = totalSecsAffiche;
        document.getElementById('print-total-eau').textContent = totalLiquidesAffiche;
        document.getElementById('print-taux-hydratation').textContent = thFinalAffiche;

        // On lance l'impression
        window.print();
    }


    /* ==================================================================== */
    /*          ÉCOUTEURS D'ÉVÉNEMENTS (UNIFIÉS)                           */
    /* ==================================================================== */
    form.addEventListener('input', calculateAndDisplay);

    addIngredientBtn.addEventListener('click', () => {
        const newIngredientRow = ingredientTemplate.content.cloneNode(true);
        dynamicContainer.appendChild(newIngredientRow);
        const newInputs = dynamicContainer.lastElementChild.querySelectorAll('input, select');
        newInputs.forEach(input => input.addEventListener('input', calculateAndDisplay));
    });
    
    dynamicContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-ingredient-btn')) {
            e.target.closest('.dynamic-row').remove();
            calculateAndDisplay();
        }
    });
    
    // Écouteur pour le bouton d'impression
    const boutonImprimer = document.getElementById('imprimer-recette-outil1'); 
    if (boutonImprimer) {
        boutonImprimer.addEventListener('click', imprimerRecette);
    } else {
        console.error("Bouton d'impression avec ID 'imprimer-recette-outil1' introuvable.");
    }
    
    // Appel initial pour que tout s'affiche au chargement de la page
    calculateAndDisplay();

}); // <-- FIN DU BLOC addEventListener, CETTE LIGNE EST ESSENTIELLE ET MANQUAIT !
