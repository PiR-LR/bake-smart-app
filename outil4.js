// Fichier : outil4.js

document.addEventListener('DOMContentLoaded', () => {
    const addIngredientBtn = document.getElementById('add-ingredient-tool4');
    const ingredientsListDiv = document.getElementById('ingredients-list');
    const pieceWeightInput = document.getElementById('piece-weight');
    const cookingLossPercentageInput = document.getElementById('cooking-loss-percentage');
    const sellingPriceTtcInput = document.getElementById('selling-price-ttc-input'); 
    const vatRateRadios = document.querySelectorAll('input[name="vat-rate"]');

    const pieceWeightRawSpan = document.getElementById('piece-weight-raw');
    const pieceWeightCookedSpan = document.getElementById('piece-weight-cooked');
    const costPerKgSpan = document.getElementById('cost-per-kg');
    const pieceCostRawSpan = document.getElementById('piece-cost-raw');
    const pieceCostCookedSpan = document.getElementById('piece-cost-cooked');
    const sellingPriceHtSpan = document.getElementById('selling-price-ht');
    const sellingPriceTtcSpan = document.getElementById('selling-price-ttc');
    const grossMarginPerPieceSpan = document.getElementById('gross-margin-per-piece');

    const costChartCanvas = document.getElementById('cost-chart');
    let costChartInstance = null;
    
    // NOUVEAU: Référence au corps du tableau
    const costTableBody = document.querySelector('#cost-table tbody');

    // Palette de couleurs fixes
    const fixedColors = [
        'rgb(106, 27, 154)', // Violet
        'rgb(255, 99, 132)', // Rose
        'rgb(54, 162, 235)', // Bleu
        'rgb(255, 206, 86)', // Jaune
        'rgb(75, 192, 192)', // Turquoise
        'rgb(153, 102, 255)', // Mauve
        'rgb(255, 159, 64)', // Orange
        'rgb(199, 199, 199)',// Gris
        'rgb(201, 203, 207)',// Bleu clair
        'rgb(255, 64, 64)'  // Rouge
    ];

    // Fonction de génération de couleurs aléatoires
    const generateColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgb(${r}, ${g}, ${b})`;
    };

    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', () => {
            const ingredientId = Date.now();
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
            calculateCosts(); 
        });
    }

    if (ingredientsListDiv) {
        ingredientsListDiv.addEventListener('click', (e) => {
            if (e.target && e.target.closest('.remove-ingredient')) {
                const button = e.target.closest('.remove-ingredient');
                const ingredientId = button.getAttribute('data-id');
                const rowToRemove = document.getElementById(`row-${ingredientId}`);
                if (rowToRemove) {
                    rowToRemove.remove();
                    calculateCosts(); 
                }
            }
        });
    }

    function calculateCosts() {
        const ingredientRows = ingredientsListDiv.querySelectorAll('.ingredient-row'); 
        let totalRecipeWeight = 0;
        let totalRecipeCost = 0;
        
        const chartLabels = [];
        const chartData = [];
        const chartColors = [];
        const tableData = []; // NOUVEAU: Pour stocker les données du tableau

        const pieceWeight = parseFloat(pieceWeightInput.value);
        const cookingLossPercentage = parseFloat(cookingLossPercentageInput.value) / 100;

        ingredientRows.forEach((row, index) => {
            const weight = parseFloat(row.querySelector('.ingredient-weight').value);
            const pricePerKg = parseFloat(row.querySelector('.ingredient-price').value);
            const name = row.querySelector('.ingredient-name').value || 'Ingrédient';

            if (!isNaN(weight) && !isNaN(pricePerKg)) {
                const cost = (weight / 1000) * pricePerKg;
                totalRecipeWeight += weight;
                totalRecipeCost += cost;

                let pieceCost = 0;
                if (totalRecipeWeight > 0 && pieceWeight > 0) {
                    const estimatedPiecesRaw = totalRecipeWeight / pieceWeight;
                    if (estimatedPiecesRaw > 0) {
                        pieceCost = cost / estimatedPiecesRaw;
                    }
                }

                if (pieceCost > 0) {
                    chartLabels.push(name);
                    chartData.push(pieceCost);
                    
                    const color = (index < fixedColors.length) ? fixedColors[index] : generateColor();
                    chartColors.push(color);
                    
                    // NOUVEAU: Ajout des données pour le tableau
                    tableData.push({
                        name: name,
                        cost: pieceCost,
                        color: color
                    });
                }
            }
        });

        // NOUVEAU: Trie les données pour le tableau par coût décroissant
        tableData.sort((a, b) => b.cost - a.cost);
        
        let vatRate = 0;
        for (const radio of vatRateRadios) {
            if (radio.checked) {
                vatRate = parseFloat(radio.value) / 100;
                break;
            }
        }

        const sellingPriceTtcUser = parseFloat(sellingPriceTtcInput.value);
        const pieceWeightCooked = (pieceWeight && !isNaN(cookingLossPercentage)) ? pieceWeight * (1 - cookingLossPercentage) : 0;
        const cookedWeight = totalRecipeWeight * (1 - cookingLossPercentage);
        const costPerKg = (totalRecipeWeight > 0) ? totalRecipeCost / (totalRecipeWeight / 1000) : 0;
        const pieceCostRaw = (totalRecipeWeight > 0 && pieceWeight > 0) ? totalRecipeCost / (totalRecipeWeight / pieceWeight) : 0;

        let costPerPieceCooked = 0;
        let estimatedPieces = 0;
        if (!isNaN(pieceWeight) && pieceWeight > 0 && cookedWeight > 0) {
            estimatedPieces = Math.floor(cookedWeight / pieceWeight);
            if (estimatedPieces > 0) {
                costPerPieceCooked = totalRecipeCost / estimatedPieces;
            }
        }
        
        const sellingPriceHT = (sellingPriceTtcUser && !isNaN(vatRate)) ? sellingPriceTtcUser / (1 + vatRate) : 0;
        const sellingPriceTTC = sellingPriceTtcUser || 0;
        const grossMarginPerPiece = sellingPriceHT - costPerPieceCooked;
        
        let grossMarginPercentage = 0;
        if (costPerPieceCooked > 0) {
             grossMarginPercentage = (grossMarginPerPiece / costPerPieceCooked) * 100;
        }

        if (costChartInstance) {
            costChartInstance.destroy();
        }

        if (costChartCanvas) {
            costChartInstance = new Chart(costChartCanvas, {
                type: 'doughnut',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        data: chartData,
                        backgroundColor: chartColors,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false // NOUVEAU: Désactive la légende pour éviter la redondance avec le tableau
                        },
                        title: {
                            display: true,
                            text: 'Coûts par ingrédient pour une pièce',
                            font: {
                                size: 16
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    return `${label}: ${value.toFixed(2)} €`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // NOUVEAU: Remplir le tableau
        costTableBody.innerHTML = ''; // Vide le tableau existant
        tableData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div style="width: 20px; height: 20px; background-color: ${item.color}; border-radius: 4px;"></div></td>
                <td>${item.name}</td>
                <td>${item.cost.toFixed(2)} €</td>
            `;
            costTableBody.appendChild(row);
        });

        pieceWeightRawSpan.textContent = pieceWeight.toFixed(0);
        pieceWeightCookedSpan.textContent = pieceWeightCooked.toFixed(0);
        costPerKgSpan.textContent = costPerKg.toFixed(2);
        pieceCostRawSpan.textContent = pieceCostRaw.toFixed(3);
        pieceCostCookedSpan.textContent = costPerPieceCooked.toFixed(3);
        sellingPriceHtSpan.textContent = sellingPriceHT.toFixed(2);
        sellingPriceTtcSpan.textContent = sellingPriceTTC.toFixed(2);
        
        if (!isNaN(grossMarginPercentage)) {
            grossMarginPerPieceSpan.textContent = `${grossMarginPerPiece.toFixed(2)} € - ${grossMarginPercentage.toFixed(0)} %`;
        } else {
            grossMarginPerPieceSpan.textContent = '0.00 € - 0 %';
        }
    }

    if (sellingPriceTtcInput) sellingPriceTtcInput.addEventListener('input', calculateCosts);
    
    if (ingredientsListDiv) {
        ingredientsListDiv.addEventListener('input', (e) => {
            if (e.target.classList.contains('ingredient-weight') || e.target.classList.contains('ingredient-price')) {
                calculateCosts();
            }
        });
    }

    if (pieceWeightInput) pieceWeightInput.addEventListener('input', calculateCosts);
    if (cookingLossPercentageInput) cookingLossPercentageInput.addEventListener('input', calculateCosts);
    
    vatRateRadios.forEach(radio => {
        radio.addEventListener('change', calculateCosts);
    });

    calculateCosts();
});