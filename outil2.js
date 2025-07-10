document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour calculer les quantités recalculées
    function calculerRecette() {
        // Récupérer le rendement souhaité
        const rendementSouhaite = parseFloat(document.getElementById('desired-weight').value);

        // Récupérer les ingrédients et leurs quantités
        const ingredients = [];
        let ingredientRow = document.querySelector('#outil2 .ingredient-row');

        while (ingredientRow) {
            const nom = ingredientRow.querySelector('.ingredient-name').value;
            const quantite = parseFloat(ingredientRow.querySelector('.ingredient-quantity').value);

            if (nom && !isNaN(quantite)) {
                ingredients.push({ nom, quantite });
            }

            ingredientRow = ingredientRow.nextElementSibling;
        }

        // Calculer le poids total des ingrédients
        const poidsTotalIngredients = ingredients.reduce((total, ingredient) => total + ingredient.quantite, 0);

        // Vérifier si le poids total est valide
        if (isNaN(poidsTotalIngredients) || poidsTotalIngredients === 0) {
            alert("Veuillez entrer des quantités valides pour les ingrédients.");
            return;
        }

        // Calculer les quantités recalculées
        const quantitesRecalculees = ingredients.map(ingredient => (ingredient.quantite / poidsTotalIngredients) * rendementSouhaite);

        // Afficher les résultats
        afficherResultatsRecette(ingredients, quantitesRecalculees);
    }

    // Fonction pour afficher les résultats de la recette
    function afficherResultatsRecette(ingredients, quantitesRecalculees) {
        // Récupérer les listes pour les ingrédients et les quantités recalculées
        const originalIngredientsList = document.getElementById('original-ingredients-list');
        const recalculatedQuantitiesList = document.getElementById('recalculated-quantities-list');

        // Vider les listes existantes
        originalIngredientsList.innerHTML = '';
        recalculatedQuantitiesList.innerHTML = '';

        // Remplir les listes avec les ingrédients et les quantités recalculées
        let totalRecalcule = 0; // Initialiser le total à 0

        ingredients.forEach((ingredient, index) => {
            const originalIngredientItem = document.createElement('li');
            originalIngredientItem.textContent = `${ingredient.nom}`;
            originalIngredientsList.appendChild(originalIngredientItem);

            const recalculatedQuantityItem = document.createElement('li');
            let quantity = quantitesRecalculees[index];

            // Arrondir au supérieur, sauf pour le sel et la levure si < 20g et < 10g
            if (ingredient.nom.toLowerCase() === 'sel' && quantity < 20 || ingredient.nom.toLowerCase() === 'levure' && quantity < 10) {
                recalculatedQuantityItem.textContent = `${quantity.toFixed(2)} g`;
            } else {
                recalculatedQuantityItem.textContent = `${Math.ceil(quantity).toLocaleString('fr-FR')} g`; // Formater avec séparateur de milliers
                quantity = Math.ceil(quantity); // Utiliser la quantité arrondie pour le total
            }
            recalculatedQuantitiesList.appendChild(recalculatedQuantityItem);

            totalRecalcule += quantity; // Ajouter la quantité au total
        });

        // Afficher le total en gras
        const sautDeLigne = document.createElement('li');
        sautDeLigne.innerHTML = '&nbsp;';
        sautDeLigne.style.marginTop = '10px'; // Ajouter une marge supérieure de 10 pixels
        recalculatedQuantitiesList.appendChild(sautDeLigne);

        const totalItem = document.createElement('li');
        totalItem.textContent = `Total : ${totalRecalcule.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} g`; // Formater le total
        totalItem.style.fontWeight = 'bold';
        recalculatedQuantitiesList.appendChild(totalItem);

        // Afficher le conteneur des résultats
        const resultContainer = document.querySelector('#outil2 .result-container');
        resultContainer.classList.add('visible');
    }

    // Ajouter un nouvel ingrédient
    document.getElementById('add-ingredient-tool2').addEventListener('click', function() {
        const ingredientsSection = document.querySelector('#outil2 .ingredients-section');
        const newIngredientRow = document.createElement('div');
        newIngredientRow.classList.add('ingredient-row');

        newIngredientRow.innerHTML = `
            <input type="text" class="ingredient-name" placeholder="Nom de l'ingrédient">
            <input type="number" class="ingredient-quantity" placeholder="Quantité (g)">
            <button type="button" class="remove-ingredient">×</button>
        `;

        ingredientsSection.appendChild(newIngredientRow);

        // Ajouter un gestionnaire d'événements pour le bouton de suppression
        newIngredientRow.querySelector('.remove-ingredient').addEventListener('click', function() {
            ingredientsSection.removeChild(newIngredientRow);
        });
    });

    // Ajouter un gestionnaire d'événements pour les boutons de suppression existants
    document.querySelectorAll('#outil2 .remove-ingredient').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.parentElement.removeChild(this.parentElement);
        });
    });

    // Ajouter un gestionnaire d'événements pour le bouton de calcul
    document.getElementById('calculate-desired-recipe').addEventListener('click', calculerRecette);
});