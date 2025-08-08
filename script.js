// On attend que toute la page soit chargée.
document.addEventListener('DOMContentLoaded', () => {

    const toolIcons = document.querySelectorAll('.tool-icon');
    const toolContents = document.querySelectorAll('.tool-content');

    // Fonction pour cacher tous les contenus d'outils
    const hideAllTools = () => {
        toolContents.forEach(content => {
            content.classList.add('hidden');
        });
    };

    // Fonction pour enlever la surbrillance de toutes les icônes
    const deactivateAllIcons = () => {
        toolIcons.forEach(icon => {
            icon.classList.remove('active'); // On enlève la classe 'active'
        });
    };

    // On ajoute un écouteur de clic sur chaque icône du menu
    toolIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            // 1. On récupère l'ID de l'outil à afficher (ex: "outil1")
            const toolId = icon.dataset.tool;
                    console.log('Clic sur outil:', toolId); // ← AJOUTE CETTE LIGNE

            const toolToShow = document.getElementById(toolId);
            console.log('Élément à afficher:', toolToShow);

            if (toolToShow) {
                // 2. On cache tous les outils et on désactive toutes les icônes
                hideAllTools();
                deactivateAllIcons();

                // 3. On affiche l'outil sélectionné
                toolToShow.classList.remove('hidden');

                // 4. On met l'icône cliquée en surbrillance
                icon.classList.add('active');
            }
        });
    });

    // --- État Initial au chargement de la page ---
    // Par défaut, on cache tout et on n'active rien.
    // L'utilisateur choisit son premier outil.
    hideAllTools();
    
    // Si vous voulez que l'outil 1 s'affiche par défaut au démarrage, décommentez la ligne ci-dessous :
    //document.querySelector('.tool-icon[data-tool="outil1"]').click();
});
