document.addEventListener('DOMContentLoaded', () => {
    // Ajout d'un nouvel ingrédient dans le formulaire
    document.getElementById('add-ingredient-tool1').addEventListener('click', () => {
        const newIngredientContainer = document.getElementById('new-ingredients');
        const newIngredientRow = document.createElement('div');
        newIngredientRow.className = 'form-row';
        newIngredientRow.innerHTML = `
            <label>Ingrédient (g):</label>
            <input type="number" class="new-ingredient">
        `;
        newIngredientContainer.appendChild(newIngredientRow);
    });

    // Suppression du dernier ingrédient ajouté
    document.getElementById('remove-ingredient-tool1').addEventListener('click', () => {
        const newIngredientContainer = document.getElementById('new-ingredients');
        if (newIngredientContainer.lastChild) {
            newIngredientContainer.removeChild(newIngredientContainer.lastChild);
        }
    });

    // Fonction pour afficher un graphique en camembert
    function afficherCamembert(data) {
        const ctx = document.getElementById('chartResult').getContext('2d');

        // Supprime l'ancien graphique avant de créer un nouveau
        if (window.currentChart) {
            window.currentChart.destroy();
        }

        // Création du nouveau graphique
        window.currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Eau', 'Œuf (75% d\'eau)', 'Jaunes (50% d\'eau)', 'Blancs (85% d\'eau)', 'Lait (85% d\'eau)', 'Matière grasse', 'Autres'],
                datasets: [{
                    label: 'Taux d\'hydratation',
                    data: data,
                    backgroundColor: [
                        '#6200ea',  // Eau
                        '#03dac6',  // Œuf
                        '#ff9800',  // Jaunes
                        '#8bc34a',  // Blancs
                        '#018786',  // Lait
                        '#ffcc00',  // Matière grasse
                        '#ff5722'   // Autres
                    ],
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom', // Légende en bas
                    }
                }
            }
        });
    }

    // Calcul du taux d'hydratation
    window.calculer = function () {
        const farine = parseFloat(document.getElementById('farine').value);
        const eau = parseFloat(document.getElementById('eau').value || 0);
        const oeuf = parseFloat(document.getElementById('oeuf').value || 0) * 0.75; // 75% d'eau
        const jaunes = parseFloat(document.getElementById('jaunes').value || 0) * 0.50; // 50% d'eau
        const blancs = parseFloat(document.getElementById('blancs').value || 0) * 0.85; // 85% d'eau
        const lait = parseFloat(document.getElementById('lait').value || 0) * 0.85; // 85% d'eau
        const matiere = parseFloat(document.getElementById('matiere-quantite').value || 0) *
            parseFloat(document.getElementById('matiere').value);
        let totalLiquides = eau + oeuf + jaunes + blancs + lait + matiere;

        // Ajout des liquides supplémentaires
        document.querySelectorAll('.new-ingredient').forEach(input => {
            totalLiquides += parseFloat(input.value) || 0;
        });

        if (!isNaN(farine) && farine > 0) {
            const tauxHydratation = (totalLiquides / farine) * 100;
            document.getElementById('resultat').innerText = `Taux d'hydratation : ${tauxHydratation.toFixed(2)} %`;
            document.getElementById('resultat').className = ''; // Supprimer la classe d'erreur si elle existe
            const details = `
                <p>💧 Eau : ${eau.toFixed(2)} g</p>
                <p>🥚 Œufs entiers : ${oeuf.toFixed(2)} g (75% d'eau)</p>
                <p>🟡 Jaunes d'œufs : ${jaunes.toFixed(2)} g (50% d'eau)</p>
                <p>⚪ Blancs d'œufs : ${blancs.toFixed(2)} g (85% d'eau)</p>
                <p> 🥛 Lait : ${lait.toFixed(2)} g (85% d'eau)</p>
                <p> 🧈 ${document.getElementById('matiere').selectedOptions[0].text} : ${matiere.toFixed(2)} g</p>
            `;
            document.getElementById('details').innerHTML = details;
            document.getElementById('result-container').classList.add('show');

            // Données pour le graphique
            const autres = totalLiquides - (eau + oeuf + jaunes + blancs + lait + matiere);
            const chartData = [eau, oeuf, jaunes, blancs, lait, matiere, autres];
            afficherCamembert(chartData); // Affichage du camembert
        } else {
            document.getElementById('resultat').innerText = 'Veuillez entrer une valeur valide pour la farine.';
            document.getElementById('resultat').className = 'error-message'; // Ajouter la classe d'erreur
            document.getElementById('details').innerHTML = '';
            document.getElementById('result-container').classList.remove('show');
        }
    };
});