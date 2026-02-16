# 🚀 Guide de Déploiement en Production
## Backend sur Render + Frontend sur Netlify

---

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Préparation des Fichiers](#préparation-des-fichiers)
3. [Déploiement du Backend sur Render](#déploiement-du-backend-sur-render)
4. [Déploiement du Frontend sur Netlify](#déploiement-du-frontend-sur-netlify)
5. [Configuration Post-Déploiement](#configuration-post-déploiement)
6. [Tests de Production](#tests-de-production)
7. [Maintenance et Monitoring](#maintenance-et-monitoring)
8. [Dépannage](#dépannage)

---

## 🔑 Prérequis

### Comptes Requis
- [ ] Compte GitHub (pour héberger le code source)
- [ ] Compte Render (https://render.com - gratuit)
- [ ] Compte Netlify (https://netlify.com - gratuit)

### Outils Locaux
- [ ] Git installé sur votre machine
- [ ] Node.js 18+ installé
- [ ] Éditeur de texte (VS Code recommandé)

### Informations à Préparer
- [ ] URL du merchant Wave : `https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/`
- [ ] Clé admin sécurisée (32 caractères minimum)
- [ ] Nom de domaine personnalisé (optionnel)

---

## 📦 ÉTAPE 1 : Préparation des Fichiers

### 1.1 Créer un Repository GitHub

```bash
# Dans le dossier D:\Combilo\Pele
git init
git add .
git commit -m "Initial commit - Collecte Communautaire"

# Créer un nouveau repository sur GitHub.com
# Nommez-le par exemple: collecte-communautaire
# Puis exécutez:

git remote add origin https://github.com/VOTRE-USERNAME/collecte-communautaire.git
git branch -M main
git push -u origin main
```

### 1.2 Vérifier le fichier .gitignore

✅ Assurez-vous que ces fichiers sont dans `.gitignore` :
- `backend/.env` (IMPORTANT - contient les secrets)
- `backend/database/` (la base de données locale)
- `node_modules/`

### 1.3 Préparer une Nouvelle Clé Admin Sécurisée

```powershell
# Générer une clé sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**IMPORTANT** : Copiez cette clé, vous en aurez besoin pour Render et Netlify.

Exemple de clé générée :
```
a72f9d3e8b1c4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f
```

---

## 🖥️ ÉTAPE 2 : Déploiement du Backend sur Render

### 2.1 Créer un Nouveau Web Service

1. **Connectez-vous à Render** : https://dashboard.render.com
2. **Cliquez sur "New +"** → **"Web Service"**
3. **Connectez votre repository GitHub**
   - Autorisez Render à accéder à vos repos
   - Sélectionnez `collecte-communautaire`

### 2.2 Configuration du Service

Remplissez les informations suivantes :

| Champ | Valeur |
|-------|--------|
| **Name** | `collecte-backend` (ou votre choix) |
| **Region** | `Frankfurt (EU Central)` (plus proche de la CI) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 2.3 Variables d'Environnement

Cliquez sur **"Advanced"** puis ajoutez ces variables d'environnement :

```plaintext
ADMIN_SECRET_KEY=a72f9d3e8b1c4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f
PORT=3003
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:5500,https://VOTRE-SITE.netlify.app
DB_PATH=./database/collecte.db
```

**IMPORTANT** : 
- Remplacez `a72f9d3e8b1c4a5f...` par votre vraie clé générée
- Remplacez `VOTRE-SITE.netlify.app` par votre vrai domaine Netlify (vous l'aurez après l'étape 3)

### 2.4 Créer le Service

1. Cliquez sur **"Create Web Service"**
2. ⏳ Attendez le déploiement (5-10 minutes)
3. ✅ Une fois terminé, vous verrez : **"Your service is live 🎉"**

### 2.5 Récupérer l'URL du Backend

Vous verrez une URL comme :
```
https://collecte-backend.onrender.com
```

**IMPORTANT** : Copiez cette URL, vous en aurez besoin pour configurer le frontend.

### 2.6 Initialiser la Base de Données

Render va créer automatiquement la base de données au premier démarrage grâce à `initDatabase()` dans `server.js`.

Pour vérifier :
1. Allez dans l'onglet **"Logs"**
2. Cherchez le message : `✅ Base de données initialisée avec succès`

---

## 🌐 ÉTAPE 3 : Déploiement du Frontend sur Netlify

### 3.1 Créer un Nouveau Site

1. **Connectez-vous à Netlify** : https://app.netlify.com
2. **Cliquez sur "Add new site"** → **"Import an existing project"**
3. **Choisissez GitHub**
   - Autorisez Netlify à accéder à vos repos
   - Sélectionnez `collecte-communautaire`

### 3.2 Configuration du Déploiement

| Champ | Valeur |
|-------|--------|
| **Branch to deploy** | `main` |
| **Base directory** | `frontend` |
| **Build command** | (laisser vide) |
| **Publish directory** | `.` |

### 3.3 Variables d'Environnement (Optionnel)

Pour plus de sécurité, vous pouvez utiliser des variables d'environnement Netlify.

Allez dans **Site settings** → **Environment variables** :

```plaintext
VITE_API_URL=https://collecte-backend.onrender.com/api
VITE_ADMIN_KEY=a72f9d3e8b1c4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f
```

### 3.4 Déployer le Site

1. Cliquez sur **"Deploy site"**
2. ⏳ Attendez le déploiement (2-3 minutes)
3. ✅ Votre site est en ligne !

### 3.5 Récupérer l'URL du Frontend

Netlify vous donne une URL comme :
```
https://random-name-123456.netlify.app
```

### 3.6 Personnaliser le Nom de Domaine (Optionnel)

1. Allez dans **Site settings** → **Domain management**
2. Cliquez sur **"Options"** → **"Edit site name"**
3. Changez en : `collecte-communautaire` (si disponible)
4. Votre nouvelle URL : `https://collecte-communautaire.netlify.app`

---

## ⚙️ ÉTAPE 4 : Configuration Post-Déploiement

### 4.1 Mettre à Jour l'URL de l'API dans le Frontend

**Option A : Modification Directe (Simple)**

1. Ouvrez `frontend/assets/js/config.js`
2. Modifiez :

```javascript
const CONFIG = {
    // Changez cette ligne
    API_URL: 'https://collecte-backend.onrender.com/api',
    
    // Gardez la même clé admin que dans Render
    ADMIN_KEY: 'a72f9d3e8b1c4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f',
    
    WAVE_PAYMENT_URL: 'https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/',
    // ... reste du fichier
};
```

3. Commitez et pushez :

```bash
git add frontend/assets/js/config.js
git commit -m "Update API URL for production"
git push
```

4. Netlify redéploiera automatiquement (1-2 minutes)

**Option B : Variables d'Environnement (Avancé)**

Si vous utilisez des variables d'environnement Netlify, créez un fichier `frontend/assets/js/config.prod.js` :

```javascript
const CONFIG = {
    API_URL: import.meta.env.VITE_API_URL || 'https://collecte-backend.onrender.com/api',
    ADMIN_KEY: import.meta.env.VITE_ADMIN_KEY,
    WAVE_PAYMENT_URL: 'https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/',
    // ... reste de la config
};
```

### 4.2 Mettre à Jour CORS sur le Backend

1. Retournez sur **Render Dashboard**
2. Allez dans votre service `collecte-backend`
3. Cliquez sur **"Environment"**
4. Modifiez `ALLOWED_ORIGINS` :

```plaintext
ALLOWED_ORIGINS=https://collecte-communautaire.netlify.app
```

5. Cliquez sur **"Save Changes"**
6. Le backend redémarrera automatiquement (30 secondes)

### 4.3 Vérifier netlify.toml

Le fichier `frontend/netlify.toml` devrait contenir :

```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

✅ Ce fichier est déjà configuré !

---

## ✅ ÉTAPE 5 : Tests de Production

### 5.1 Tester le Backend

Ouvrez votre navigateur ou utilisez Postman :

```bash
# Test de santé
GET https://collecte-backend.onrender.com/api/health

# Réponse attendue :
{
  "status": "OK",
  "timestamp": "2026-02-16T12:00:00.000Z",
  "database": "connected"
}
```

```bash
# Test des statistiques
GET https://collecte-backend.onrender.com/api/stats/publiques

# Réponse attendue :
{
  "total_inscriptions": 0,
  "montant_collecte": 0,
  "moyenne_contribution": 0
}
```

### 5.2 Tester le Frontend

1. **Ouvrez votre site** : https://collecte-communautaire.netlify.app

2. **Test du formulaire d'inscription** :
   - Remplissez tous les champs
   - Cliquez sur "S'inscrire"
   - Vérifiez que la section Wave s'affiche

3. **Test du dashboard admin** :
   - Allez sur : https://collecte-communautaire.netlify.app/admin/
   - Entrez la clé admin
   - Vérifiez que l'inscription apparaît

### 5.3 Tester l'Intégration Wave

1. Créez une inscription de test
2. Cliquez sur le bouton **"Payer avec Wave"**
3. Vérifiez que vous êtes redirigé vers Wave avec le bon montant

---

## 📊 ÉTAPE 6 : Maintenance et Monitoring

### 6.1 Logs Backend (Render)

Pour voir les logs en temps réel :

1. Allez sur **Render Dashboard**
2. Cliquez sur votre service `collecte-backend`
3. Onglet **"Logs"**

Messages importants à surveiller :
```
✅ Base de données initialisée avec succès
🚀 Serveur démarré sur le port 3003
✅ Nouvelle soumission créée: [ID]
⚠️ Erreur de validation
```

### 6.2 Logs Frontend (Netlify)

1. Allez sur **Netlify Dashboard**
2. Cliquez sur votre site
3. Onglet **"Functions"** → **"Netlify Logs"**

### 6.3 Surveillance de la Base de Données

Pour sauvegarder la base de données :

1. Sur **Render**, allez dans **"Shell"**
2. Exécutez :

```bash
cd database
ls -lh collecte.db
# Vérifier la taille de la DB
```

### 6.4 Sauvegardes Régulières

**Option 1 : Téléchargement Manuel**

1. Connectez-vous au Shell Render
2. Téléchargez la DB :

```bash
cat database/collecte.db | base64
```

3. Copiez le contenu et décodez-le localement

**Option 2 : API d'Export CSV**

Utilisez l'endpoint d'export pour sauvegarder les données :

```bash
curl -H "x-admin-key: VOTRE_CLE" \
  https://collecte-backend.onrender.com/api/admin/export/csv \
  > backup-$(date +%Y%m%d).csv
```

### 6.5 Monitoring des Performances

**Render** :
- Instance Type Free : sommeil après 15 min d'inactivité
- Premier appel : ~30 secondes (réveil)
- Appels suivants : instantanés

**Conseil** : Utilisez un service de monitoring (comme UptimeRobot) pour pinger votre API toutes les 10 min.

---

## 🔧 ÉTAPE 7 : Dépannage

### Problème 1 : "Failed to fetch" sur le Frontend

**Cause** : CORS mal configuré

**Solution** :
1. Vérifiez `ALLOWED_ORIGINS` sur Render
2. Assurez-vous qu'il contient votre URL Netlify exacte
3. Redémarrez le service Render

### Problème 2 : Backend se met en veille

**Cause** : Plan gratuit Render

**Solutions** :
- **Option A** : Utilisez UptimeRobot pour pinger toutes les 10 min
- **Option B** : Passez au plan payant ($7/mois)
- **Option C** : Ajoutez un cron job qui appelle votre API

### Problème 3 : Base de données perdue après redéploiement

**Cause** : Render ne persiste pas les fichiers en dehors de `/opt/render/project`

**Solution** :
1. Utilisez un **Persistent Disk** Render (plan payant)
2. Ou exportez régulièrement en CSV
3. Ou migrez vers PostgreSQL (gratuit sur Render)

### Problème 4 : Clé admin invalide

**Vérifications** :
1. Frontend `config.js` : même clé que Render
2. Headers HTTP : `x-admin-key` (minuscule)
3. Pas d'espaces avant/après la clé

### Problème 5 : Wave ne s'ouvre pas

**Vérifications** :
1. URL Wave correcte dans `config.js`
2. Montant correct (10000)
3. Compte marchand actif

---

## 🎯 ÉTAPE 8 : Configuration Avancée (Optionnel)

### 8.1 Domaine Personnalisé

**Netlify** :
1. Achetez un domaine (ex: collectecommunautaire.com)
2. Dans Netlify : **Domain settings** → **Add custom domain**
3. Configurez les DNS selon les instructions

**Render** :
1. Dans Render : **Settings** → **Custom Domain**
2. Ajoutez `api.collectecommunautaire.com`
3. Configurez le CNAME

### 8.2 HTTPS/SSL

✅ Netlify et Render fournissent SSL automatiquement (Let's Encrypt)

### 8.3 Migration vers PostgreSQL (Recommandé)

Pour la production à long terme, PostgreSQL est meilleur que SQLite :

1. Sur Render, créez une **PostgreSQL Database** (gratuit)
2. Modifiez le backend pour utiliser `pg` au lieu de `sqlite3`
3. Mettez à jour `DATABASE_URL` dans les variables d'environnement

---

## 📝 Checklist Finale

Avant de lancer publiquement :

- [ ] Backend déployé sur Render et accessible
- [ ] Frontend déployé sur Netlify et accessible
- [ ] API_URL mise à jour dans `config.js`
- [ ] CORS configuré avec l'URL Netlify
- [ ] Clé admin sécurisée (32+ caractères)
- [ ] Clé admin identique frontend/backend
- [ ] Tests d'inscription réussis
- [ ] Dashboard admin accessible
- [ ] Export CSV fonctionnel
- [ ] Lien Wave fonctionnel
- [ ] Monitoring configuré (optionnel)
- [ ] Sauvegardes planifiées (optionnel)

---

## 🆘 Support et Ressources

### Documentation Officielle
- **Render** : https://render.com/docs
- **Netlify** : https://docs.netlify.com
- **Wave API** : https://developer.wave.com

### Commandes Utiles

```bash
# Mettre à jour le code en production
git add .
git commit -m "Update: votre message"
git push

# Render et Netlify redéploieront automatiquement

# Voir les logs Render (via Dashboard)
# Voir les logs Netlify (via Dashboard)

# Tester l'API localement
curl https://collecte-backend.onrender.com/api/health

# Vérifier les variables d'environnement Render
# Dashboard → collecte-backend → Environment

# Redéployer manuellement sur Render
# Dashboard → collecte-backend → Manual Deploy → Deploy latest commit

# Redéployer manuellement sur Netlify
# Dashboard → Deploys → Trigger deploy
```

---

## 🎉 Félicitations !

Votre application de collecte communautaire est maintenant en production !

**URLs de votre application** :
- Frontend : `https://collecte-communautaire.netlify.app`
- Backend API : `https://collecte-backend.onrender.com/api`
- Dashboard Admin : `https://collecte-communautaire.netlify.app/admin/`

---

## 📌 Notes Importantes

1. **Plan Gratuit Render** :
   - 750 heures/mois gratuites
   - Mise en veille après 15 min d'inactivité
   - Réveil ~30 secondes au premier appel

2. **Plan Gratuit Netlify** :
   - 100 GB bande passante/mois
   - 300 minutes de build/mois
   - HTTPS automatique

3. **Sécurité** :
   - Ne commitez JAMAIS les fichiers `.env` sur GitHub
   - Changez la clé admin régulièrement
   - Activez l'authentification à deux facteurs (2FA) sur GitHub, Render et Netlify

4. **Performance** :
   - Le premier chargement peut être lent (réveil Render)
   - Utilisez un service de monitoring pour garder l'API active
   - Optimisez les images (logo Wave, etc.)

---

**Dernière mise à jour** : 16 février 2026  
**Version** : 1.0.0
