/**
 * 🛣️ ROUTES SOUMISSIONS - Routes publiques
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const {
  createSoumission,
  getSoumissionByReference,
  addReferenceOperateur
} = require('../controllers/soumissionController');

const {
  validateCreateSoumission,
  validateReferenceOperateur,
  validateGetByReference
} = require('../middleware/validation');

// Rate limiter pour les créations de soumissions
// Max 150 soumissions par IP par heure
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 150,
  message: {
    success: false,
    message: 'Trop de soumissions. Veuillez réessayer dans une heure.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter général pour toutes les routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.'
  }
});

// Appliquer le rate limiter général à toutes les routes
router.use(generalLimiter);

/**
 * POST /api/soumissions
 * Créer une nouvelle soumission
 */
router.post('/', createLimiter, validateCreateSoumission, createSoumission);

/**
 * GET /api/soumissions/:reference
 * Consulter une soumission par sa référence
 */
router.get('/:reference', validateGetByReference, getSoumissionByReference);

/**
 * PATCH /api/soumissions/:reference/reference-operateur
 * Ajouter le code de transaction mobile money
 */
router.patch(
  '/:reference/reference-operateur',
  validateReferenceOperateur,
  addReferenceOperateur
);

module.exports = router;
