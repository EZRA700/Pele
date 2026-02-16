# Frontend - Collecte Communautaire

Interface utilisateur pour le système de collecte communautaire en Côte d'Ivoire.

## 📁 Structure

```
frontend/
├── index.html              # Formulaire public de soumission
├── confirmation.html       # Page de confirmation après soumission
├── admin/
│   └── index.html         # Dashboard administrateur
└── assets/
    ├── css/
    │   └── style.css      # Styles personnalisés
    └── js/
        ├── config.js      # Configuration globale
        ├── app.js         # Logique formulaire public
        ├── confirmation.js # Logique page confirmation
        └── admin.js       # Logique dashboard admin
```

## 🚀 Configuration

### 1. Configurer l'API Backend

Éditez `assets/js/config.js` :

```javascript
const CONFIG = {
    // URL de votre backend
    API_URL: 'http://localhost:3003/api',  // Développement
    // API_URL: 'https://votre-backend.onrender.com/api',  // Production
    
    // Clé admin (doit correspondre à celle du backend)
    ADMIN_KEY: 'votre-cle-secrete-admin',
    
    // Numéros Mobile Money
    PAYMENT_NUMBERS: {
        wave: '0712345678',
        orange_money: '0712345678',
        mtn_money: '0512345678',
        moov_money: '0112345678'
    },
    
    // ...
};
```

### 2. Personnaliser les numéros de paiement

Dans `config.js`, modifiez `PAYMENT_NUMBERS` avec vos vrais numéros Mobile Money.

## 🧪 Test en Local

### Option 1: Live Server (VS Code)

1. Installer l'extension "Live Server" dans VS Code
2. Clic droit sur `index.html` → "Open with Live Server"
3. Le site s'ouvre sur `http://localhost:5500`

### Option 2: Python HTTP Server

```bash
# Dans le dossier frontend
python -m http.server 5500
```

Puis ouvrez `http://localhost:5500`

### Option 3: Node.js http-server

```bash
# Installer http-server globalement
npm install -g http-server

# Dans le dossier frontend
http-server -p 5500
```

## 📄 Pages

### 1. Page d'accueil (`index.html`)

- Formulaire de soumission
- Validation côté client (HTML5)
- Sélection des montants suggérés
- Choix du moyen de paiement (Wave, Orange Money, MTN, Moov)
- Envoi des données vers l'API backend

**Flux:**
1. Utilisateur remplit le formulaire
2. Validation des champs
3. Envoi à `POST /api/soumissions`
4. Redirection vers `confirmation.html`

### 2. Page de confirmation (`confirmation.html`)

- Affichage de la référence unique
- Récapitulatif de la soumission
- Instructions de paiement Mobile Money
- Formulaire pour saisir le code de transaction
- Envoi du code à `PATCH /api/soumissions/:reference/reference-operateur`

**Important:** Les données sont stockées temporairement dans `sessionStorage`.

### 3. Dashboard Admin (`admin/index.html`)

**Sections:**

- **Tableau de bord**
  - Statistiques (total, en attente, confirmés, montant collecté)
  - Graphiques (répartition par statut et moyen de paiement)
  - Dernières soumissions

- **Gestion des soumissions**
  - Liste complète avec filtres (statut, moyen de paiement)
  - Actions: Voir détails, Valider, Rejeter, Annuler
  - Export CSV
  - DataTables pour tri et recherche

- **Statistiques détaillées**
  - Sélection de période (jour/semaine/mois)
  - Graphique d'évolution
  - Top contributeurs
  - Types de contributions

**Authentification:** Toutes les requêtes admin incluent le header `x-admin-key`.

## 🎨 Personnalisation

### Couleurs

Éditez `assets/css/style.css` :

```css
:root {
    --primary-color: #2c7b4e;      /* Vert principal */
    --secondary-color: #ff8c00;     /* Orange */
    --success-color: #28a745;       /* Vert succès */
    --danger-color: #dc3545;        /* Rouge erreur */
    /* ... */
}
```

### Logo et images

- Ajoutez vos images dans `assets/images/`
- Modifiez le HTML pour les intégrer

## 📦 Déploiement sur Netlify

### Méthode 1: Glisser-Déposer

1. Créer un compte sur [Netlify](https://www.netlify.com)
2. Glisser-déposer le dossier `frontend/` sur Netlify
3. Le site est déployé instantanément

### Méthode 2: GitHub + Netlify

1. Pusher le projet sur GitHub
2. Connecter le repo à Netlify
3. Configure build settings:
   - **Build command:** (vide)
   - **Publish directory:** `/` ou `frontend/`
4. Déployer

### Configuration Netlify

Le fichier `netlify.toml` contient la configuration:

```toml
# Configuration pour les Single Page Applications
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**⚠️ Important après déploiement:**

1. Copier l'URL de votre site Netlify (ex: `https://votre-site.netlify.app`)
2. Mettre à jour `API_URL` dans `config.js`
3. Ajouter l'URL dans `ALLOWED_ORIGINS` du backend (fichier `.env`)

## 🔒 Sécurité

### Production

**À FAIRE avant le déploiement:**

1. **Changer la clé admin** dans `config.js`
2. **Ne jamais committer** la vraie clé admin sur GitHub
3. **Utiliser HTTPS** en production
4. **Configurer CORS** correctement dans le backend

### Bonne pratique

Créer un fichier `config.prod.js` (non commité) pour la production:

```javascript
// config.prod.js (NE PAS COMMITTER)
const CONFIG = {
    API_URL: 'https://mon-backend-prod.onrender.com/api',
    ADMIN_KEY: 'ma-vraie-cle-secrete-64-caracteres-minimum',
    // ...
};
```

Puis utiliser ce fichier en production au lieu de `config.js`.

## 📱 Mobile-First

Le design est **responsive** grâce à Bootstrap 5:
- ✅ Smartphones (320px+)
- ✅ Tablettes (768px+)
- ✅ Desktop (1024px+)

## 🛠️ Technologies Utilisées

- **HTML5** - Structure
- **CSS3** - Styles (+ Bootstrap 5)
- **JavaScript Vanilla** - Logique (pas de frameworks)
- **Bootstrap 5.3** - Framework CSS responsive
- **Bootstrap Icons** - Icônes
- **Chart.js 4.4** - Graphiques (dashboard admin)
- **DataTables** - Tableaux avec tri/recherche (dashboard)
- **jQuery 3.7** - Requis pour DataTables

## 🔧 Développement

### Structure des fichiers JS

- `config.js` - Configuration centralisée
- `app.js` - Formulaire public
- `confirmation.js` - Page de confirmation
- `admin.js` - Dashboard admin

### Fonctions helpers (dans config.js)

```javascript
formatMontant(1000)        // "1 000 FCFA"
formatDate(isoDate)        // "15/02/2026 14:30"
formatDateShort(isoDate)   // "15/02/2026"
getStatutBadge(statut)     // HTML badge coloré
debugLog(...)              // Log si DEBUG = true
```

## 📝 TODO

- [ ] Ajouter un système de notifications en temps réel
- [ ] Implémenter un système de recherche de soumission par référence
- [ ] Ajouter des graphiques plus avancés
- [ ] Créer une page "À propos"
- [ ] Ajouter un mode sombre

## 📄 Licence

MIT
