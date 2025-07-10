document.addEventListener('DOMContentLoaded', () => {
    const addIngredientBtn = document.getElementById("add-ingredient");
    const calculateCostBtn = document.getElementById("calculate-cost");
    const ingredientsContainer = document.getElementById("ingredients-input");

    addIngredientBtn.addEventListener("click", addIngredientRow);
    calculateCostBtn.addEventListener("click", calculateRecipeCost);

    function addIngredientRow() {
        const ingredientRow = document.createElement("div");
        ingredientRow.classList.add("ingredient-row");
        ingredientRow.innerHTML = `
            <input type="text" class="ingredient-name" placeholder="Nom de l'ingrédient">
            <input type="number" class="ingredient-quantity" placeholder="Quantité (g)" value="0">
            <input type="number" class="ingredient-price" placeholder="Prix au kg (€)" value="0">
            <button type="button" class="remove-ingredient">✖</button>
        `;
        
        const removeBtn = ingredientRow.querySelector('.remove-ingredient');
        removeBtn.addEventListener('click', () => ingredientRow.remove());

        // Insérer juste avant le bouton "Ajouter un ingrédient"
        addIngredientBtn.parentNode.insertBefore(ingredientRow, addIngredientBtn);
    }

    function calculateRecipeCost() {
        const ingredientRows = ingredientsContainer.querySelectorAll(".ingredient-row");
        const pieceWeightInput = document.getElementById("piece-weight");
        
        // Vérification que les éléments existent
        if (!ingredientRows.length || !pieceWeightInput) {
            alert("Veuillez ajouter des ingrédients et un poids par pièce.");
            return;
        }

        let totalCost = 0;
        let totalWeight = 0;

        // Validation avant calcul
        const isValidInput = validateAllInputs(ingredientRows, pieceWeightInput);
        
        if (!isValidInput) {
            alert("Veuillez vérifier vos saisies.");
            return;
        }

        ingredientRows.forEach(row => {
            const quantityInput = row.querySelector(".ingredient-quantity");
            const priceInput = row.querySelector(".ingredient-price");

            if (quantityInput && priceInput) {
                const quantity = parseFloat(quantityInput.value || '0');
                const price = parseFloat(priceInput.value || '0');
                
                if (!isNaN(quantity) && !isNaN(price)) {
                    totalCost += (quantity / 1000) * price;
                    totalWeight += quantity;
                }
            }
        });

        const pieceWeight = parseFloat(pieceWeightInput.value || '0');
        const pieceCost = totalWeight > 0 ? totalCost / (totalWeight / pieceWeight) : 0;

        updateResults(totalWeight, totalCost, pieceCost);
    }

    function validateAllInputs(ingredientRows, pieceWeightInput) {
        // Validation des ingrédients
        const ingredientsValid = Array.from(ingredientRows).every(row => {
            const nameInput = row.querySelector(".ingredient-name");
            const quantityInput = row.querySelector(".ingredient-quantity");
            const priceInput = row.querySelector(".ingredient-price");

            const name = (nameInput.value || '').trim();
            const quantity = parseFloat(quantityInput.value || '0');
            const price = parseFloat(priceInput.value || '0');

            return name !== '' && 
                   !isNaN(quantity) && 
                   quantity >= 0 &&
                   !isNaN(price) && 
                   price >= 0;
        });

        // Validation du poids par pièce
        const pieceWeight = parseFloat(pieceWeightInput.value || '0');
        const pieceWeightValid = !isNaN(pieceWeight) && pieceWeight > 0;

        return ingredientsValid && pieceWeightValid;
    }

    function updateResults(totalWeight, totalCost, pieceCost) {
        document.getElementById("total-weight").textContent = totalWeight.toFixed(2);
        document.getElementById("total-cost").textContent = totalCost.toFixed(2);
        document.getElementById("piece-cost").textContent = pieceCost.toFixed(2);
    }
});