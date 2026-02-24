/**
 * 📝 SOUMISSION CONTROLLER - Gestion des soumissions publiques
 */

const { queryOne, queryRun } = require('../models/database');
const { 
  generateReference, 
  formatDateISO, 
  getClientIP, 
  getUserAgent,
  formatSoumissionForResponse 
} = require('../utils/helpers');

/**
 * Crée une nouvelle soumission
 * POST /api/soumissions
 */
async function createSoumission(req, res) {
  try {
    const {
      nom,
      prenoms,
      age,
      taille_tee_shirt,
      telephone,
      numero_paiement,
      montant
    } = req.body;

    // Montant fixe de l'inscription
    const MONTANT_FIXE = 6000;
    const montantFinal = montant || MONTANT_FIXE;

    // Générer une référence unique
    let reference = generateReference();
    let attempts = 0;
    const maxAttempts = 10;

    // Vérifier l'unicité de la référence
    while (attempts < maxAttempts) {
      const existing = await queryOne(
        'SELECT id FROM soumissions WHERE reference = ?',
        [reference]
      );

      if (!existing) break;
      
      reference = generateReference();
      attempts++;
    }

    if (attempts === maxAttempts) {
      return res.status(500).json({
        success: false,
        message: 'Impossible de générer une référence unique'
      });
    }

    // Récupérer les informations du client
    const ip_adresse = getClientIP(req);
    const user_agent = getUserAgent(req);
    const date_soumission = formatDateISO();

    // Insérer la soumission
    const result = await queryRun(
      `INSERT INTO soumissions (
        reference, nom, prenoms, age, taille_tee_shirt, telephone,
        numero_paiement, montant, moyen_paiement,
        date_soumission, ip_adresse, user_agent, statut
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'wave', ?, ?, ?, 'en_attente')`,
      [
        reference,
        nom,
        prenoms,
        age,
        taille_tee_shirt,
        telephone,
        numero_paiement,
        montantFinal,
        date_soumission,
        ip_adresse,
        user_agent
      ]
    );

    console.log(`✅ Nouvelle soumission créée: ${reference}`);

    res.status(201).json({
      success: true,
      message: 'Soumission créée avec succès',
      data: {
        id: result.lastID,
        reference,
        nom,
        prenoms,
        age,
        taille_tee_shirt,
        telephone,
        numero_paiement,
        montant: montantFinal,
        moyen_paiement: 'wave',
        statut: 'en_attente',
        date_soumission
      }
    });

  } catch (error) {
    console.error('❌ Erreur createSoumission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la soumission'
    });
  }
}

/**
 * Récupère une soumission par sa référence
 * GET /api/soumissions/:reference
 */
async function getSoumissionByReference(req, res) {
  try {
    const { reference } = req.params;

    const soumission = await queryOne(
      `SELECT 
        id, reference, nom, prenoms, age, taille_tee_shirt, telephone,
        numero_paiement, montant, moyen_paiement,
        statut, reference_operateur, date_soumission, date_confirmation
      FROM soumissions 
      WHERE reference = ?`,
      [reference]
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
    console.error('❌ Erreur getSoumissionByReference:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la soumission'
    });
  }
}

/**
 * Ajoute une référence opérateur à une soumission
 * PATCH /api/soumissions/:reference/reference-operateur
 */
async function addReferenceOperateur(req, res) {
  try {
    const { reference } = req.params;
    const { reference_operateur } = req.body;

    // Vérifier que la soumission existe
    const soumission = await queryOne(
      'SELECT id, statut FROM soumissions WHERE reference = ?',
      [reference]
    );

    if (!soumission) {
      return res.status(404).json({
        success: false,
        message: 'Soumission non trouvée'
      });
    }

    // Vérifier que la soumission est en attente
    if (soumission.statut !== 'en_attente') {
      return res.status(400).json({
        success: false,
        message: 'Cette soumission a déjà été traitée'
      });
    }

    // Mettre à jour la référence opérateur
    await queryRun(
      'UPDATE soumissions SET reference_operateur = ? WHERE reference = ?',
      [reference_operateur, reference]
    );

    console.log(`✅ Référence opérateur ajoutée pour ${reference}: ${reference_operateur}`);

    res.json({
      success: true,
      message: 'Code de transaction enregistré avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur addReferenceOperateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement du code de transaction'
    });
  }
}

module.exports = {
  createSoumission,
  getSoumissionByReference,
  addReferenceOperateur
};
