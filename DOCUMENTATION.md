# 📚 Documentation - Collecte Communautaire

## Table des matières

1. [Guide Utilisateur](#guide-utilisateur)
2. [Guide Administrateur](#guide-administrateur)
3. [Guide Système](#guide-système)

---

# 👤 GUIDE UTILISATEUR

## 📝 Comment s'inscrire et payer

### Étape 1 : Accéder au formulaire d'inscription

1. Rendez-vous sur la page d'accueil de l'application
2. Vous verrez le formulaire d'inscription avec un design moderne

### Étape 2 : Remplir le formulaire

Remplissez **tous les champs obligatoires** (marqués d'une étoile rouge *) :

#### Informations personnelles

- **Nom** : Votre nom de famille (2-50 caractères)
- **Prénoms** : Vos prénoms complets (2-100 caractères)
- **Âge** : Votre âge (entre 1 et 120 ans)
- **Taille de tee-shirt** : Sélectionnez votre taille parmi :
  - XS - Extra Small
  - S - Small
  - M - Medium
  - L - Large
  - XL - Extra Large
  - XXL - 2X Large

#### Coordonnées

- **Numéro de téléphone** : Votre numéro de téléphone (8-20 caractères)
- **Numéro de paiement Wave** : Le numéro Wave que vous utiliserez pour le paiement

#### Montant de la contribution

- **Montant** : Entrez le montant que vous souhaitez contribuer (minimum 100 FCFA)
- Vous pouvez utiliser les montants suggérés affichés sous le champ pour faciliter la saisie

### Étape 3 : Valider le formulaire

1. Cliquez sur le bouton **"Valider mon inscription"**
2. Le système vérifie automatiquement que tous les champs sont correctement remplis
3. Si des erreurs sont détectées, elles s'affichent en rouge sous les champs concernés

### Étape 4 : Procéder au paiement Wave

Une fois le formulaire validé :

1. **Votre référence d'inscription** s'affiche (format : REF-AAAAMMJJ-XXXX)
   - ⚠️ **Conservez précieusement cette référence** pour le suivi de votre paiement

2. Le **montant exact à payer** est affiché clairement

3. **Cliquez sur le logo Wave** ou le bouton "Ouvrir Wave pour payer"
   - Votre application Wave s'ouvrira automatiquement
   - Si vous êtes sur ordinateur, vous serez redirigé vers la page de paiement Wave

4. **Suivez les instructions Wave** pour compléter le paiement :
   - Utilisez le numéro Wave que vous avez renseigné dans le formulaire
   - Payez le montant exact affiché
   - Confirmez la transaction

### Étape 5 : Confirmation

- Votre inscription sera validée par l'administrateur sous **24 heures**
- Conservez votre référence pour toute réclamation ou suivi
- En cas de problème, contactez l'administrateur avec votre référence

---

## ❓ Questions fréquentes (FAQ)

**Q : Puis-je modifier mes informations après validation ?**
R : Non, une fois le formulaire validé, les informations ne peuvent pas être modifiées. Vérifiez bien vos données avant de valider.

**Q : Que faire si j'ai perdu ma référence ?**
R : Contactez l'administrateur avec votre nom complet et votre numéro de téléphone pour retrouver votre référence.

**Q : Combien de temps prend la confirmation ?**
R : L'administrateur confirme les paiements sous 24 heures après vérification.

**Q : Puis-je payer avec un autre moyen que Wave ?**
R : Non, seul le paiement Wave est accepté pour cette collecte.

**Q : Le montant minimum est-il obligatoire ?**
R : Oui, le montant minimum est de 100 FCFA.

---

# 🔐 GUIDE ADMINISTRATEUR

## 🚪 Accès au Dashboard

### Se connecter

1. Accédez à la page : `https://votre-domaine.com/admin/index.html`
2. Le dashboard est protégé par une clé API (x-admin-key)
3. La clé API actuelle : `39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3`

## 📊 Vue d'ensemble du Dashboard

Le dashboard administrateur est divisé en plusieurs sections :

### 1. Tableau de bord

Affiche les statistiques globales en temps réel :

- **Total des inscriptions** : Nombre total de soumissions
- **Total collecté** : Montant total des inscriptions confirmées (en FCFA)
- **Montant moyen** : Montant moyen par inscription confirmée
- **Dernières inscriptions** : Les 5 dernières inscriptions reçues

**Graphiques disponibles :**
- Répartition par statut (En attente, Confirmé, Rejeté, Annulé)
- Répartition par taille de tee-shirt (XS, S, M, L, XL, XXL)

### 2. Liste des inscriptions

Affiche toutes les inscriptions dans un tableau interactif avec :

**Colonnes :**
- Référence
- Nom
- Prénoms
- Âge
- Taille (tee-shirt)
- Téléphone
- Montant
- Code Transaction
- Statut
- Date
- Actions

**Fonctionnalités du tableau :**
- Recherche en temps réel (cherchez par n'importe quel champ)
- Tri par colonne (cliquez sur les en-têtes)
- Pagination (25 résultats par page par défaut)
- Export des données visibles

### 3. Filtres

Filtrez les inscriptions par :

- **Statut** :
  - Tous
  - En attente
  - Confirmé
  - Rejeté
  - Annulé
  
- **Moyen de paiement** :
  - Tous
  - Wave

### 4. Actions sur les inscriptions

Pour chaque inscription, vous pouvez :

#### 👁️ Voir les détails
- Cliquez sur l'icône **œil** pour afficher tous les détails
- Informations affichées :
  - Référence et statut
  - Informations personnelles (nom, prénoms, âge, taille, téléphone, numéro Wave)
  - Montant et moyen de paiement
  - Code de transaction (si renseigné)
  - Dates (soumission et confirmation)
  - Note administrateur
  - Informations techniques (IP, User Agent)

#### ✅ Valider une inscription
1. Cliquez sur l'icône **check** (vert)
2. Une fenêtre s'ouvre pour confirmation
3. Ajoutez une note (optionnel) : ex. "Paiement vérifié Wave - Code TX12345"
4. Cliquez sur **"Valider"**
5. Le statut passe à **"Confirmé"**
6. La date de confirmation est enregistrée

#### ❌ Rejeter une inscription
1. Cliquez sur l'icône **X** (rouge)
2. Une fenêtre s'ouvre pour confirmation
3. Ajoutez une note expliquant le rejet : ex. "Montant incorrect", "Paiement non reçu"
4. Cliquez sur **"Rejeter"**
5. Le statut passe à **"Rejeté"**

#### 🗑️ Annuler une inscription
1. Cliquez sur l'icône **poubelle** (gris)
2. Confirmez l'annulation
3. Le statut passe à **"Annulé"**
4. ⚠️ Cette action est irréversible

## 📈 Statistiques détaillées

Accédez à la section **"Statistiques"** pour voir :

### Sélecteur de période
- Aujourd'hui
- Cette semaine
- Ce mois

### Graphiques disponibles
1. **Évolution des contributions** : Graphique d'évolution avec :
   - Nombre de soumissions par jour
   - Montant collecté par jour

2. **Top contributeurs** : Liste des plus gros contributeurs avec :
   - Nom et téléphone
   - Montant total contribué
   - Nombre de contributions

3. **Répartition par taille** : Détail des inscriptions par taille de tee-shirt avec montants

## 💾 Export CSV

### Exporter toutes les inscriptions

1. Cliquez sur le bouton **"Exporter CSV"**
2. Le fichier est téléchargé automatiquement
3. Nom du fichier : `soumissions_AAAA-MM-JJ.csv`

### Exporter avec filtres

1. Appliquez les filtres souhaités (statut, moyen de paiement)
2. Cliquez sur **"Exporter CSV"**
3. Seules les inscriptions filtrées sont exportées

### Colonnes exportées
- ID
- Référence
- Nom
- Prénoms
- Âge
- Taille Tee-shirt
- Téléphone
- Numéro Paiement
- Montant (FCFA)
- Moyen Paiement
- Statut
- Code Transaction
- Date Soumission
- Date Confirmation
- Note Admin

## 🔄 Actualisation des données

- Cliquez sur le bouton **"Actualiser"** en haut à droite pour rafraîchir les données
- Les données se rafraîchissent automatiquement si configuré dans `config.js`

---

## ⚠️ Bonnes pratiques pour les administrateurs

### Validation des paiements

1. **Vérifiez toujours** le paiement dans votre compte Wave avant de valider
2. **Notez le code de transaction Wave** dans la note admin
3. **Validez rapidement** les paiements corrects (sous 24h)
4. **Rejetez avec explication** les paiements non conformes

### Gestion des rejets

- Soyez précis dans la note de rejet
- Indiquez la raison : "Montant insuffisant", "Aucun paiement reçu", etc.
- Ne rejetez pas sans vérification

### Sécurité

- Ne partagez **JAMAIS** la clé API admin avec les utilisateurs
- Déconnectez-vous après chaque session
- Changez régulièrement la clé API (voir section Système)

### Communication

- Informez rapidement les utilisateurs en cas de problème
- Utilisez la référence pour identifier les inscriptions
- Gardez une trace des validations/rejets

---

# ⚙️ GUIDE SYSTÈME

## 🏗️ Architecture de l'application

### Stack technique

**Backend :**
- Node.js v18+
- Express.js 4.18
- SQLite3 5.1 (base de données)
- Helmet (sécurité)
- CORS (gestion des origines)
- Express Validator (validation)
- Express Rate Limit (limitation de requêtes)

**Frontend :**
- HTML5, CSS3, JavaScript Vanilla
- Bootstrap 5.3
- Chart.js 4.4 (graphiques)
- DataTables 1.13 (tableaux)
- Google Fonts (Inter)

**Structure des dossiers :**
```
Pele/
├── backend/
│   ├── server.js                 # Point d'entrée serveur
│   ├── models/
│   │   └── database.js           # Schéma et connexion DB
│   ├── middleware/
│   │   └── validation.js         # Validations Express
│   ├── controllers/
│   │   ├── soumissionController.js    # API publique
│   │   ├── adminController.js         # API admin
│   │   └── statsController.js         # Statistiques
│   ├── utils/
│   │   └── helpers.js            # Fonctions utilitaires
│   └── data/
│       └── soumissions.db        # Base de données SQLite
├── frontend/
│   ├── index.html                # Page publique
│   ├── admin/
│   │   └── index.html            # Dashboard admin
│   └── assets/
│       ├── css/
│       │   └── style.css         # Styles personnalisés
│       └── js/
│           ├── config.js         # Configuration globale
│           ├── app.js            # Logique publique
│           └── admin.js          # Logique admin
└── DOCUMENTATION.md              # Ce fichier
```

---

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+ installé
- Python 3.7+ installé (pour serveur HTTP frontend)
- Git (optionnel)

### Installation

1. **Cloner ou télécharger le projet**
```bash
cd d:\Combilo\Pele
```

2. **Installer les dépendances backend**
```bash
cd backend
npm install
```

Dépendances installées :
- express
- express-validator
- express-rate-limit
- sqlite3
- helmet
- cors
- dotenv

3. **Vérifier la structure**
```bash
# S'assurer que tous les dossiers existent
backend/
backend/data/
frontend/
frontend/admin/
frontend/assets/
```

### Démarrage en développement

**Option 1 : PowerShell (Windows)**

```powershell
# Terminal 1 - Backend
cd d:\Combilo\Pele\backend
node server.js

# Terminal 2 - Frontend
cd d:\Combilo\Pele\frontend
python -m http.server 5500
```

**Option 2 : Commande unique (Windows)**

```powershell
# Arrêter les anciens processus
taskkill /F /IM node.exe 2>$null
taskkill /F /IM python.exe 2>$null

# Démarrer en arrière-plan
Start-Process node -ArgumentList "server.js" -WorkingDirectory "d:\Combilo\Pele\backend" -WindowStyle Hidden
Start-Process python -ArgumentList "-m", "http.server", "5500" -WorkingDirectory "d:\Combilo\Pele\frontend" -WindowStyle Hidden
```

**Vérification :**
```powershell
# Vérifier que les ports sont actifs
Get-NetTCPConnection -LocalPort 3003, 5500 -ErrorAction SilentlyContinue
```

**URLs de test :**
- Backend API : http://localhost:3003
- Health check : http://localhost:3003/health
- Frontend public : http://localhost:5500
- Dashboard admin : http://localhost:5500/admin/index.html

---

## 🗄️ Base de données

### Schéma SQLite

Fichier : `backend/data/soumissions.db`

**Table : soumissions**

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | ID unique |
| reference | TEXT | UNIQUE, NOT NULL | Réf unique (REF-AAAAMMJJ-XXXX) |
| nom | TEXT | NOT NULL | Nom de famille |
| prenoms | TEXT | NOT NULL | Prénoms |
| age | INTEGER | NOT NULL, CHECK (1-120) | Âge |
| taille_tee_shirt | TEXT | NOT NULL, CHECK (XS/S/M/L/XL/XXL) | Taille |
| telephone | TEXT | NOT NULL | Numéro de téléphone |
| numero_paiement | TEXT | NOT NULL | Numéro Wave |
| montant | INTEGER | NOT NULL, CHECK (≥100) | Montant en FCFA |
| moyen_paiement | TEXT | DEFAULT 'wave' | Toujours 'wave' |
| statut | TEXT | DEFAULT 'en_attente' | en_attente/confirme/rejete/annule |
| reference_operateur | TEXT | NULL | Code transaction Wave |
| date_soumission | TEXT | DEFAULT CURRENT_TIMESTAMP | Date d'inscription |
| date_confirmation | TEXT | NULL | Date de validation |
| note_admin | TEXT | NULL | Note de l'admin |
| ip_adresse | TEXT | NULL | IP de l'utilisateur |
| user_agent | TEXT | NULL | Navigateur de l'utilisateur |

### Commandes SQLite utiles

```bash
# Accéder à la base de données
sqlite3 backend/data/soumissions.db

# Lister les tables
.tables

# Voir le schéma
.schema soumissions

# Requêtes utiles
SELECT COUNT(*) FROM soumissions;
SELECT COUNT(*) FROM soumissions WHERE statut = 'confirme';
SELECT SUM(montant) FROM soumissions WHERE statut = 'confirme';
SELECT taille_tee_shirt, COUNT(*) FROM soumissions GROUP BY taille_tee_shirt;

# Quitter
.quit
```

### Sauvegarde de la base de données

```powershell
# Windows PowerShell
$date = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item "backend\data\soumissions.db" "backend\data\backups\soumissions_$date.db"
```

```bash
# Linux/Mac
DATE=$(date +%Y%m%d-%H%M%S)
cp backend/data/soumissions.db backend/data/backups/soumissions_$DATE.db
```

**Fréquence recommandée :** Quotidienne ou avant toute manipulation critique

---

## 🔐 Sécurité

### Clé API Administrateur

**Fichier :** `backend/server.js`

**Clé actuelle :**
```
39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3
```

### Changer la clé API

1. **Générer une nouvelle clé**
```javascript
const crypto = require('crypto');
const newKey = crypto.randomBytes(32).toString('hex');
console.log(newKey);
```

2. **Mettre à jour dans le code**
```javascript
// backend/server.js (ligne ~27)
const ADMIN_KEY = 'NOUVELLE_CLE_ICI';
```

3. **Mettre à jour dans le frontend**
```javascript
// frontend/assets/js/config.js (ligne ~24)
ADMIN_KEY: 'NOUVELLE_CLE_ICI'
```

4. **Redémarrer le serveur backend**

### CORS (Cross-Origin)

**Origines autorisées :**
```javascript
// backend/server.js (ligne ~41)
const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://votre-domaine.com'
];
```

Pour ajouter une origine :
1. Ajoutez l'URL dans le tableau `allowedOrigins`
2. Redémarrez le serveur

### Rate Limiting

**Configuration actuelle :**
- Limite : 100 requêtes par IP toutes les 15 minutes
- Fichier : `backend/server.js` (ligne ~60-66)

Pour modifier :
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Durée de la fenêtre
  max: 100,                   // Nombre max de requêtes
  message: 'Trop de requêtes...'
});
```

---

## 📡 API Endpoints

### Endpoints publics

#### 1. Health Check
```http
GET /health
```
Réponse :
```json
{
  "status": "OK",
  "message": "API Collecte Communautaire est opérationnelle",
  "timestamp": "2026-02-15T12:00:00.000Z"
}
```

#### 2. Créer une inscription
```http
POST /api/soumissions
Content-Type: application/json

{
  "nom": "Touré",
  "prenoms": "Fatou",
  "age": 28,
  "taille_tee_shirt": "M",
  "telephone": "0712345678",
  "numero_paiement": "0712345678",
  "montant": 10000
}
```

Réponse :
```json
{
  "success": true,
  "message": "Soumission créée avec succès",
  "data": {
    "id": 1,
    "reference": "REF-20260215-1234",
    ...
  }
}
```

#### 3. Récupérer une inscription par référence
```http
GET /api/soumissions/REF-20260215-1234
```

#### 4. Ajouter un code de transaction
```http
POST /api/soumissions/REF-20260215-1234/transaction
Content-Type: application/json

{
  "reference_operateur": "WAVE123456"
}
```

### Endpoints admin (nécessitent x-admin-key)

#### 1. Statistiques globales
```http
GET /api/stats
x-admin-key: 39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3
```

#### 2. Statistiques par période
```http
GET /api/stats/periode/:periode
# periode = jour | semaine | mois
x-admin-key: ...
```

#### 3. Liste des inscriptions (paginée)
```http
GET /api/admin/soumissions?page=1&limit=10&statut=confirme&moyen_paiement=wave
x-admin-key: ...
```

Paramètres :
- `page` : Numéro de page (défaut: 1)
- `limit` : Résultats par page (défaut: 50)
- `statut` : en_attente | confirme | rejete | annule
- `moyen_paiement` : wave

#### 4. Détails d'une inscription
```http
GET /api/admin/soumissions/:id
x-admin-key: ...
```

#### 5. Changer le statut
```http
PUT /api/admin/soumissions/:id/statut
x-admin-key: ...
Content-Type: application/json

{
  "statut": "confirme",
  "note_admin": "Paiement vérifié"
}
```

#### 6. Annuler une inscription
```http
DELETE /api/admin/soumissions/:id
x-admin-key: ...
```

#### 7. Export CSV
```http
GET /api/admin/export/csv?statut=confirme
x-admin-key: ...
```

---

## 🌐 Configuration Frontend

### Fichier config.js

**Emplacement :** `frontend/assets/js/config.js`

```javascript
const CONFIG = {
  // URL de l'API backend
  API_URL: 'http://localhost:3003',  // À changer en production
  
  // Clé admin
  ADMIN_KEY: '39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3',
  
  // URL Wave
  WAVE_PAYMENT_URL: 'https://pay.wave.com/m/M_ci_S/c/',
  
  // Montants suggérés pour le formulaire
  MONTANTS_SUGGERES: [1000, 2500, 5000, 10000, 15000, 20000],
  
  // Durée affichage toast
  TOAST_DURATION: 5000,
  
  // Auto-refresh dashboard (0 = désactivé)
  AUTO_REFRESH_INTERVAL: 0,
  
  // Debug mode
  DEBUG: true
};
```

### Modification pour la production

```javascript
const CONFIG = {
  API_URL: 'https://api.votre-domaine.com',  // URL prod
  ADMIN_KEY: 'NOUVELLE_CLE_SECURISEE',
  WAVE_PAYMENT_URL: 'https://pay.wave.com/m/VOTRE_ID/c/',
  MONTANTS_SUGGERES: [1000, 2500, 5000, 10000, 15000, 20000],
  TOAST_DURATION: 5000,
  AUTO_REFRESH_INTERVAL: 300000,  // 5 minutes
  DEBUG: false
};
```

---

## 🚢 Déploiement en Production

### Option 1 : Hébergement classique (VPS, Serveur dédié)

#### Backend

1. **Installer Node.js sur le serveur**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Transférer les fichiers backend**
```bash
scp -r backend/ user@serveur:/var/www/collecte/
```

3. **Installer les dépendances**
```bash
cd /var/www/collecte/backend
npm install --production
```

4. **Utiliser PM2 pour la gestion du processus**
```bash
# Installer PM2
sudo npm install -g pm2

# Démarrer l'application
pm2 start server.js --name "collecte-api"

# Démarrage automatique au boot
pm2 startup
pm2 save

# Monitoring
pm2 status
pm2 logs collecte-api
```

5. **Configurer Nginx comme reverse proxy**
```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

6. **SSL avec Let's Encrypt**
```bash
sudo certbot --nginx -d api.votre-domaine.com
```

#### Frontend

1. **Transférer les fichiers frontend**
```bash
scp -r frontend/ user@serveur:/var/www/collecte/
```

2. **Configurer Nginx**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/collecte/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

3. **SSL**
```bash
sudo certbot --nginx -d votre-domaine.com
```

### Option 2 : Netlify (Frontend) + Railway/Render (Backend)

#### Backend sur Railway

1. Créer un compte sur https://railway.app
2. Créer un nouveau projet
3. Connecter le dépôt Git ou uploader le dossier `backend`
4. Railway détecte automatiquement Node.js
5. Définir les variables d'environnement :
   - `PORT`: 3003
   - `NODE_ENV`: production
6. Déployer
7. Récupérer l'URL publique (ex: https://collecte-api.railway.app)

#### Frontend sur Netlify

1. Créer un compte sur https://netlify.com
2. Nouveau site depuis le dépôt Git ou drag & drop du dossier `frontend`
3. Configuration :
   - Build command: (vide)
   - Publish directory: `.`
4. Avant le déploiement, **modifier `config.js`** :
   ```javascript
   API_URL: 'https://collecte-api.railway.app'
   ```
5. Déployer
6. Le site est accessible via une URL Netlify (ex: https://collecte-communautaire.netlify.app)

### Option 3 : Heroku

#### Backend

1. Installer Heroku CLI
2. Se connecter : `heroku login`
3. Créer l'app : `heroku create collecte-api`
4. Créer un `Procfile` dans `backend/` :
   ```
   web: node server.js
   ```
5. Déployer :
   ```bash
   cd backend
   git init
   heroku git:remote -a collecte-api
   git add .
   git commit -m "Deploy"
   git push heroku main
   ```
6. Définir les variables d'environnement :
   ```bash
   heroku config:set NODE_ENV=production
   ```

---

## 🔧 Maintenance

### Logs

**Backend (PM2)**
```bash
pm2 logs collecte-api
pm2 logs collecte-api --lines 100
pm2 logs collecte-api --err
```

**Backend (sans PM2)**
```bash
# Rediriger les logs vers un fichier
node server.js > logs/app.log 2>&1
```

### Monitoring

**Surveillance des processus**
```bash
pm2 status
pm2 monit
```

**Surveillance de la base de données**
```bash
# Taille de la DB
ls -lh backend/data/soumissions.db

# Nombre d'inscriptions
sqlite3 backend/data/soumissions.db "SELECT COUNT(*) FROM soumissions;"
```

**Surveillance du serveur**
```bash
# Utilisation CPU/RAM
htop

# Espace disque
df -h

# Processus Node actifs
ps aux | grep node
```

### Mise à jour de l'application

1. **Sauvegarder la base de données**
```bash
cp backend/data/soumissions.db backend/data/soumissions_backup_$(date +%Y%m%d).db
```

2. **Arrêter l'application**
```bash
pm2 stop collecte-api
```

3. **Mettre à jour le code**
```bash
git pull
# ou
scp -r nouveau-code/ serveur:/var/www/collecte/
```

4. **Installer les nouvelles dépendances (si nécessaire)**
```bash
cd backend
npm install
```

5. **Redémarrer l'application**
```bash
pm2 restart collecte-api
```

6. **Vérifier**
```bash
pm2 logs collecte-api
curl http://localhost:3003/health
```

### Nettoyage

**Nettoyer les anciennes inscriptions (optionnel)**
```sql
-- Supprimer les inscriptions annulées de plus de 6 mois
DELETE FROM soumissions 
WHERE statut = 'annule' 
AND date_soumission < date('now', '-6 months');

-- Optimiser la base de données
VACUUM;
```

**Nettoyer les logs**
```bash
pm2 flush collecte-api
```

---

## 📊 Tests et Validation

### Tests manuels

**Backend**
```bash
# Health check
curl http://localhost:3003/health

# Créer une inscription
curl -X POST http://localhost:3003/api/soumissions \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenoms": "Utilisateur",
    "age": 25,
    "taille_tee_shirt": "M",
    "telephone": "0712345678",
    "numero_paiement": "0712345678",
    "montant": 5000
  }'

# Récupérer les stats (admin)
curl http://localhost:3003/api/stats \
  -H "x-admin-key: 39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3"
```

**Frontend**
1. Ouvrir http://localhost:5500
2. Remplir et soumettre le formulaire
3. Vérifier l'affichage de la référence
4. Tester le lien Wave

**Dashboard Admin**
1. Ouvrir http://localhost:5500/admin/index.html
2. Vérifier l'affichage des statistiques
3. Tester les filtres
4. Valider/Rejeter une inscription
5. Exporter le CSV

### Vérifications de sécurité

- [ ] Clé API changée de la valeur par défaut
- [ ] CORS configuré avec les bonnes origines
- [ ] HTTPS activé en production
- [ ] Rate limiting activé
- [ ] Validations backend fonctionnelles
- [ ] Base de données sauvegardée régulièrement

---

## 🆘 Dépannage

### Le backend ne démarre pas

**Erreur : Port 3003 déjà utilisé**
```bash
# Windows
netstat -ano | findstr :3003
taskkill /PID <PID> /F

# Linux
lsof -i :3003
kill -9 <PID>
```

**Erreur : Module manquant**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Le frontend ne se connecte pas au backend

1. Vérifier que le backend est démarré : `curl http://localhost:3003/health`
2. Vérifier `config.js` : `API_URL` doit pointer vers le backend
3. Vérifier la console navigateur (F12) pour les erreurs CORS
4. Vérifier que l'origine frontend est dans `allowedOrigins` (backend)

### La base de données est corrompue

```bash
# Vérifier l'intégrité
sqlite3 backend/data/soumissions.db "PRAGMA integrity_check;"

# Si corrupted, restaurer depuis backup
cp backend/data/backups/soumissions_XXXXXX.db backend/data/soumissions.db

# Si pas de backup, recréer
rm backend/data/soumissions.db
# Redémarrer le serveur - il recrée la DB automatiquement
```

### Les statistiques ne s'affichent pas

1. Vérifier la console navigateur (F12)
2. Vérifier que la clé admin est correcte
3. Vérifier que `stats_par_taille` existe dans la réponse API :
   ```bash
   curl http://localhost:3003/api/stats \
     -H "x-admin-key: VOTRE_CLE"
   ```

### Le CSV exporté est vide

1. Vérifier qu'il y a des inscriptions dans la DB
2. Vérifier les filtres appliqués
3. Tester l'endpoint directement :
   ```bash
   curl http://localhost:3003/api/admin/export/csv \
     -H "x-admin-key: VOTRE_CLE" > test.csv
   ```

---

## 📞 Support

### Informations système

Pour toute demande de support, fournir :

```bash
# Version Node.js
node --version

# Version npm
npm --version

# Système d'exploitation
uname -a  # Linux/Mac
systeminfo  # Windows

# Taille de la DB
ls -lh backend/data/soumissions.db

# Nombre d'inscriptions
sqlite3 backend/data/soumissions.db "SELECT COUNT(*) FROM soumissions;"
```

### Logs utiles

```bash
# Logs backend (PM2)
pm2 logs collecte-api --lines 50

# Logs Nginx (si utilisé)
tail -n 50 /var/log/nginx/error.log
tail -n 50 /var/log/nginx/access.log
```

---

## 📝 Notes de version

**Version actuelle : 1.0.0**

### Fonctionnalités
- Formulaire d'inscription avec 6 champs (nom, prénoms, âge, taille, téléphone, numéro Wave)
- Paiement Wave uniquement
- Dashboard admin complet
- Statistiques en temps réel
- Graphiques (statut, tailles de tee-shirts)
- Export CSV
- Responsive design
- Animations modernes

### Champs de la base de données
- Structure complète avec nouveaux champs (age, taille_tee_shirt, numero_paiement)
- Suppression des anciens champs (nom_complet, email, quartier, type_contribution, description)

### Configuration
- Clé API admin : à changer en production
- URL Wave : configurable dans config.js
- CORS : origines configurables
- Rate limiting : 100 req/15min

---

**🎉 Fin de la documentation**

Pour toute question ou problème non couvert par cette documentation, consultez le code source ou contactez l'équipe de développement.

---

*Dernière mise à jour : 15/02/2026*
