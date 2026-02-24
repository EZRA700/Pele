/**
 * 📱 APP.JS - Gestion du formulaire d'inscription et paiement Wave
 */

// État de l'application
let soumissionData = null;

// Montant fixe de l'inscription
const MONTANT_FIXE = 6000;

/**
 * Initialise l'application
 */
function initializeApp() {
    attachEventListeners();
}

/**
 * Formate un montant en FCFA
 */
function formatMontantCFA(montant) {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
}

/**
 * Attache les écouteurs d'événements
 */
function attachEventListeners() {
    const form = document.getElementById('soumission-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
}

/**
 * Gère la soumission du formulaire
 */
async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;

    // Validation Bootstrap
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showAlert('Veuillez remplir tous les champs obligatoires correctement', 'danger');
        return;
    }

    // Récupérer les données du formulaire
    const formData = {
        nom: document.getElementById('nom').value.trim(),
        prenoms: document.getElementById('prenoms').value.trim(),
        age: parseInt(document.getElementById('age').value),
        taille_tee_shirt: document.getElementById('taille_tee_shirt').value,
        telephone: document.getElementById('telephone').value.trim(),
        numero_paiement: document.getElementById('numero_paiement').value.trim(),
        montant: MONTANT_FIXE
    };

    // Désactiver le bouton de soumission
    const btnValider = document.getElementById('btn-valider');
    const btnOriginalText = btnValider.innerHTML;
    btnValider.disabled = true;
    btnValider.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours...';

    try {
        // Envoyer au backend
        const response = await fetch(`${CONFIG.API_URL}/soumissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Erreur lors de l\'envoi');
        }

        if (result.success) {
            // Sauvegarder les données de soumission
            soumissionData = result.data;

            // Masquer le formulaire
            document.getElementById('form-card').style.display = 'none';

            // Afficher la section de paiement
            showPaymentSection(result.data);

            // Faire défiler vers la section de paiement
            document.getElementById('payment-card').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });

        } else {
            throw new Error(result.message || 'Échec de la soumission');
        }

    } catch (error) {
        console.error('Erreur:', error);
        showAlert(error.message || 'Une erreur est survenue. Veuillez réessayer.', 'danger');

        // Réactiver le bouton
        btnValider.disabled = false;
        btnValider.innerHTML = btnOriginalText;
    }
}

/**
 * Affiche la section de paiement Wave
 */
function showPaymentSection(data) {
    // Afficher la référence
    document.getElementById('display-reference').textContent = data.reference;

    // Afficher le montant
    const montantFormatte = formatMontantCFA(data.montant);
    document.getElementById('display-montant').textContent = montantFormatte;

    // Afficher le numéro de paiement Wave
    const numeroPaiementEl = document.getElementById('display-numero-paiement');
    if (numeroPaiementEl) {
        numeroPaiementEl.textContent = data.numero_paiement;
    }

    // Mettre à jour le lien Wave avec le montant (si l'API Wave le permet)
    const waveLink = document.getElementById('wave-payment-link');
    const baseUrl = CONFIG.WAVE_PAYMENT_URL || 'https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/';
    waveLink.href = baseUrl;

    // Afficher la carte de paiement et masquer le formulaire
    document.getElementById('payment-card').style.display = 'block';
    document.getElementById('form-card').style.display = 'none';

    // Scroll vers la section de paiement
    document.getElementById('payment-card').scrollIntoView({ behavior: 'smooth', block: 'start' });

    showAlert(
        '✅ Votre inscription a été enregistrée avec succès ! Procédez au paiement via Wave.',
        'success'
    );
}

/**
 * Affiche une alerte
 */
function showAlert(message, type = 'info') {
    const alertZone = document.getElementById('alert-zone');
    if (!alertZone) return;

    const iconMap = {
        'success': 'check-circle-fill',
        'danger': 'exclamation-triangle-fill',
        'warning': 'exclamation-circle-fill',
        'info': 'info-circle-fill'
    };

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.setAttribute('role', 'alert');
    alert.innerHTML = `
        <i class="bi bi-${iconMap[type]} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    alertZone.innerHTML = '';
    alertZone.appendChild(alert);

    // Auto-fermer après 10 secondes (sauf pour les erreurs)
    if (type !== 'danger') {
        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
            bsAlert.close();
        }, 10000);
    }

    // Faire défiler vers l'alerte
    alertZone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialiser l'application au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
