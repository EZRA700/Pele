/**
 * 📋 CONFIRMATION.JS - Logique de la page de confirmation
 * Affiche les détails et permet d'ajouter le code de transaction
 */

let soumissionData = null;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    initializeConfirmation();
});

/**
 * Initialise la page de confirmation
 */
function initializeConfirmation() {
    debugLog('Initialisation de la page de confirmation...');
    
    // Récupérer les données de la soumission
    const dataString = sessionStorage.getItem('soumission');
    
    if (!dataString) {
        // Pas de données, rediriger vers l'accueil
        showAlert('Aucune soumission trouvée. Veuillez remplir le formulaire.', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    try {
        soumissionData = JSON.parse(dataString);
        debugLog('Données de soumission récupérées:', soumissionData);
        
        // Afficher les informations
        displaySoumissionInfo();
        
        // Afficher les instructions de paiement
        displayPaymentInstructions();
        
        // Initialiser le formulaire de code de transaction
        initializeCodeForm();
        
    } catch (error) {
        debugLog('Erreur lors du parsing des données:', error);
        showAlert('Erreur lors de la récupération des données.', 'danger');
    }
}

/**
 * Affiche les informations de la soumission
 */
function displaySoumissionInfo() {
    // Référence
    const referenceEl = document.getElementById('referenceCode');
    if (referenceEl) {
        referenceEl.textContent = soumissionData.reference || '-';
    }
    
    // Récapitulatif
    document.getElementById('recap_nom').textContent = soumissionData.nom_complet || '-';
    document.getElementById('recap_telephone').textContent = soumissionData.telephone || '-';
    document.getElementById('recap_type').textContent = soumissionData.type_contribution || '-';
    document.getElementById('recap_montant').textContent = formatMontant(soumissionData.montant || 0);
    
    const moyenLabel = CONFIG.PAYMENT_LABELS[soumissionData.moyen_paiement] || soumissionData.moyen_paiement;
    document.getElementById('recap_moyen').textContent = moyenLabel;
}

/**
 * Affiche les instructions de paiement
 */
function displayPaymentInstructions() {
    const moyenPaiement = soumissionData.moyen_paiement;
    const appLabel = CONFIG.PAYMENT_LABELS[moyenPaiement] || 'Mobile Money';
    const numero = CONFIG.PAYMENT_NUMBERS_DISPLAY[moyenPaiement] || CONFIG.PAYMENT_NUMBERS_DISPLAY.wave;
    
    // Nom de l'app
    const appNameEl = document.getElementById('appName');
    if (appNameEl) {
        appNameEl.textContent = appLabel;
    }
    
    // Numéro de paiement
    const paymentNumberEl = document.getElementById('paymentNumber');
    if (paymentNumberEl) {
        paymentNumberEl.textContent = numero;
        paymentNumberEl.dataset.number = CONFIG.PAYMENT_NUMBERS[moyenPaiement] || CONFIG.PAYMENT_NUMBERS.wave;
    }
    
    // Montant
    const paymentMontantEl = document.getElementById('paymentMontant');
    if (paymentMontantEl) {
        paymentMontantEl.textContent = formatMontant(soumissionData.montant || 0);
    }
}

/**
 * Initialise le formulaire de code de transaction
 */
function initializeCodeForm() {
    const form = document.getElementById('codeTransactionForm');
    if (form) {
        form.addEventListener('submit', handleCodeSubmit);
    }
}

/**
 * Gère la soumission du code de transaction
 */
async function handleCodeSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const codeInput = document.getElementById('referenceOperateur');
    const referenceOperateur = codeInput.value.trim();
    
    if (!referenceOperateur || referenceOperateur.length < 3) {
        showAlert('Veuillez entrer un code de transaction valide', 'warning');
        return;
    }
    
    // Désactiver le bouton
    const submitBtn = document.getElementById('submitCodeBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours...';
    
    try {
        // Envoyer le code au serveur
        const response = await fetch(
            `${CONFIG.API_URL}/soumissions/${soumissionData.reference}/reference-operateur`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reference_operateur: referenceOperateur })
            }
        );
        
        const result = await response.json();
        debugLog('Réponse du serveur:', result);
        
        if (response.ok && result.success) {
            // Succès
            showAlert(CONFIG.MESSAGES.success.referenceOperateur, 'success');
            
            // Masquer le formulaire
            document.getElementById('paymentInstructions').classList.add('d-none');
            
            // Afficher le message de succès
            document.getElementById('successCard').classList.remove('d-none');
            
            // Nettoyer le sessionStorage
            sessionStorage.removeItem('soumission');
            
            // Scroll vers le haut
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Erreur
            const errorMessage = result.message || CONFIG.MESSAGES.error.serverError;
            showAlert(errorMessage, 'danger');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (error) {
        debugLog('Erreur lors de l\'envoi du code:', error);
        showAlert(CONFIG.MESSAGES.error.network, 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/**
 * Copie la référence dans le presse-papiers
 */
function copyReference() {
    const reference = soumissionData.reference;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Méthode moderne
        navigator.clipboard.writeText(reference).then(() => {
            showAlert('Référence copiée !', 'success');
        }).catch(err => {
            debugLog('Erreur lors de la copie:', err);
            fallbackCopy(reference);
        });
    } else {
        // Méthode de secours
        fallbackCopy(reference);
    }
}

/**
 * Copie le numéro de paiement dans le presse-papiers
 */
function copyNumber() {
    const numberEl = document.getElementById('paymentNumber');
    const number = numberEl ? numberEl.dataset.number : '';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(number).then(() => {
            showAlert('Numéro copié !', 'success');
        }).catch(err => {
            debugLog('Erreur lors de la copie:', err);
            fallbackCopy(number);
        });
    } else {
        fallbackCopy(number);
    }
}

/**
 * Méthode de secours pour copier dans le presse-papiers
 */
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert('Text copié !', 'success');
    } catch (err) {
        debugLog('Erreur execCommand:', err);
        showAlert('Impossible de copier automatiquement. Veuillez copier manuellement.', 'warning');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Affiche une alerte
 */
function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show animate-slide-in`;
    alertDiv.role = 'alert';
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'danger') icon = 'exclamation-triangle';
    if (type === 'warning') icon = 'exclamation-circle';
    
    alertDiv.innerHTML = `
        <i class="bi bi-${icon}"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    container.innerHTML = '';
    container.appendChild(alertDiv);
    
    // Auto-dismiss après 5 secondes
    setTimeout(() => {
        alertDiv.remove();
    }, CONFIG.TOAST_DURATION);
}
