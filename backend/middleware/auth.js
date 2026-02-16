/**
 * 🔐 AUTH.JS - Middleware d'authentification admin
 */

/**
 * Vérifie que la requête contient une clé admin valide
 */
function verifyAdminKey(req, res, next) {
  const adminKey = req.get('x-admin-key');
  const validKey = process.env.ADMIN_SECRET_KEY;

  // Vérifier que la clé admin est configurée
  if (!validKey || validKey === 'changez-cette-cle-en-production-32-caracteres-minimum') {
    console.error('❌ ADMIN_SECRET_KEY non configurée ou utilise la valeur par défaut');
    return res.status(500).json({
      success: false,
      message: 'Configuration serveur incorrecte'
    });
  }

  // Vérifier que la clé est fournie
  if (!adminKey) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise - Clé admin manquante'
    });
  }

  // Vérifier que la clé est valide
  if (adminKey !== validKey) {
    console.log('❌ Tentative d\'accès admin avec clé invalide');
    return res.status(403).json({
      success: false,
      message: 'Clé admin invalide'
    });
  }

  // Clé valide, autoriser l'accès
  next();
}

module.exports = {
  verifyAdminKey
};
