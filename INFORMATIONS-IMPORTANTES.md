# 🔐 INFORMATIONS IMPORTANTES - À CONSERVER

**Date de configuration** : 17 février 2026

---

## 🔑 CLÉ ADMIN (CONFIDENTIEL)

```
f9228dc7440232c1df16f82809e394e18da2b2f8a50521e4f283ebb7fba8b01e
```

**⚠️ NE PARTAGEZ JAMAIS CETTE CLÉ !**

Cette clé est utilisée pour :
- Variable `ADMIN_SECRET_KEY` sur Render (backend)
- Variable `ADMIN_KEY` dans config.js (frontend)
- Connexion au dashboard admin

---

## 📍 URLS (À compléter après déploiement)

### Production Render
```
Backend  : https://collecte-backend-________.onrender.com
Frontend : https://collecte-frontend-________.onrender.com
Admin    : https://collecte-frontend-________.onrender.com/admin/
```

### Local (développement)
```
Backend  : http://localhost:3003
Frontend : http://localhost:5500
Admin    : http://localhost:5500/admin/
```

---

## 💳 INFORMATIONS WAVE

**URL Merchant** : `https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/`  
**Montant d'inscription** : 10 000 F CFA

Configuré dans :
- `frontend/assets/js/config.js` (variable WAVE_PAYMENT_URL)
- `frontend/index.html` (lien cliquable)

---

## 📦 STRUCTURE DU PROJET

```
collecte-communautaire/
├── backend/                    # API Node.js + Express
│   ├── server.js              # Point d'entrée
│   ├── database/              # SQLite (créée automatiquement)
│   │   └── collecte.db
│   ├── controllers/           # Logique métier
│   ├── routes/                # Routes API
│   └── package.json           # Dépendances
│
├── frontend/                  # Interface HTML/CSS/JS
│   ├── index.html            # Formulaire public
│   ├── admin/                # Dashboard admin
│   │   └── index.html
│   └── assets/
│       ├── css/style.css
│       └── js/
│           ├── config.js      # ⚠️ À mettre à jour après déploiement
│           ├── app.js         # Logique formulaire
│           └── admin.js       # Logique dashboard
│
├── render.yaml               # ✅ Configuration Blueprint Render
├── DEPLOIEMENT-BLUEPRINT-STEPS.md  # Guide de déploiement
└── admin_key_temp.txt        # 🗑️ Supprimer après déploiement
```

---

## ⚙️ CONFIGURATION RENDER (via render.yaml)

### Backend (Web Service)
```yaml
name: collecte-backend
type: web
runtime: node
region: frankfurt
plan: free

Variables d'environnement :
- NODE_ENV=production
- PORT=3003
- DB_PATH=./database/collecte.db
- ADMIN_SECRET_KEY=f9228dc7440232c1df16f82809e394e18da2b2f8a50521e4f283ebb7fba8b01e
- ALLOWED_ORIGINS=https://collecte-frontend-XXXX.onrender.com

Build: npm install
Start: npm start
```

### Frontend (Static Site)
```yaml
name: collecte-frontend
type: web
runtime: static
region: frankfurt
plan: free

Publish: ./frontend
Headers de sécurité : ✅ Configurés
```

---

## 🔄 WORKFLOW DE DÉPLOIEMENT

### Déploiement initial (Blueprint)
1. Pusher sur GitHub
2. Render Dashboard → New → Blueprint
3. Sélectionner le repo
4. Apply → Déploiement automatique des 2 services

### Déploiements futurs (automatiques)
```bash
git add .
git commit -m "Votre message"
git push
# Render redéploie automatiquement !
```

---

## 🧪 TESTS ESSENTIELS

### Backend
```
GET https://collecte-backend-XXXX.onrender.com/health
✅ Réponse : {"status":"OK","database":"connected"}
```

### Frontend Public
```
https://collecte-frontend-XXXX.onrender.com
✅ Formulaire visible
✅ Section Wave visible
✅ Pas de lien "Administration"
```

### Dashboard Admin
```
https://collecte-frontend-XXXX.onrender.com/admin/
✅ Accès avec clé admin
✅ Statistiques affichées
✅ Liste des inscriptions
✅ Validation/Rejet fonctionnel
```

---

## 📊 BASE DE DONNÉES

**Type** : SQLite  
**Emplacement** : `backend/database/collecte.db`  
**Persistance** : Oui (dans le service backend Render)

### Tables
- **soumissions** : Inscriptions des participants
  - id, nom, prenoms, age, taille_tee_shirt
  - telephone, numero_paiement, montant, moyen_paiement
  - statut (en_attente, confirme, rejete, annule)
  - date_soumission, date_validation, note_admin

---

## 🌐 API ENDPOINTS

### Publiques (sans authentification)
```
GET  /health                    # Santé du serveur
POST /api/soumissions          # Créer une inscription
GET  /api/stats/publiques      # Statistiques publiques
```

### Admin (avec x-admin-key header)
```
GET    /api/admin/soumissions        # Liste toutes les inscriptions
GET    /api/admin/soumissions/:id    # Détails d'une inscription
PATCH  /api/admin/soumissions/:id/confirmer  # Valider
PATCH  /api/admin/soumissions/:id/rejeter    # Rejeter
DELETE /api/admin/soumissions/:id    # Supprimer
GET    /api/admin/stats              # Statistiques complètes
GET    /api/admin/export/csv         # Export CSV
```

---

## 🚨 LIMITATIONS PLAN GRATUIT

### Backend (Web Service Free)
- ⏱️ Mise en veille après 15 min d'inactivité
- ⏱️ Réveil : ~30 secondes
- 💾 750 heures/mois gratuites
- 🔄 Redéploiements illimités

### Frontend (Static Site)
- ✅ Toujours actif (pas de veille)
- ✅ Bande passante illimitée
- ✅ CDN mondial
- ⚡ Très rapide

### Solution anti-veille
**UptimeRobot** (gratuit) : https://uptimerobot.com
- Créer un monitor HTTP(S)
- URL : `https://collecte-backend-XXXX.onrender.com/health`
- Intervalle : 10 minutes
- Le backend reste actif !

---

## 🔒 SÉCURITÉ

### À FAIRE après déploiement :
- [ ] Supprimer `admin_key_temp.txt` du projet
- [ ] Ne JAMAIS commiter la vraie clé admin sur GitHub public
- [ ] Activer 2FA sur GitHub
- [ ] Activer 2FA sur Render
- [ ] Changer la clé admin tous les 3-6 mois

### Protection en place :
- ✅ Pas de lien public vers /admin/
- ✅ Authentification par clé (64 caractères)
- ✅ CORS configuré
- ✅ Rate limiting (100 req/15min)
- ✅ Headers de sécurité (Helmet)
- ✅ HTTPS automatique (Let's Encrypt)

---

## 📞 SUPPORT

### Documentation Render
https://render.com/docs

### Logs (en cas de problème)
- Backend : Render Dashboard → collecte-backend → Logs
- Frontend : Render Dashboard → collecte-frontend → Logs

### Erreurs courantes
1. **"Failed to fetch"** → Vérifier CORS (ALLOWED_ORIGINS)
2. **"Clé invalide"** → Vérifier que les clés sont identiques
3. **Backend lent** → Normal (réveil après veille)

---

## 💾 SAUVEGARDES

### Méthode 1 : Export CSV
Via le dashboard admin :
- Cliquez sur "Exporter CSV"
- Sauvegardez le fichier régulièrement

### Méthode 2 : Accès direct à la DB
Via Render Shell (pour experts) :
```bash
cd backend/database
sqlite3 collecte.db ".backup backup.db"
```

**Recommandation** : Export CSV hebdomadaire !

---

## 🎯 CHECKLIST DE PRODUCTION

- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Render
- [ ] config.js mis à jour avec URL backend
- [ ] CORS configuré (ALLOWED_ORIGINS)
- [ ] Clé admin identique backend/frontend
- [ ] Test inscription complet
- [ ] Test dashboard admin
- [ ] Test export CSV
- [ ] Lien Wave testé
- [ ] Monitoring configuré (UptimeRobot)
- [ ] admin_key_temp.txt supprimé

---

**Dernière mise à jour** : 17 février 2026  
**Version** : 1.0.0  
**Méthode de déploiement** : Blueprint (Render)
