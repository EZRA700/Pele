/**
 * 🔧 CONFIGURATION GLOBALE - Frontend Collecte Communautaire
 * 
 * IMPORTANT: Modifiez ces valeurs selon votre environnement
 */

const CONFIG = {
    // URL de l'API Backend
    // Développement local: http://localhost:3003/api
    // Production Render: https://votre-backend.onrender.com/api
    API_URL: 'https://collecte-backend.onrender.com/api',
    
    // Clé secrète admin (doit correspondre à ADMIN_SECRET_KEY du backend)
    // ⚠️ NE JAMAIS COMMITTER la vraie clé sur GitHub
    // En production, utilisez une variable d'environnement ou un fichier séparé
    ADMIN_KEY: 'f9228dc7440232c1df16f82809e394e18da2b2f8a50521e4f283ebb7fba8b01e',
    
    // Lien de paiement Wave (compte marchand)
    WAVE_PAYMENT_URL: 'https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/',
    
    // Labels des statuts
    STATUT_LABELS: {
        en_attente: 'En attente',
        confirme: 'Confirmé',
        rejete: 'Rejeté',
        annule: 'Annulé'
    },
    
    // Couleurs des badges de statut (Bootstrap)
    STATUT_COLORS: {
        en_attente: 'warning',
        confirme: 'success',
        rejete: 'danger',
        annule: 'secondary'
    },
    
    // Configuration pagination
    PAGINATION: {
        itemsPerPage: 50,
        maxPagesShown: 5
    },
    
    // Montants suggérés (en FCFA)
    MONTANTS_SUGGERES: [1000, 2000, 5000, 10000, 20000, 50000],
    
    // Montant minimum autorisé
    MONTANT_MIN: 100,
    
    // Configuration des messages
    MESSAGES: {
        success: {
            soumission: 'Votre soumission a été enregistrée avec succès !',
            referenceOperateur: 'Code de transaction enregistré avec succès !',
            validation: 'Soumission validée avec succès !',
            rejet: 'Soumission rejetée.',
            annulation: 'Soumission annulée.'
        },
        error: {
            network: 'Erreur de connexion. Vérifiez votre connexion internet.',
            serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
            invalidData: 'Données invalides. Veuillez vérifier le formulaire.',
            notFound: 'Ressource non trouvée.',
            unauthorized: 'Accès non autorisé. Clé admin invalide.'
        }
    },
    
    // Durée d'affichage des toasts (en millisecondes)
    TOAST_DURATION: 5000,
    
    // Rafraîchissement automatique du dashboard (en millisecondes)
    // 0 = désactivé
    AUTO_REFRESH_INTERVAL: 30000, // 30 secondes
    
    // Mode debug (affiche les logs dans la console)
    DEBUG: true
};

// Fonction helper pour logger en mode debug
function debugLog(...args) {
    if (CONFIG.DEBUG) {
        console.log('[DEBUG]', ...args);
    }
}

// Fonction pour formater les montants en FCFA
function formatMontant(montant) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(montant);
}

// Fonction pour formater les dates
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Fonction pour formater les dates courtes (sans heure)
function formatDateShort(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Fonction pour obtenir le badge HTML d'un statut
function getStatutBadge(statut) {
    const color = CONFIG.STATUT_COLORS[statut] || 'secondary';
    const label = CONFIG.STATUT_LABELS[statut] || statut;
    return `<span class="badge bg-${color}">${label}</span>`;
}

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
