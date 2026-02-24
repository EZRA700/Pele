/**
 * ✅ VALIDATION.JS - Middleware de validation des données
 * Utilise express-validator pour valider les entrées
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware pour vérifier les résultats de validation
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array().map(err => ({
        champ: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
}

/**
 * Validation pour créer une soumission
 */
const validateCreateSoumission = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('prenoms')
    .trim()
    .notEmpty().withMessage('Les prénoms sont requis')
    .isLength({ min: 2, max: 100 }).withMessage('Les prénoms doivent contenir entre 2 et 100 caractères'),
  
  body('age')
    .notEmpty().withMessage('L\'âge est requis')
    .isInt({ min: 1, max: 120 }).withMessage('L\'âge doit être entre 1 et 120 ans'),
  
  body('taille_tee_shirt')
    .trim()
    .notEmpty().withMessage('La taille de tee-shirt est requise')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('Taille invalide (XS, S, M, L, XL, XXL)'),
  
  body('telephone')
    .trim()
    .notEmpty().withMessage('Le numéro de téléphone est requis')
    .matches(/^[0-9\s\-\+\(\)]{8,20}$/).withMessage('Format de téléphone invalide'),
  
  body('numero_paiement')
    .trim()
    .notEmpty().withMessage('Le numéro de paiement est requis')
    .matches(/^[0-9\s\-\+\(\)]{8,20}$/).withMessage('Format de numéro de paiement invalide'),
  
  body('montant')
    .optional()
    .isFloat({ min: 6000 }).withMessage('Le montant doit être de 6000 FCFA'),
  
  body('moyen_paiement')
    .optional()
    .isIn(['wave'])
    .withMessage('Seul Wave est accepté comme moyen de paiement'),
  
  handleValidationErrors
];

/**
 * Validation pour ajouter une référence opérateur
 */
const validateReferenceOperateur = [
  param('reference')
    .trim()
    .notEmpty().withMessage('La référence est requise')
    .matches(/^REF-\d{8}-\d{4}$/).withMessage('Format de référence invalide'),
  
  body('reference_operateur')
    .trim()
    .notEmpty().withMessage('Le code de transaction est requis')
    .isLength({ min: 3, max: 50 }).withMessage('Le code doit contenir entre 3 et 50 caractères'),
  
  handleValidationErrors
];

/**
 * Validation pour consulter une soumission par référence
 */
const validateGetByReference = [
  param('reference')
    .trim()
    .notEmpty().withMessage('La référence est requise')
    .matches(/^REF-\d{8}-\d{4}$/).withMessage('Format de référence invalide'),
  
  handleValidationErrors
];

/**
 * Validation pour modifier le statut d'une soumission
 */
const validateUpdateStatut = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID invalide'),
  
  body('statut')
    .notEmpty().withMessage('Le statut est requis')
    .isIn(['confirme', 'rejete', 'annule'])
    .withMessage('Statut invalide (confirme, rejete, annule)'),
  
  body('note_admin')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('La note ne doit pas dépasser 500 caractères'),
  
  handleValidationErrors
];

/**
 * Validation pour les paramètres de liste des soumissions
 */
const validateListSoumissions = [
  query('statut')
    .optional()
    .isIn(['en_attente', 'confirme', 'rejete', 'annule'])
    .withMessage('Statut invalide'),
  
  query('moyen_paiement')
    .optional()
    .isIn(['wave'])
    .withMessage('Seul Wave est accepté'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Limite invalide (1-1000)')
    .toInt(),
  
  query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('Offset invalide')
    .toInt(),
  
  handleValidationErrors
];

/**
 * Validation pour l'ID d'une soumission
 */
const validateSoumissionId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID invalide'),
  
  handleValidationErrors
];

/**
 * Validation pour la période des statistiques
 */
const validateStatsPeriode = [
  param('periode')
    .isIn(['jour', 'semaine', 'mois'])
    .withMessage('Période invalide (jour, semaine, mois)'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateSoumission,
  validateReferenceOperateur,
  validateGetByReference,
  validateUpdateStatut,
  validateListSoumissions,
  validateSoumissionId,
  validateStatsPeriode,
  handleValidationErrors
};
