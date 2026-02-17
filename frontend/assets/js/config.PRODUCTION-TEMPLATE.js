/**
 * 🔧 INSTRUCTIONS CONFIGURATION PRODUCTION
 * 
 * Après le déploiement Blueprint sur Render :
 * 
 * 1. Récupérez vos URLs Render :
 *    - Backend : https://collecte-backend-XXXX.onrender.com
 *    - Frontend : https://collecte-frontend-XXXX.onrender.com
 * 
 * 2. Mettez à jour les valeurs ci-dessous
 * 
 * 3. Renommez ce fichier en : config.js (remplace l'ancien)
 * 
 * 4. Commitez et pushez :
 *    git add frontend/assets/js/config.js
 *    git commit -m "Update config for production"
 *    git push
 * 
 * 5. Render redéploiera automatiquement le frontend
 */

const CONFIG = {
    // ✏️ MODIFIEZ ICI : Remplacez par votre URL backend Render
    API_URL: 'https://collecte-backend.onrender.com/api',
    
    // ✅ CLÉ ADMIN (déjà configurée - identique à celle du backend)
    ADMIN_KEY: 'f9228dc7440232c1df16f82809e394e18da2b2f8a50521e4f283ebb7fba8b01e',
    
    // ✅ WAVE URL (déjà configurée)
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
    
    // Labels des moyens de paiement
    MOYEN_PAIEMENT_LABELS: {
        wave: 'Wave',
        orange_money: 'Orange Money',
        mtn_money: 'MTN Money',
        moov_money: 'Moov Money',
        especes: 'Espèces',
        virement: 'Virement bancaire',
        autre: 'Autre'
    },
    
    // Format de la monnaie
    CURRENCY: {
        symbol: 'F CFA',
        position: 'after', // 'before' ou 'after'
        thousandsSeparator: ' ',
        decimalSeparator: ',',
        decimals: 0
    },
    
    // Configuration du datatable
    DATATABLE: {
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json'
        },
        pageLength: 10,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, 'Tous']]
    },
    
    // Messages de validation
    MESSAGES: {
        success: {
            create: 'Inscription créée avec succès',
            update: 'Inscription mise à jour',
            delete: 'Inscription supprimée',
            confirm: 'Inscription confirmée',
            reject: 'Inscription rejetée'
        },
        error: {
            network: 'Erreur de connexion au serveur',
            validation: 'Erreur de validation des données',
            auth: 'Clé administrateur invalide',
            notFound: 'Ressource non trouvée',
            server: 'Erreur serveur'
        }
    },
    
    // Configuration des graphiques
    CHARTS: {
        colors: {
            primary: '#2c7b4e',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8'
        }
    },
    
    // Limites et validations
    VALIDATION: {
        nom: { min: 2, max: 50 },
        prenoms: { min: 2, max: 50 },
        age: { min: 1, max: 120 },
        telephone: { pattern: '^[0-9]{10}$' },
        numero_paiement: { pattern: '^[0-9]{10}$' },
        montant: { min: 0, max: 10000000 }
    },
    
    // Tailles de tee-shirt disponibles
    TAILLES_TEE_SHIRT: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
};

// Ne pas modifier - Export pour compatibilité
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
