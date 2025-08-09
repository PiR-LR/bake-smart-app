document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const splashLogos = document.querySelectorAll('.splash-logo');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-item');
    const toolsContainer = document.getElementById('tools-container');

    // Cacher tous les outils au démarrage
    document.querySelectorAll('.tool-card').forEach(tool => {
        tool.classList.add('hidden');
    });

    // Événement pour les logos du splash screen
    splashLogos.forEach(logo => {
        logo.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            
            // Cacher le splash screen
            splashScreen.classList.add('hidden');
            
            // Afficher la barre de navigation
            navbar.classList.remove('hidden');

            // Afficher l'outil ciblé
            showTool(targetId);
        });
    });

    // Événement pour les liens de la barre de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('data-target');
            showTool(targetId);
        });
    });

    function showTool(toolId) {
        // Cacher tous les outils
        document.querySelectorAll('.tool-card').forEach(tool => {
            tool.classList.add('hidden');
        });

        // Afficher l'outil sélectionné
        const selectedTool = document.getElementById(toolId);
        if (selectedTool) {
            selectedTool.classList.remove('hidden');
        }

        // Mettre en évidence le lien de navigation actif
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === toolId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
});