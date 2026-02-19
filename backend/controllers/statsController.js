/**
 * 📊 STATS CONTROLLER - Statistiques et analyses
 */

const { queryAll, queryOne } = require('../models/database');
const { calculatePeriodeDates, formatMontant } = require('../utils/helpers');

/**
 * Récupère les statistiques globales
 * GET /api/stats
 */
async function getStatsGlobales(req, res) {
  try {
    // Total des soumissions
    const { total_soumissions } = await queryOne(
      'SELECT COUNT(*) as total_soumissions FROM soumissions'
    );

    // Total par statut
    const statutStats = await queryAll(
      `SELECT statut, COUNT(*) as count
       FROM soumissions
       GROUP BY statut`
    );

    const statsParStatut = {
      en_attente: 0,
      confirme: 0,
      rejete: 0,
      annule: 0
    };

    statutStats.forEach(stat => {
      statsParStatut[stat.statut] = stat.count;
    });

    // Total des montants par statut
    const montantStats = await queryAll(
      `SELECT statut, SUM(montant) as total
       FROM soumissions
       GROUP BY statut`
    );

    const montantsParStatut = {};
    montantStats.forEach(stat => {
      montantsParStatut[stat.statut] = {
        montant: stat.total || 0,
        montant_formatte: formatMontant(stat.total || 0)
      };
    });

    // Total collecté (confirmé uniquement)
    const { total_collecte } = await queryOne(
      `SELECT COALESCE(SUM(montant), 0) as total_collecte
       FROM soumissions
       WHERE statut = 'confirme'`
    );

    // Répartition par moyen de paiement
    const moyenPaiementStats = await queryAll(
      `SELECT moyen_paiement, COUNT(*) as count, SUM(montant) as total
       FROM soumissions
       GROUP BY moyen_paiement`
    );

    const statsParMoyenPaiement = {};
    moyenPaiementStats.forEach(stat => {
      statsParMoyenPaiement[stat.moyen_paiement] = {
        count: stat.count,
        montant: stat.total || 0,
        montant_formatte: formatMontant(stat.total || 0)
      };
    });

    // Répartition par taille de tee-shirt
    const tailleStats = await queryAll(
      `SELECT taille_tee_shirt, COUNT(*) as count, SUM(montant) as total
       FROM soumissions
       GROUP BY taille_tee_shirt
       ORDER BY taille_tee_shirt`
    );

    const statsParTaille = {};
    tailleStats.forEach(stat => {
      statsParTaille[stat.taille_tee_shirt] = {
        count: stat.count,
        montant: stat.total || 0,
        montant_formatte: formatMontant(stat.total || 0)
      };
    });

    // Répartition par âge (tranches de 10 ans)
    const ageStats = await queryAll(
      `SELECT 
         CASE
           WHEN age < 18 THEN 'Moins de 18'
           WHEN age BETWEEN 18 AND 25 THEN '18-25'
           WHEN age BETWEEN 26 AND 35 THEN '26-35'
           WHEN age BETWEEN 36 AND 45 THEN '36-45'
           WHEN age BETWEEN 46 AND 55 THEN '46-55'
           WHEN age > 55 THEN 'Plus de 55'
         END as tranche_age,
         COUNT(*) as count,
         SUM(montant) as total
       FROM soumissions
       GROUP BY tranche_age
       ORDER BY 
         CASE
           WHEN age < 18 THEN 1
           WHEN age BETWEEN 18 AND 25 THEN 2
           WHEN age BETWEEN 26 AND 35 THEN 3
           WHEN age BETWEEN 36 AND 45 THEN 4
           WHEN age BETWEEN 46 AND 55 THEN 5
           WHEN age > 55 THEN 6
         END`
    );

    const statsParAge = {};
    ageStats.forEach(stat => {
      statsParAge[stat.tranche_age] = {
        count: stat.count,
        montant: stat.total || 0,
        montant_formatte: formatMontant(stat.total || 0)
      };
    });

    // Montant moyen
    const { montant_moyen } = await queryOne(
      `SELECT COALESCE(AVG(montant), 0) as montant_moyen
       FROM soumissions
       WHERE statut = 'confirme'`
    );

    // Dernières soumissions
    const dernieresSoumissions = await queryAll(
      `SELECT reference, nom, prenoms, montant, moyen_paiement, statut, date_soumission
       FROM soumissions
       ORDER BY date_soumission DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        total_soumissions,
        total_collecte,
        total_collecte_formatte: formatMontant(total_collecte),
        montant_moyen,
        montant_moyen_formatte: formatMontant(montant_moyen),
        stats_par_statut: statsParStatut,
        montants_par_statut: montantsParStatut,
        stats_par_moyen_paiement: statsParMoyenPaiement,
        stats_par_taille: statsParTaille,
        stats_par_age: statsParAge,
        dernieres_soumissions: dernieresSoumissions
      }
    });

  } catch (error) {
    console.error('❌ Erreur getStatsGlobales:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
}

/**
 * Récupère les statistiques pour une période donnée
 * GET /api/stats/periode/:periode (jour, semaine, mois)
 */
async function getStatsPeriode(req, res) {
  try {
    const { periode } = req.params;
    const { startDate, endDate } = calculatePeriodeDates(periode);

    // Total des soumissions sur la période
    const { total_soumissions } = await queryOne(
      `SELECT COUNT(*) as total_soumissions
       FROM soumissions
       WHERE date_soumission >= ? AND date_soumission <= ?`,
      [startDate, endDate]
    );

    // Total par statut sur la période
    const statutStats = await queryAll(
      `SELECT statut, COUNT(*) as count
       FROM soumissions
       WHERE date_soumission >= ? AND date_soumission <= ?
       GROUP BY statut`,
      [startDate, endDate]
    );

    const statsParStatut = {
      en_attente: 0,
      confirme: 0,
      rejete: 0,
      annule: 0
    };

    statutStats.forEach(stat => {
      statsParStatut[stat.statut] = stat.count;
    });

    // Total collecté sur la période
    const { total_collecte } = await queryOne(
      `SELECT COALESCE(SUM(montant), 0) as total_collecte
       FROM soumissions
       WHERE statut = 'confirme' 
       AND date_soumission >= ? AND date_soumission <= ?`,
      [startDate, endDate]
    );

    // Répartition par taille sur la période
    const tailleStats = await queryAll(
      `SELECT taille_tee_shirt, COUNT(*) as count, SUM(montant) as total
       FROM soumissions
       WHERE date_soumission >= ? AND date_soumission <= ?
       GROUP BY taille_tee_shirt
       ORDER BY taille_tee_shirt`,
      [startDate, endDate]
    );

    const statsParTaille = {};
    tailleStats.forEach(stat => {
      statsParTaille[stat.taille_tee_shirt] = {
        count: stat.count,
        montant: stat.total || 0,
        montant_formatte: formatMontant(stat.total || 0)
      };
    });

    // Répartition par âge sur la période
    const ageStats = await queryAll(
      `SELECT 
         CASE
           WHEN age < 18 THEN 'Moins de 18'
           WHEN age BETWEEN 18 AND 25 THEN '18-25'
           WHEN age BETWEEN 26 AND 35 THEN '26-35'
           WHEN age BETWEEN 36 AND 45 THEN '36-45'
           WHEN age BETWEEN 46 AND 55 THEN '46-55'
           WHEN age > 55 THEN 'Plus de 55'
         END as tranche_age,
         COUNT(*) as count,
         SUM(montant) as total
       FROM soumissions
       WHERE date_soumission >= ? AND date_soumission <= ?
       GROUP BY tranche_age
       ORDER BY 
         CASE
           WHEN age < 18 THEN 1
           WHEN age BETWEEN 18 AND 25 THEN 2
           WHEN age BETWEEN 26 AND 35 THEN 3
           WHEN age BETWEEN 36 AND 45 THEN 4
           WHEN age BETWEEN 46 AND 55 THEN 5
           WHEN age > 55 THEN 6
         END`,
      [startDate, endDate]
    );

    const statsParAge = {};
    ageStats.forEach(stat => {
      statsParAge[stat.tranche_age] = {
        count: stat.count,
        montant: stat.total || 0,
        montant_formatte: formatMontant(stat.total || 0)
      };
    });

    // Évolution par jour (pour graphique)
    const evolutionParJour = await queryAll(
      `SELECT 
         DATE(date_soumission) as jour,
         COUNT(*) as count,
         SUM(CASE WHEN statut = 'confirme' THEN montant ELSE 0 END) as montant_confirme
       FROM soumissions
       WHERE date_soumission >= ? AND date_soumission <= ?
       GROUP BY DATE(date_soumission)
       ORDER BY jour`,
      [startDate, endDate]
    );

    // Top contributeurs sur la période
    const topContributeurs = await queryAll(
      `SELECT nom, prenoms, telephone, SUM(montant) as total_montant, COUNT(*) as nb_contributions
       FROM soumissions
       WHERE statut = 'confirme'
       AND date_soumission >= ? AND date_soumission <= ?
       GROUP BY nom, prenoms, telephone
       ORDER BY total_montant DESC
       LIMIT 10`,
      [startDate, endDate]
    );

    res.json({
      success: true,
      data: {
        periode,
        date_debut: startDate,
        date_fin: endDate,
        total_soumissions,
        stats_par_statut: statsParStatut,
        stats_par_taille: statsParTaille,
        stats_par_age: statsParAge,
        total_collecte,
        total_collecte_formatte: formatMontant(total_collecte),
        evolution_par_jour: evolutionParJour.map(e => ({
          jour: e.jour,
          count: e.count,
          montant_confirme: e.montant_confirme,
          montant_confirme_formatte: formatMontant(e.montant_confirme || 0)
        })),
        top_contributeurs: topContributeurs.map(c => ({
          nom: c.nom,
          prenoms: c.prenoms,
          telephone: c.telephone,
          total_montant: c.total_montant,
          total_montant_formatte: formatMontant(c.total_montant),
          nb_contributions: c.nb_contributions
        }))
      }
    });

  } catch (error) {
    console.error('❌ Erreur getStatsPeriode:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques de période'
    });
  }
}

module.exports = {
  getStatsGlobales,
  getStatsPeriode
};
