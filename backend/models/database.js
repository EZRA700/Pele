/**
 * 🗄️ DATABASE.JS - Gestion de la base de données SQLite
 * Initialisation, schéma et requêtes paramétrées
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/collecte.db';
let db = null;

/**
 * Initialise la connexion à la base de données
 */
function getDatabase() {
  if (!db) {
    // Créer le dossier database s'il n'existe pas
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Erreur connexion SQLite:', err);
        throw err;
      }
      console.log('✅ Connecté à la base de données SQLite');
    });

    // Activer les clés étrangères
    db.run('PRAGMA foreign_keys = ON');
  }
  return db;
}

/**
 * Initialise le schéma de la base de données
 */
async function initDatabase() {
  const database = getDatabase();

  return new Promise((resolve, reject) => {
    database.serialize(() => {
      // Table des soumissions
      database.run(`
        CREATE TABLE IF NOT EXISTS soumissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          reference TEXT UNIQUE NOT NULL,
          nom TEXT NOT NULL,
          prenoms TEXT NOT NULL,
          age INTEGER NOT NULL,
          taille_tee_shirt TEXT NOT NULL,
          telephone TEXT NOT NULL,
          numero_paiement TEXT NOT NULL,
          montant REAL NOT NULL,
          moyen_paiement TEXT DEFAULT 'wave',
          statut TEXT DEFAULT 'en_attente',
          reference_operateur TEXT,
          date_soumission TEXT NOT NULL,
          date_confirmation TEXT,
          ip_adresse TEXT,
          user_agent TEXT,
          note_admin TEXT,
          CHECK(statut IN ('en_attente', 'confirme', 'rejete', 'annule')),
          CHECK(moyen_paiement = 'wave'),
          CHECK(montant > 0),
          CHECK(age > 0),
          CHECK(taille_tee_shirt IN ('XS', 'S', 'M', 'L', 'XL', 'XXL'))
        )
      `, (err) => {
        if (err) {
          console.error('❌ Erreur création table soumissions:', err);
          return reject(err);
        }
      });

      // Table des logs admin
      database.run(`
        CREATE TABLE IF NOT EXISTS logs_admin (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          action TEXT NOT NULL,
          soumission_id INTEGER,
          details TEXT,
          date_action TEXT NOT NULL,
          FOREIGN KEY(soumission_id) REFERENCES soumissions(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) {
          console.error('❌ Erreur création table logs_admin:', err);
          return reject(err);
        }
      });

      // Index pour optimiser les requêtes
      database.run('CREATE INDEX IF NOT EXISTS idx_reference ON soumissions(reference)');
      database.run('CREATE INDEX IF NOT EXISTS idx_statut ON soumissions(statut)');
      database.run('CREATE INDEX IF NOT EXISTS idx_moyen_paiement ON soumissions(moyen_paiement)');
      database.run('CREATE INDEX IF NOT EXISTS idx_date_soumission ON soumissions(date_soumission)');

      console.log('✅ Schéma de base de données créé');
      resolve();
    });
  });
}

/**
 * Exécute une requête SELECT et retourne toutes les lignes
 */
function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().all(sql, params, (err, rows) => {
      if (err) {
        console.error('❌ Erreur queryAll:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Exécute une requête SELECT et retourne une seule ligne
 */
function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().get(sql, params, (err, row) => {
      if (err) {
        console.error('❌ Erreur queryOne:', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

/**
 * Exécute une requête INSERT/UPDATE/DELETE
 */
function queryRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().run(sql, params, function(err) {
      if (err) {
        console.error('❌ Erreur queryRun:', err);
        reject(err);
      } else {
        resolve({
          lastID: this.lastID,
          changes: this.changes
        });
      }
    });
  });
}

/**
 * Ferme la connexion à la base de données
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('❌ Erreur fermeture base de données:', err);
          reject(err);
        } else {
          console.log('✅ Base de données fermée');
          db = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  queryAll,
  queryOne,
  queryRun,
  closeDatabase
};
