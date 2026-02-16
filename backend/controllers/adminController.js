/**
 * 👨‍💼 ADMIN CONTROLLER - Gestion administrative des soumissions
 */

const { queryAll, queryOne, queryRun } = require('../models/database');
const { 
  formatSoumissionForResponse, 
  formatDateISO,
  soumissionToCSVRow,
  getCSVHeader
} = require('../utils/helpers');

/**
 * Liste toutes les soumissions avec filtres et pagination
 * GET /api/admin/soumissions
 */
async function listSoumissions(req, res) {
  try {
    const { 
      statut, 
      moyen_paiement, 
      limit = 50, 
      offset = 0 
    } = req.query;

    // Construire la requête SQL
    let sql = `
      SELECT 
        id, reference, nom, prenoms, age, taille_tee_shirt, telephone,
        numero_paiement, montant, moyen_paiement,
        statut, reference_operateur, date_soumission, date_confirmation,
        note_admin
      FROM soumissions
      WHERE 1=1
    `;
    const params = [];

    // Filtrer par statut
    if (statut) {
      sql += ' AND statut = ?';
      params.push(statut);
    }

    // Filtrer par moyen de paiement
    if (moyen_paiement) {
      sql += ' AND moyen_paiement = ?';
      params.push(moyen_paiement);
    }

    // Trier par date (plus récent en premier)
    sql += ' ORDER BY date_soumission DESC';

    // Pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const soumissions = await queryAll(sql, params);

    // Compter le total
    let countSql = 'SELECT COUNT(*) as total FROM soumissions WHERE 1=1';
    const countParams = [];

    if (statut) {
      countSql += ' AND statut = ?';
      countParams.push(statut);
    }

    if (moyen_paiement) {
      countSql += ' AND moyen_paiement = ?';
      countParams.push(moyen_paiement);
    }

    const { total } = await queryOne(countSql, countParams);

    res.json({
      success: true,
      data: soumissions.map(formatSoumissionForResponse),
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + soumissions.length) < total
      }
    });

  } catch (error) {
    console.error('❌ Erreur listSoumissions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des soumissions'
    });
  }
}

/**
 * Récupère le détail d'une soumission par son ID
 * GET /api/admin/soumissions/:id
 */
async function getSoumissionById(req, res) {
  try {
    const { id } = req.params;

    const soumission = await queryOne(
      `SELECT 
        id, reference, nom, prenoms, age, taille_tee_shirt, telephone,
        numero_paiement, montant, moyen_paiement,
        statut, reference_operateur, date_soumission, date_confirmation,
        ip_adresse, user_agent, note_admin
      FROM soumissions 
      WHERE id = ?`,
      [id]
    );

    if (!soumission) {
      return res.status(404).json({
        success: false,
        message: 'Soumission non trouvée'
      });
    }

    res.json({
      success: true,
      data: formatSoumissionForResponse(soumission)
    });

  } catch (error) {
    console.error('❌ Erreur getSoumissionById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la soumission'
    });
  }
}

/**
 * Modifie le statut d'une soumission (valider/rejeter)
 * PUT /api/admin/soumissions/:id/statut
 */
async function updateStatut(req, res) {
  try {
    const { id } = req.params;
    const { statut, note_admin } = req.body;

    // Vérifier que la soumission existe
    const soumission = await queryOne(
      'SELECT id, statut, reference FROM soumissions WHERE id = ?',
      [id]
    );

    if (!soumission) {
      return res.status(404).json({
        success: false,
        message: 'Soumission non trouvée'
      });
    }

    // Vérifier que la soumission n'est pas déjà annulée
    if (soumission.statut === 'annule') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de modifier une soumission annulée'
      });
    }

    // Déterminer la date de confirmation
    const date_confirmation = (statut === 'confirme') ? formatDateISO() : null;

    // Mettre à jour le statut
    await queryRun(
      `UPDATE soumissions 
       SET statut = ?, date_confirmation = ?, note_admin = ?
       WHERE id = ?`,
      [statut, date_confirmation, note_admin || null, id]
    );

    // Logger l'action
    await queryRun(
      `INSERT INTO logs_admin (action, soumission_id, details, date_action)
       VALUES (?, ?, ?, ?)`,
      [
        'update_statut',
        id,
        JSON.stringify({ ancien_statut: soumission.statut, nouveau_statut: statut }),
        formatDateISO()
      ]
    );

    console.log(`✅ Statut modifié pour ${soumission.reference}: ${statut}`);

    res.json({
      success: true,
      message: `Soumission ${statut === 'confirme' ? 'validée' : 'rejetée'} avec succès`
    });

  } catch (error) {
    console.error('❌ Erreur updateStatut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du statut'
    });
  }
}

/**
 * Annule une soumission
 * DELETE /api/admin/soumissions/:id
 */
async function deleteSoumission(req, res) {
  try {
    const { id } = req.params;

    // Vérifier que la soumission existe
    const soumission = await queryOne(
      'SELECT id, reference, statut FROM soumissions WHERE id = ?',
      [id]
    );

    if (!soumission) {
      return res.status(404).json({
        success: false,
        message: 'Soumission non trouvée'
      });
    }

    // Vérifier que la soumission n'est pas déjà annulée
    if (soumission.statut === 'annule') {
      return res.status(400).json({
        success: false,
        message: 'Cette soumission est déjà annulée'
      });
    }

    // Marquer comme annulée au lieu de supprimer
    await queryRun(
      'UPDATE soumissions SET statut = ?, note_admin = ? WHERE id = ?',
      ['annule', 'Annulée par l\'administrateur', id]
    );

    // Logger l'action
    await queryRun(
      `INSERT INTO logs_admin (action, soumission_id, details, date_action)
       VALUES (?, ?, ?, ?)`,
      [
        'delete_soumission',
        id,
        JSON.stringify({ ancien_statut: soumission.statut }),
        formatDateISO()
      ]
    );

    console.log(`✅ Soumission annulée: ${soumission.reference}`);

    res.json({
      success: true,
      message: 'Soumission annulée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur deleteSoumission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la soumission'
    });
  }
}

/**
 * Exporte les soumissions au format CSV
 * GET /api/admin/export/csv
 */
async function exportCSV(req, res) {
  try {
    const { statut, moyen_paiement } = req.query;

    // Construire la requête SQL
    let sql = `
      SELECT 
        id, reference, nom, prenoms, age, taille_tee_shirt, telephone,
        numero_paiement, montant, moyen_paiement,
        statut, reference_operateur, date_soumission, date_confirmation,
        note_admin
      FROM soumissions
      WHERE 1=1
    `;
    const params = [];

    if (statut) {
      sql += ' AND statut = ?';
      params.push(statut);
    }

    if (moyen_paiement) {
      sql += ' AND moyen_paiement = ?';
      params.push(moyen_paiement);
    }

    sql += ' ORDER BY date_soumission DESC';

    const soumissions = await queryAll(sql, params);

    // Générer le CSV
    const csvRows = [getCSVHeader()];
    soumissions.forEach(soumission => {
      csvRows.push(soumissionToCSVRow(soumission));
    });

    const csv = csvRows.join('\n');

    // Nom du fichier avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `soumissions_${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM pour Excel

    console.log(`✅ Export CSV généré: ${soumissions.length} lignes`);

  } catch (error) {
    console.error('❌ Erreur exportCSV:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export CSV'
    });
  }
}

module.exports = {
  listSoumissions,
  getSoumissionById,
  updateStatut,
  deleteSoumission,
  exportCSV
};
