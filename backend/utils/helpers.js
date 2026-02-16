/**
 * 🛠️ HELPERS.JS - Fonctions utilitaires
 */

/**
 * Génère une référence unique pour une soumission
 * Format: REF-YYYYMMDD-XXXX
 */
function generateReference() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  
  return `REF-${year}${month}${day}-${random}`;
}

/**
 * Formate une date au format ISO
 */
function formatDateISO(date = new Date()) {
  return date.toISOString();
}

/**
 * Formate un montant en FCFA
 */
function formatMontant(montant) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant);
}

/**
 * Récupère l'adresse IP du client
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for'] 
    || req.headers['x-real-ip'] 
    || req.connection.remoteAddress 
    || req.socket.remoteAddress 
    || 'unknown';
}

/**
 * Récupère le User-Agent du client
 */
function getUserAgent(req) {
  return req.get('user-agent') || 'unknown';
}

/**
 * Convertit les données de soumission pour l'affichage
 */
function formatSoumissionForResponse(soumission) {
  if (!soumission) return null;
  
  return {
    ...soumission,
    montant_formatte: formatMontant(soumission.montant),
    moyen_paiement_label: getMoyenPaiementLabel(soumission.moyen_paiement),
    statut_label: getStatutLabel(soumission.statut)
  };
}

/**
 * Retourne le label d'un moyen de paiement
 */
function getMoyenPaiementLabel(moyen) {
  const labels = {
    'wave': 'Wave',
    'orange_money': 'Orange Money',
    'mtn_money': 'MTN Money',
    'moov_money': 'Moov Money'
  };
  return labels[moyen] || moyen;
}

/**
 * Retourne le label d'un statut
 */
function getStatutLabel(statut) {
  const labels = {
    'en_attente': 'En attente',
    'confirme': 'Confirmé',
    'rejete': 'Rejeté',
    'annule': 'Annulé'
  };
  return labels[statut] || statut;
}

/**
 * Calcule la période pour les statistiques
 */
function calculatePeriodeDates(periode) {
  const now = new Date();
  let startDate;
  
  switch(periode) {
    case 'jour':
      // Début de la journée
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    
    case 'semaine':
      // Début de la semaine (lundi)
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case 'mois':
      // Début du mois
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    
    default:
      startDate = new Date(0); // Depuis le début
  }
  
  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString()
  };
}

/**
 * Convertit une ligne de soumission en format CSV
 */
function soumissionToCSVRow(soumission) {
  return [
    soumission.id,
    soumission.reference,
    soumission.nom,
    soumission.prenoms,
    soumission.age,
    soumission.taille_tee_shirt,
    soumission.telephone,
    soumission.numero_paiement,
    soumission.montant,
    getMoyenPaiementLabel(soumission.moyen_paiement),
    getStatutLabel(soumission.statut),
    soumission.reference_operateur || '',
    soumission.date_soumission,
    soumission.date_confirmation || '',
    soumission.note_admin || ''
  ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
}

/**
 * Génère l'en-tête CSV pour l'export
 */
function getCSVHeader() {
  return [
    'ID',
    'Référence',
    'Nom',
    'Prénoms',
    'Age',
    'Taille Tee-shirt',
    'Téléphone',
    'Numéro Paiement',
    'Montant (FCFA)',
    'Moyen Paiement',
    'Statut',
    'Code Transaction',
    'Date Soumission',
    'Date Confirmation',
    'Note Admin'
  ].join(',');
}

/**
 * Valide un numéro de téléphone ivoirien
 */
function isValidIvorianPhone(phone) {
  // Format: 07/05/01 XX XX XX XX ou +225 XX XX XX XX XX
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+225)?[0157]\d{9}$/.test(cleaned) || /^[0157]\d{7}$/.test(cleaned);
}

/**
 * Sanitize une chaîne pour éviter les injections
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

module.exports = {
  generateReference,
  formatDateISO,
  formatMontant,
  getClientIP,
  getUserAgent,
  formatSoumissionForResponse,
  getMoyenPaiementLabel,
  getStatutLabel,
  calculatePeriodeDates,
  soumissionToCSVRow,
  getCSVHeader,
  isValidIvorianPhone,
  sanitizeString
};
