// === OUTIL 2 - CALCULATEUR DE RECETTES ===

document.addEventListener('DOMContentLoaded', function() {

    // Références aux éléments HTML de l'outil 2
    const errorMessageContainer = document.getElementById('outil2-error-message');
    const recipeResultsContainer = document.getElementById('recipe-results');
    const recipePlaceholder = document.getElementById('recipe-placeholder');
    const desiredWeightInput = document.getElementById('desired-weight');
    const calculateButton = document.getElementById('calculate-desired-recipe');
    const addIngredientButton = document.getElementById('add-ingredient-tool2');
    const ingredientsContainer = document.getElementById('ingredients-container');

    // Fonction pour afficher un message d'erreur
    function showErrorMessage(message) {
        if (errorMessageContainer) {
            errorMessageContainer.textContent = message;
            errorMessageContainer.classList.remove('hidden'); 
            errorMessageContainer.classList.add('error-active'); 
            // Masquer les résultats et afficher le placeholder en cas d'erreur
            if (recipeResultsContainer) recipeResultsContainer.classList.add('hidden');
            if (recipePlaceholder) recipePlaceholder.classList.remove('hidden');
        } else {
            console.error('Conteneur de message d\'erreur non trouvé.');
            alert(message); // Fallback
        }
    }

    // Fonction pour cacher le message d'erreur
    function hideErrorMessage() {
        if (errorMessageContainer) {
            errorMessageContainer.textContent = '';
            errorMessageContainer.classList.add('hidden'); 
            errorMessageContainer.classList.remove('error-active');
        }
    }

    // Fonction pour calculer les quantités recalculées
    function calculerRecette() {
        hideErrorMessage(); // Cache tout message d'erreur précédent

        const rendementSouhaite = parseFloat(desiredWeightInput.value);

        if (!rendementSouhaite || rendementSouhaite <= 0) {
            showErrorMessage('Veuillez entrer un rendement souhaité valide et positif.');
            desiredWeightInput.focus(); 
            // Cacher les résultats et afficher le placeholder si le rendement est invalide
            if (recipeResultsContainer) recipeResultsContainer.classList.add('hidden');
            if (recipePlaceholder) recipePlaceholder.classList.remove('hidden');
            return;
        }

        const ingredients = [];
        const ingredientRows = document.querySelectorAll('#outil2 .ingredient-row');
        let hasInvalidInput = false; // Pour suivre si des champs sont invalides

        ingredientRows.forEach(row => {
            // AJOUT : Ajout de la classe form-input si elle n'est pas déjà là
            const nameInput = row.querySelector('.ingredient-name');
            const quantityInput = row.querySelector('.ingredient-quantity');

            // Ajout de la classe form-input si elle est manquante pour la cohérence
            if (!nameInput.classList.contains('form-input')) {
                nameInput.classList.add('form-input');
            }
            if (!quantityInput.classList.contains('form-input')) {
                quantityInput.classList.add('form-input');
            }


            const name = nameInput.value.trim();
            const quantity = parseFloat(quantityInput.value);

            // Réinitialiser les classes d'erreur
            nameInput.classList.remove('input-error');
            quantityInput.classList.remove('input-error');

            if (name && !isNaN(quantity) && quantity > 0) {
                ingredients.push({ name, quantity });
            } else {
                // Marquer les champs invalides
                if (!name) nameInput.classList.add('input-error');
                if (isNaN(quantity) || quantity <= 0) quantityInput.classList.add('input-error');
                hasInvalidInput = true; // Définir le drapeau
            }
        });

        if (hasInvalidInput) {
            showErrorMessage('Veuillez corriger les champs invalides (nom vide ou quantité nulle/négative).');
            // Cacher les résultats et afficher le placeholder
            if (recipeResultsContainer) recipeResultsContainer.classList.add('hidden');
            if (recipePlaceholder) recipePlaceholder.classList.remove('hidden');
            return;
        }

        if (ingredients.length === 0) {
            showErrorMessage('Veuillez ajouter au moins un ingrédient avec un nom et une quantité valide.');
            // Cacher les résultats et afficher le placeholder
            if (recipeResultsContainer) recipeResultsContainer.classList.add('hidden');
            if (recipePlaceholder) recipeResultsContainer.classList.remove('hidden');
            return;
        }

        const totalOriginal = ingredients.reduce((sum, ingredient) => sum + ingredient.quantity, 0);

        if (totalOriginal <= 0) {
            showErrorMessage('Le total des quantités originales doit être supérieur à zéro.');
            // Cacher les résultats et afficher le placeholder
            if (recipeResultsContainer) recipeResultsContainer.classList.add('hidden');
            if (recipePlaceholder) recipePlaceholder.classList.remove('hidden');
            return;
        }

        const facteur = rendementSouhaite / totalOriginal;

        const nouvellesQuantites = ingredients.map(ingredient => {
            let nouvelleQuantite = ingredient.quantity * facteur;

            // Règles d'arrondi métier
            let quantiteArrondie;
            // Si c'est du sel et < 20g ou levure et < 10g, 2 décimales
            if ((ingredient.name.toLowerCase().includes('sel') && nouvelleQuantite < 20) ||
                (ingredient.name.toLowerCase().includes('levure') && nouvelleQuantite < 10)) {
                quantiteArrondie = Math.round(nouvelleQuantite * 100) / 100; 
            } else {
                quantiteArrondie = Math.ceil(nouvelleQuantite); // Arrondi supérieur
            }

            return {
                name: ingredient.name,
                originalQuantity: ingredient.quantity,
                newQuantity: quantiteArrondie
            };
        });

        afficherResultats(nouvellesQuantites, totalOriginal, rendementSouhaite);
    }

    // Fonction pour afficher les résultats
    function afficherResultats(quantites, totalOriginal, rendementSouhaite) {
        const originalList = document.getElementById('original-ingredients-list');
        const recalculatedList = document.getElementById('recalculated-quantities-list');

        // Vider les listes
        originalList.innerHTML = '';
        recalculatedList.innerHTML = '';

        // Remplir les listes
        quantites.forEach(ingredient => {
            const originalItem = document.createElement('li');
            originalItem.innerHTML = `<strong>${ingredient.name}</strong> : ${ingredient.originalQuantity}g`;
            originalList.appendChild(originalItem);

            const recalculatedItem = document.createElement('li');
            recalculatedItem.innerHTML = `<strong>${ingredient.name}</strong> : ${ingredient.newQuantity}g`;
            recalculatedList.appendChild(recalculatedItem);
        });

        // Ajouter les totaux
        const originalTotal = document.createElement('li');
        originalTotal.innerHTML = `<strong>Total : ${totalOriginal}g</strong>`;
        originalTotal.style.borderTop = '2px solid var(--couleur-action-principale)'; // Utilisation de variable CSS
        originalTotal.style.paddingTop = '10px';
        originalTotal.style.marginTop = '10px';
        originalList.appendChild(originalTotal);

        const recalculatedTotal = document.createElement('li');
        const totalRecalcule = quantites.reduce((sum, ingredient) => sum + ingredient.newQuantity, 0);
        recalculatedTotal.innerHTML = `<strong>Total : ${Math.round(totalRecalcule)}g</strong>`;
        recalculatedTotal.style.borderTop = '2px solid var(--couleur-action-principale)'; // Utilisation de variable CSS
        recalculatedTotal.style.paddingTop = '10px';
        recalculatedTotal.style.marginTop = '10px';
        recalculatedList.appendChild(recalculatedTotal);

        // Masquer le placeholder et afficher le conteneur de résultats
        if (recipePlaceholder) recipePlaceholder.classList.add('hidden');
        if (recipeResultsContainer) recipeResultsContainer.classList.remove('hidden');

        // Optionnel: Faire défiler vers les résultats si nécessaire
        // recipeResultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Fonction pour ajouter un ingrédient
    function ajouterIngredient() {
        const newRow = document.createElement('div');
        newRow.className = 'ingredient-row'; // Conserver cette classe

        newRow.innerHTML = `
            <div class="ingredient-controls">
                <button class="move-up" title="Monter">↑</button>
                <button class="move-down" title="Descendre">↓</button>
            </div>
            <input type="text" class="ingredient-name form-input" placeholder="Nom">
            <input type="number" class="ingredient-quantity form-input" placeholder="Quantité (g)">
            <button class="remove-ingredient" title="Supprimer"><i class="material-icons">close</i></button>
        `;

        ingredientsContainer.appendChild(newRow);

        // Ajouter les event listeners pour les nouveaux boutons
        attachEventListeners(newRow);
        updateMoveButtons();
        calculerRecette(); // Déclenche un nouveau calcul après ajout
    }

    // Fonction pour supprimer un ingrédient
    function supprimerIngredient(row) {
        row.remove();
        updateMoveButtons();
        calculerRecette(); // Déclenche un nouveau calcul après suppression
    }

    // Fonctions pour déplacer un ingrédient
    function deplacerVersHaut(row) {
        const previousRow = row.previousElementSibling;
        if (previousRow) {
            row.parentNode.insertBefore(row, previousRow);
            updateMoveButtons();
            calculerRecette();
        }
    }

    function deplacerVersBas(row) {
        const nextRow = row.nextElementSibling;
        if (nextRow) {
            row.parentNode.insertBefore(nextRow, row);
            updateMoveButtons();
            calculerRecette();
        }
    }

    // Fonction pour mettre à jour l'état des boutons de déplacement
    function updateMoveButtons() {
        const rows = document.querySelectorAll('#outil2 .ingredient-row');

        rows.forEach((row, index) => {
            const moveUpBtn = row.querySelector('.move-up');
            const moveDownBtn = row.querySelector('.move-down');

            moveUpBtn.disabled = index === 0;
            moveDownBtn.disabled = index === rows.length - 1;
        });
    }

    // Fonction pour attacher les event listeners à une ligne (nouvelle ou existante)
    function attachEventListeners(row) {
        // AJOUT : Utiliser .closest() pour gérer le clic sur l'icône à l'intérieur du bouton de suppression
        const removeBtn = row.querySelector('.remove-ingredient');
        if (removeBtn) { // S'assurer que le bouton existe
            removeBtn.addEventListener('click', (e) => {
                // S'assurer que le parent (le bouton) est ciblé même si on clique sur l'icône
                const button = e.target.closest('.remove-ingredient');
                if (button) {
                    supprimerIngredient(row); // Passer la ligne parente à la fonction
                }
            });
        }
        
        const moveUpBtn = row.querySelector('.move-up');
        const moveDownBtn = row.querySelector('.move-down');
        const nameInput = row.querySelector('.ingredient-name');
        const quantityInput = row.querySelector('.ingredient-quantity');

        moveUpBtn.addEventListener('click', () => deplacerVersHaut(row));
        moveDownBtn.addEventListener('click', () => deplacerVersBas(row));

        // Écouteurs pour la mise à jour automatique lors de la saisie
        nameInput.addEventListener('input', calculerRecette);
        quantityInput.addEventListener('input', calculerRecette);
    }

    // Initialisation des event listeners au chargement de la page
    function initEventListeners() {
        // Bouton de calcul
        if (calculateButton) {
            calculateButton.addEventListener('click', calculerRecette);
        }

        // Bouton d'ajout d'ingrédient
        if (addIngredientButton) {
            addIngredientButton.addEventListener('click', ajouterIngredient);
        }

        // Écouteur pour la saisie dans le champ de rendement souhaité
        if (desiredWeightInput) {
            desiredWeightInput.addEventListener('input', calculerRecette);
            desiredWeightInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculerRecette();
                }
            });
        }
        
        // Attacher les event listeners aux lignes d'ingrédients existantes au chargement
        document.querySelectorAll('#outil2 .ingredient-row').forEach(row => {
            attachEventListeners(row);
        });

        // Afficher le placeholder et cacher les résultats au démarrage
        if (recipeResultsContainer) recipeResultsContainer.classList.add('hidden');
        if (recipePlaceholder) recipePlaceholder.classList.remove('hidden');

        // Effectuer un premier calcul si des valeurs par défaut sont déjà présentes
        calculerRecette(); 
    }

    // Appel de la fonction d'initialisation
    initEventListeners();
    updateMoveButtons(); // Met à jour l'état des boutons de déplacement au chargement
});