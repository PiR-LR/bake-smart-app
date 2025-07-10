document.addEventListener('DOMContentLoaded', () => {
    const toolMenu = document.getElementById('tool-menu');
    const backButton = document.getElementById('back-button');

    // Gestion des clics sur les icônes du menu
    toolMenu.querySelectorAll('.tool-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const toolId = icon.dataset.tool; // Récupère l'ID de l'outil
            const toolContent = document.getElementById(toolId);

            // Vérifie si l'élément correspondant existe
            if (toolContent) {
                console.log(`Activation de l'outil : ${toolId}`); // Log pour le débogage

                // Masquer toutes les sections d'outils
                document.querySelectorAll('.tool-content').forEach(section => {
                    section.classList.add('hidden'); // Masque les autres outils
                    section.classList.remove('show');
                    section.classList.remove('visible'); // Retirer la classe pour le fondu si elle était active
                });

                // Afficher la section correspondant à l'icône cliquée
                toolContent.classList.remove('hidden'); // Rend visible
                toolContent.classList.add('show');

                // Ajouter la classe 'visible' pour déclencher l'animation de fondu
                setTimeout(() => {
                    toolContent.classList.add('visible');
                }, 0);

                // Afficher le bouton "Retour"
                backButton.classList.remove('hidden');
            } else {
                console.error(`Outil avec ID "${toolId}" introuvable !`);
            }
        });
    });

    // Gestion du bouton "Retour"
    backButton.addEventListener('click', () => {
        // Masquer toutes les sections d'outils
        document.querySelectorAll('.tool-content').forEach(section => {
            section.classList.add('hidden'); // Masque tous les outils
            section.classList.remove('show');
            section.classList.remove('visible'); // Retirer la classe pour le fondu
        });

        // Réinitialiser le menu
        backButton.classList.add('hidden'); // Cache le bouton "Retour"
    });
});

// ========== AJOUTS PWA ==========

// Enregistrement du Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré avec succès:', registration.scope);
            })
            .catch((error) => {
                console.log('❌ Échec de l\'enregistrement du Service Worker:', error);
            });
    });
}

// Gestion de l'installation PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWA: Événement beforeinstallprompt déclenché');
    e.preventDefault();
    deferredPrompt = e;
    
    // Afficher le bouton d'installation personnalisé
    showInstallButton();
});

// Fonction pour afficher le bouton d'installation
function showInstallButton() {
    // Vérifier si le bouton n'existe pas déjà
    if (document.querySelector('.install-button')) return;
    
    // Créer le bouton d'installation
    const installButton = document.createElement('button');
    installButton.innerHTML = '📱 Installer l\'app';
    installButton.className = 'install-button';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #8B4513;
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 25px;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    // Effet hover
    installButton.addEventListener('mouseenter', () => {
        installButton.style.transform = 'scale(1.05)';
        installButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    });
    
    installButton.addEventListener('mouseleave', () => {
        installButton.style.transform = 'scale(1)';
        installButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });
    
    // Ajouter l'événement de clic
    installButton.addEventListener('click', installApp);
    
    // Ajouter le bouton au body
    document.body.appendChild(installButton);
}

// Fonction pour installer l'app
function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ PWA: Installation acceptée');
                // Masquer le bouton d'installation
                const installButton = document.querySelector('.install-button');
                if (installButton) {
                    installButton.remove();
                }
            } else {
                console.log('❌ PWA: Installation refusée');
            }
            deferredPrompt = null;
        });
    }
}

// Détecter si l'app est déjà installée
window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA: App installée avec succès');
    // Masquer le bouton d'installation
    const installButton = document.querySelector('.install-button');
    if (installButton) {
        installButton.remove();
    }
});

// Gérer les mises à jour du Service Worker
navigator.serviceWorker?.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker: Nouvelle version disponible');
    // Optionnel : Afficher une notification de mise à jour
    showUpdateNotification();
});

// Fonction pour afficher une notification de mise à jour
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
            ✨ Nouvelle version disponible ! Rechargez la page.
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Gestion de la connexion réseau
window.addEventListener('online', () => {
    console.log('🟢 Connexion réseau rétablie');
    showNetworkStatus('Connexion rétablie', '#4CAF50');
});

window.addEventListener('offline', () => {
    console.log('🔴 Connexion réseau perdue - Mode hors ligne');
    showNetworkStatus('Mode hors ligne', '#FF9800');
});

// Fonction pour afficher le statut réseau
function showNetworkStatus(message, color) {
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1002;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    statusDiv.textContent = message;
    
    document.body.appendChild(statusDiv);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        statusDiv.remove();
    }, 3000);
}
