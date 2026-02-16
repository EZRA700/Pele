/**
 * 🚀 SERVER.JS - Collecte Communautaire API
 * Point d'entrée principal du backend
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Import des routes
const soumissionsRoutes = require('./routes/soumissions');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');

// Import de la base de données
const { initDatabase } = require('./models/database');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3003;

// 🔒 Sécurité - Helmet
app.use(helmet());

// 🌐 CORS - Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origine (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ Origine non autorisée: ${origin}`);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-admin-key']
}));

// 📦 Middleware pour parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 Logger des requêtes (développement)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString('fr-FR');
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// 🏥 Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Collecte Communautaire est opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// 📍 Routes API
app.use('/api/soumissions', soumissionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

// 🚫 Route 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée' 
  });
});

// ⚠️ Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err);
  
  // Erreur CORS
  if (err.message === 'Non autorisé par CORS') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - Origine non autorisée'
    });
  }
  
  // Erreur de validation
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Format JSON invalide'
    });
  }
  
  // Erreur générique
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Une erreur est survenue'
  });
});

// 🗄️ Initialisation de la base de données et démarrage du serveur
initDatabase()
  .then(() => {
    console.log('✅ Base de données initialisée');
    
    app.listen(PORT, () => {
      console.log('');
      console.log('🎉 ════════════════════════════════════════════');
      console.log(`   Collecte Communautaire API`);
      console.log('   ════════════════════════════════════════════');
      console.log(`   🌍 Serveur démarré sur le port ${PORT}`);
      console.log(`   📡 URL: http://localhost:${PORT}`);
      console.log(`   🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`   🌐 CORS: ${allowedOrigins.join(', ')}`);
      console.log(`   🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log('   ════════════════════════════════════════════');
      console.log('');
    });
  })
  .catch((err) => {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', err);
    process.exit(1);
  });

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Arrêt du serveur...');
  process.exit(0);
});
