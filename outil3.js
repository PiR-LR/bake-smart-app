// Données de recettes (exemple)
const recettes = [
    {
        nom: "Baguette de Tradition Française",
        description: "Recette classique sur autolyse",
        autolyse: 5,
        repos_autolyse: 30,
        petrissage: 15,
        pointage: 60,
        pointage_froid: false,
        division: 15,
        detente: 30,
        faconnage: 15,
        appret: 60,
        cuisson: 30,
    },
    // Ajoutez d'autres recettes ici si nécessaire
];

// Remplir la liste de sélection des recettes
const recettesSelect = document.getElementById("recettes");
recettes.forEach((recette, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = recette.nom;
    recettesSelect.appendChild(option);
});

// Générer le tableau de planification
document.getElementById("generer-planning").addEventListener("click", () => {
    const selectedRecettes = Array.from(recettesSelect.selectedOptions).map(option => recettes[option.value]);
    const tempsDisponible = parseInt(document.getElementById("temps-disponible").value);
    const heureDebut = document.getElementById("heure-debut").value;

    const tableauDiv = document.getElementById("planning-tableau");
    let tableauHTML = "<table><thead><tr><th>Recette</th>";

    // Calculer le nombre de colonnes et les heures à afficher
    const nombreColonnes = Math.ceil(tempsDisponible / 15);
    const heuresAffichees = [];
    for (let i = 0; i < nombreColonnes; i++) {
        const heure = new Date(Date.parse(`1970-01-01T${heureDebut}`) + i * 15 * 60000);
        if (heure.getMinutes() === 0) {
            heuresAffichees.push(heure.toLocaleTimeString("fr-FR", { hour: "2-digit" }));
        } else {
            heuresAffichees.push("");
        }
    }

    // Ajouter les heures à l'en-tête du tableau
    heuresAffichees.forEach(heure => {
        tableauHTML += `<th>${heure}</th>`;
    });

    tableauHTML += "</tr></thead><tbody>";

    selectedRecettes.forEach((recette) => {
        tableauHTML += `<tr><td>${recette.nom}</td>`;

        let currentTime = 0;
        let etapes = [
            { nom: "Autolyse", duree: recette.autolyse },
            { nom: "Repos Autolyse", duree: recette.repos_autolyse },
            { nom: "Pétrissage", duree: recette.petrissage },
            { nom: "Pointage", duree: recette.pointage },
            { nom: "Division", duree: recette.division },
            { nom: "Détente", duree: recette.detente },
            { nom: "Façonnage", duree: recette.faconnage },
            { nom: "Apprêt", duree: recette.appret },
            { nom: "Cuisson", duree: recette.cuisson },
        ];

        etapes.forEach((etape) => {
            const etapeDuration = etape.duree;
            const etapeCells = Math.ceil(etapeDuration / 15);

            for (let i = 0; i < etapeCells && currentTime < nombreColonnes; i++) {
                let cellClass = "";
                if (etape.nom === "Autolyse" || etape.nom === "Pétrissage") {
                    cellClass = "bleu";
                } else if (etape.nom === "Division" || etape.nom === "Façonnage") {
                    cellClass = "jaune";
                } else if (etape.nom === "Cuisson") {
                    cellClass = "rouge";
                }
                tableauHTML += `<td class="${cellClass}"></td>`;
                currentTime++;
            }
        });

        // Remplir les cellules restantes avec des cellules vides
        for (let i = currentTime; i < nombreColonnes; i++) {
            tableauHTML += "<td></td>";
        }

        tableauHTML += "</tr>";
    });

    tableauHTML += "</tbody></table>";
    tableauDiv.innerHTML = tableauHTML;
});