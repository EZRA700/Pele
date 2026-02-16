# 💰 Collecte Communautaire - Côte d'Ivoire

Système complet de collecte d'argent communautaire avec paiement Mobile Money ivoirien (Wave, Orange Money, MTN Money, Moov Money).

**Parfait pour:** Associations, églises, tontines, groupements communautaires

---

## 🎯 Fonctionnalités

### 👥 Pour les Contributeurs
- ✅ Formulaire de soumission simple et intuitif
- ✅ Choix parmi 4 moyens de paiement Mobile Money
- ✅ Référence unique pour suivre sa contribution
- ✅ Instructions de paiement claires
- ✅ Confirmation par code de transaction
- ✅ Interface mobile-first responsive

### 👨‍💼 Pour les Administrateurs
- ✅ Dashboard avec statistiques en temps réel
- ✅ Gestion des soumissions (valider/rejeter/annuler)
- ✅ Graphiques de répartition (statuts, moyens de paiement)
- ✅ Export CSV pour comptabilité
- ✅ Filtres et recherche avancée
- ✅ Top contributeurs et analyse par période
- ✅ Authentification sécurisée par clé

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   Frontend      │   API   │     Backend      │   SQL   │    SQLite DB     │
│   (Netlify)     │ ◄─────► │  (Render.com)    │ ◄─────► │   (Local file)   │
│                 │  REST   │                  │         │                  │
│ - HTML/CSS/JS   │         │ - Node.js        │         │ - soumissions    │
│ - Bootstrap 5   │         │ - Express.js     │         │ - logs_admin     │
│ - Chart.js      │         │ - SQLite3        │         │                  │
└─────────────────┘         └──────────────────┘         └──────────────────┘
```

### Stack Technique

**Frontend:**
- HTML5, CSS3, JavaScript Vanilla
- Bootstrap 5, Bootstrap Icons
- Chart.js (graphiques), DataTables (tableaux)
- Hébergement: Netlify (gratuit)

**Backend:**
- Node.js 18+ avec Express.js
- SQLite3 (base de données locale)
- Sécurité: helmet, cors, express-validator, rate-limit
- Hébergement: Render.com (gratuit)

---

## 🚀 Installation Rapide

### 1️⃣ Backend

```bash
cd backend
npm install
cp .env.example .env

# Générer une clé secrète
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Éditer .env avec votre clé
nano .env

# Démarrer
npm run dev
```

Le serveur démarre sur `http://localhost:3003`

### 2️⃣ Frontend

```bash
cd frontend

# Éditer la configuration
nano assets/js/config.js
# Modifier API_URL et ADMIN_KEY

# Démarrer un serveur local
python -m http.server 5500
# OU
npx http-server -p 5500
```

Le site s'ouvre sur `http://localhost:5500`

---

## ⚙️ Configuration

### Backend (`backend/.env`)

```env
ADMIN_SECRET_KEY=<votre-cle-32-caracteres-minimum>
PORT=3003
ALLOWED_ORIGINS=http://localhost:5500,https://votre-site.netlify.app
DB_PATH=./database/collecte.db
NODE_ENV=development
```

### Frontend (`frontend/assets/js/config.js`)

```javascript
const CONFIG = {
    API_URL: 'http://localhost:3003/api',  // URL du backend
    ADMIN_KEY: '<même-clé-que-backend>',
    PAYMENT_NUMBERS: {
        wave: '0712345678',           // VOS numéros Mobile Money
        orange_money: '0712345678',
        mtn_money: '0512345678',
        moov_money: '0112345678'
    },
    // ...
};
```

---

## 📡 API Endpoints

### Routes Publiques

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/soumissions` | Créer une soumission |
| `GET` | `/api/soumissions/:reference` | Consulter par référence |
| `PATCH` | `/api/soumissions/:reference/reference-operateur` | Ajouter code transaction |

### Routes Admin (Header: `x-admin-key`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/admin/soumissions` | Liste avec filtres |
| `GET` | `/api/admin/soumissions/:id` | Détail |
| `PUT` | `/api/admin/soumissions/:id/statut` | Valider/Rejeter |
| `DELETE` | `/api/admin/soumissions/:id` | Annuler |
| `GET` | `/api/admin/export/csv` | Export CSV |
| `GET` | `/api/stats` | Stats globales |
| `GET` | `/api/stats/periode/:periode` | Stats jour/semaine/mois |

---

## 🔄 Workflow Utilisateur

```
1. Contributeur remplit le formulaire (index.html)
   ↓
2. Soumission envoyée au backend → Référence générée
   ↓
3. Redirection vers confirmation.html
   ↓
4. Instructions de paiement affichées selon le moyen choisi
   ↓
5. Contributeur effectue le paiement via son app Mobile Money
   ↓
6. Contributeur saisit le code de transaction reçu
   ↓
7. Code envoyé au backend
   ↓
8. Admin consulte le dashboard et valide le paiement
   ↓
9. Statut passe de "en_attente" à "confirme"
```

---

## 🗄️ Base de Données

### Table `soumissions`

```sql
- id (INTEGER PRIMARY KEY)
- reference (TEXT UNIQUE) -- REF-YYYYMMDD-XXXX
- nom_complet, telephone, email, quartier
- type_contribution, description
- montant (REAL)
- moyen_paiement (wave, orange_money, mtn_money, moov_money)
- statut (en_attente, confirme, rejete, annule)
- reference_operateur -- Code transaction
- date_soumission, date_confirmation
- ip_adresse, user_agent
- note_admin
```

### Table `logs_admin`

```sql
- id, action, soumission_id, details (JSON), date_action
```

---

## 🚢 Déploiement

### Backend sur Render.com

1. Créer un compte sur [Render.com](https://render.com)
2. Nouveau Web Service → Connect GitHub repo
3. Configuration:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Variables d'environnement:
   ```
   ADMIN_SECRET_KEY=<votre-cle>
   ALLOWED_ORIGINS=https://votre-site.netlify.app
   NODE_ENV=production
   PORT=3003
   ```
5. Déployer

URL: `https://votre-backend.onrender.com`

### Frontend sur Netlify

1. Créer un compte sur [Netlify](https://www.netlify.com)
2. **Option A:** Glisser-déposer le dossier `frontend/`
3. **Option B:** Connecter le repo GitHub
4. Le site est déployé ✅

URL: `https://votre-site.netlify.app`

### ⚠️ Après déploiement

1. **Mettre à jour `frontend/assets/js/config.js`:**
   ```javascript
   API_URL: 'https://votre-backend.onrender.com/api'
   ```

2. **Mettre à jour `backend/.env`:**
   ```env
   ALLOWED_ORIGINS=https://votre-site.netlify.app
   ```

3. **Re-déployer** les deux services

---

## 🔒 Sécurité

- ✅ Authentification admin par clé secrète
- ✅ CORS configuré (origines autorisées)
- ✅ Rate limiting (150 soumissions/heure/IP)
- ✅ Validation stricte (express-validator)
- ✅ Protection SQL injection (prepared statements)
- ✅ Headers de sécurité (helmet)
- ✅ Pas de stockage de mots de passe (pas de comptes utilisateurs)

---

## 📱 Mobile Money CI

Le système supporte 4 opérateurs en Côte d'Ivoire:

| Opérateur | Indicatif | Exemple |
|-----------|-----------|---------|
| **Wave** | 07/05 | 07 XX XX XX XX |
| **Orange Money** | 07/05/01 | 07 XX XX XX XX |
| **MTN Money** | 05/06 | 05 XX XX XX XX |
| **Moov Money** | 01 | 01 XX XX XX XX |

**Important:** Les paiements sont effectués **manuellement** par les utilisateurs via leurs applications Mobile Money. Pas d'intégration API de paiement automatique.

---

## 📊 Captures d'écran

### Formulaire Public
- Interface épurée et intuitive
- Choix des moyens de paiement avec icônes
- Montants suggérés cliquables

### Page de Confirmation
- Référence unique bien visible
- Instructions détaillées selon le moyen choisi
- Formulaire pour code de transaction

### Dashboard Admin
- Statistiques en temps réel
- Graphiques (Chart.js)
- Tableau avec filtres et export CSV
- Actions rapides (valider/rejeter)

---

## 🛠️ Développement

### Structure du projet

```
collecte-communautaire/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── models/database.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
└── frontend/
    ├── index.html
    ├── confirmation.html
    ├── admin/index.html
    └── assets/
        ├── css/style.css
        └── js/
            ├── config.js
            ├── app.js
            ├── confirmation.js
            └── admin.js
```

### Commandes utiles

```bash
# Backend
npm run dev          # Développement avec nodemon
npm start            # Production

# Frontend
python -m http.server 5500
npx http-server -p 5500
```

---

## 📝 TODO / Améliorations

- [ ] Migration vers PostgreSQL (production à grande échelle)
- [ ] Notifications par SMS (Twilio/Vonage)
- [ ] Envoi d'emails de confirmation
- [ ] Statistiques plus avancées
- [ ] Webhooks pour intégration API Mobile Money
- [ ] Multi-tenancy (plusieurs organisations)
- [ ] Générateur de reçus PDF
- [ ] Système de recherche par contributeur
- [ ] Mode sombre

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License - Libre d'utilisation pour projets personnels et commerciaux.

---

## 👨‍💻 Auteur

Créé avec ❤️ pour les communautés ivoiriennes.

---

## 📞 Support

Besoin d'aide ? Consultez les README dans `backend/` et `frontend/` pour des instructions détaillées.

**Bon déploiement ! 🚀🇨🇮**
