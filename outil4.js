// Fichier : outil4.js

document.addEventListener('DOMContentLoaded', () => {
    const addIngredientBtn = document.getElementById('add-ingredient-tool4');
    const ingredientsListDiv = document.getElementById('ingredients-list');
    const calculateCostBtn = document.getElementById('calculate-cost');
    const pieceWeightInput = document.getElementById('piece-weight');
    
    // Les spans pour afficher les résultats
    const totalWeightSpan = document.getElementById('total-weight');
    const totalCostSpan = document.getElementById('total-cost');
    const pieceCostSpan = document.getElementById('piece-cost');

    // --- Ajout d'un ingrédient ---
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', () => {
            const ingredientId = Date.now(); // ID unique pour chaque ligne
            const newIngredientHTML = `
                <div class="ingredient-row" id="row-${ingredientId}">
                    <input type="text" class="form-input ingredient-name" placeholder="Nom ingrédient">
                    <input type="number" class="form-input ingredient-weight" placeholder="Poids (g)">
                    <input type="number" class="form-input ingredient-price" placeholder="Prix (€/kg)">
                    <button type="button" class="remove-ingredient" data-id="${ingredientId}" title="Supprimer">
                        <i class="material-icons">close</i> 
                    </button>
                </div>
            `;
            ingredientsListDiv.insertAdjacentHTML('beforeend', newIngredientHTML);
        });
    }

    // --- Suppression d'un ingrédient (avec délégation d'événement) ---
    if (ingredientsListDiv) {
        ingredientsListDiv.addEventListener('click', (e) => {
            // SEULE MODIFICATION ICI : On vérifie si le clic était sur un bouton avec la classe 'remove-ingredient'
            // ET on utilise .closest() pour gérer le clic sur l'icône à l'intérieur du bouton
            if (e.target && e.target.closest('.remove-ingredient')) {
                const button = e.target.closest('.remove-ingredient'); // Récupère le bouton parent
                const ingredientId = button.getAttribute('data-id');
                const rowToRemove = document.getElementById(`row-${ingredientId}`);
                if (rowToRemove) {
                    rowToRemove.remove();
                }
            }
        });
    }

    // --- Calcul du coût de revient ---
    if (calculateCostBtn) {
        calculateCostBtn.addEventListener('click', () => {
            // PAS DE MODIFICATION ICI : On garde .ingredient-row pour le querySelectorAll
            const ingredientRows = ingredientsListDiv.querySelectorAll('.ingredient-row'); 
            let totalRecipeWeight = 0;
            let totalRecipeCost = 0;

            ingredientRows.forEach(row => {
                const weight = parseFloat(row.querySelector('.ingredient-weight').value);
                const pricePerKg = parseFloat(row.querySelector('.ingredient-price').value);

                if (!isNaN(weight) && !isNaN(pricePerKg)) {
                    totalRecipeWeight += weight; // Poids en grammes
                    totalRecipeCost += (weight / 1000) * pricePerKg; // (Poids en kg) * Prix par kg
                }
            });

            const pieceWeight = parseFloat(pieceWeightInput.value);
            let costPerPiece = 0;
            if (!isNaN(pieceWeight) && pieceWeight > 0 && totalRecipeWeight > 0) {
                const numPieces = totalRecipeWeight / pieceWeight;
                costPerPiece = totalRecipeCost / numPieces;
            }

            // Affichage des résultats
            totalWeightSpan.textContent = totalRecipeWeight.toFixed(0);
            totalCostSpan.textContent = totalRecipeCost.toFixed(2);
            pieceCostSpan.textContent = costPerPiece.toFixed(3); // 3 décimales pour la précision du coût
        });
    }
});