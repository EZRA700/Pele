# Backend - Collecte Communautaire API

API REST pour le système de collecte communautaire en Côte d'Ivoire.

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer l'environnement**
```bash
# Copier le fichier .env.example en .env
cp .env.example .env
```

3. **Générer une clé secrète admin**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. **Éditer le fichier .env**
```env
ADMIN_SECRET_KEY=<votre-clé-générée>
ALLOWED_ORIGINS=https://votre-site.netlify.app
PORT=3003
DB_PATH=./database/collecte.db
NODE_ENV=production
```

5. **Démarrer le serveur**
```bash
# Développement (avec nodemon)
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Routes Publiques

#### Créer une soumission
```http
POST /api/soumissions
Content-Type: application/json

{
  "nom_complet": "John Doe",
  "telephone": "07 12 34 56 78",
  "email": "john@example.com",
  "quartier": "Cocody",
  "type_contribution": "Cotisation mensuelle",
  "description": "Contribution de janvier",
  "montant": 5000,
  "moyen_paiement": "wave"
}
```

#### Consulter une soumission
```http
GET /api/soumissions/REF-20260215-0001
```

#### Ajouter le code de transaction
```http
PATCH /api/soumissions/REF-20260215-0001/reference-operateur
Content-Type: application/json

{
  "reference_operateur": "WV123456789"
}
```

### Routes Admin (Requièrent `x-admin-key`)

#### Lister les soumissions
```http
GET /api/admin/soumissions?statut=en_attente&limit=50&offset=0
x-admin-key: <votre-clé-admin>
```

#### Détail d'une soumission
```http
GET /api/admin/soumissions/1
x-admin-key: <votre-clé-admin>
```

#### Valider/Rejeter une soumission
```http
PUT /api/admin/soumissions/1/statut
x-admin-key: <votre-clé-admin>
Content-Type: application/json

{
  "statut": "confirme",
  "note_admin": "Paiement vérifié"
}
```

#### Annuler une soumission
```http
DELETE /api/admin/soumissions/1
x-admin-key: <votre-clé-admin>
```

#### Export CSV
```http
GET /api/admin/export/csv?statut=confirme
x-admin-key: <votre-clé-admin>
```

#### Statistiques globales
```http
GET /api/stats
x-admin-key: <votre-clé-admin>
```

#### Statistiques par période
```http
GET /api/stats/periode/jour
GET /api/stats/periode/semaine
GET /api/stats/periode/mois
x-admin-key: <votre-clé-admin>
```

## 🗄️ Structure de la Base de Données

### Table `soumissions`
```sql
- id (INTEGER PRIMARY KEY)
- reference (TEXT UNIQUE) -- REF-YYYYMMDD-XXXX
- nom_complet, telephone, email, quartier (TEXT)
- type_contribution, description (TEXT)
- montant (REAL)
- moyen_paiement (wave, orange_money, mtn_money, moov_money)
- statut (en_attente, confirme, rejete, annule)
- reference_operateur (TEXT) -- Code transaction
- date_soumission, date_confirmation (TEXT/ISO)
- ip_adresse, user_agent (TEXT)
- note_admin (TEXT)
```

### Table `logs_admin`
```sql
- id, action, soumission_id, details (JSON), date_action
```

## 🔒 Sécurité

- **Authentification Admin**: Header `x-admin-key`
- **CORS**: Origines configurables via `ALLOWED_ORIGINS`
- **Rate Limiting**: 
  - 150 soumissions/heure/IP
  - 100 requêtes/15min/IP
- **Validation**: express-validator sur toutes les entrées
- **SQL Injection**: Prepared statements (parameterized queries)

## 🚢 Déploiement sur Render.com

1. Créer un nouveau Web Service
2. Connecter le repository GitHub
3. Configurer:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Ajouter les variables d'environnement:
   - `ADMIN_SECRET_KEY`
   - `ALLOWED_ORIGINS`
   - `NODE_ENV=production`
5. Déployer

## 📝 Logs

Le serveur affiche des logs clairs avec emojis:
- ✅ Succès
- ❌ Erreurs
- 🎉 Démarrage
- 📡 Requêtes (en développement)

## 🧪 Test

```bash
# Health check
curl http://localhost:3003/health

# Créer une soumission
curl -X POST http://localhost:3003/api/soumissions \
  -H "Content-Type: application/json" \
  -d '{
    "nom_complet": "Test User",
    "telephone": "0712345678",
    "type_contribution": "Test",
    "montant": 1000,
    "moyen_paiement": "wave"
  }'
```

## 📄 Licence

MIT
