/**
 * 🛣️ ROUTES ADMIN - Routes administratives (authentifiées)
 */

const express = require('express');
const router = express.Router();

const {
  listSoumissions,
  getSoumissionById,
  updateStatut,
  deleteSoumission,
  exportCSV
} = require('../controllers/adminController');

const { verifyAdminKey } = require('../middleware/auth');

const {
  validateListSoumissions,
  validateSoumissionId,
  validateUpdateStatut
} = require('../middleware/validation');

// Toutes les routes admin nécessitent une authentification
router.use(verifyAdminKey);

/**
 * GET /api/admin/soumissions
 * Lister toutes les soumissions avec filtres et pagination
 * Query params: statut, moyen_paiement, limit, offset
 */
router.get('/soumissions', validateListSoumissions, listSoumissions);

/**
 * GET /api/admin/soumissions/:id
 * Récupérer le détail d'une soumission par son ID
 */
router.get('/soumissions/:id', validateSoumissionId, getSoumissionById);

/**
 * PUT /api/admin/soumissions/:id/statut
 * Modifier le statut d'une soumission (valider/rejeter)
 * Body: { statut: 'confirme|rejete', note_admin?: string }
 */
router.put('/soumissions/:id/statut', validateUpdateStatut, updateStatut);

/**
 * DELETE /api/admin/soumissions/:id
 * Annuler une soumission (soft delete)
 */
router.delete('/soumissions/:id', validateSoumissionId, deleteSoumission);

/**
 * GET /api/admin/export/csv
 * Exporter les soumissions au format CSV
 * Query params: statut, moyen_paiement
 */
router.get('/export/csv', exportCSV);

module.exports = router;
