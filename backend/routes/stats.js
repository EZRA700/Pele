/**
 * 🛣️ ROUTES STATS - Routes pour les statistiques
 */

const express = require('express');
const router = express.Router();

const {
  getStatsGlobales,
  getStatsPeriode
} = require('../controllers/statsController');

const { verifyAdminKey } = require('../middleware/auth');
const { validateStatsPeriode } = require('../middleware/validation');

// Toutes les routes stats nécessitent une authentification admin
router.use(verifyAdminKey);

/**
 * GET /api/stats
 * Récupérer les statistiques globales
 */
router.get('/', getStatsGlobales);

/**
 * GET /api/stats/periode/:periode
 * Récupérer les statistiques pour une période donnée
 * Params: periode = 'jour' | 'semaine' | 'mois'
 */
router.get('/periode/:periode', validateStatsPeriode, getStatsPeriode);

module.exports = router;
