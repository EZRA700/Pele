# 🚀 Guide Rapide - Déploiement Express sur Render

## Méthode Blueprint (RECOMMANDÉE - 10 minutes)

Cette méthode utilise le fichier `render.yaml` pour déployer automatiquement les deux services (backend + frontend) en une seule fois.

---

## ⚡ Étapes Rapides

### 1️⃣ Préparer le Repository GitHub

```bash
# Générer une clé admin sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiez la clé affichée

# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Prêt pour Render"

# Créer un repo sur GitHub puis :
git remote add origin https://github.com/VOTRE-USERNAME/collecte-communautaire.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Déployer sur Render (Blueprint)

1. **Allez sur Render** : https://dashboard.render.com

2. **Cliquez sur "New +"** → **"Blueprint"**

3. **Connectez GitHub** :
   - Autorisez Render à accéder à vos repos
   - Sélectionnez `collecte-communautaire`

4. **Render détecte automatiquement `render.yaml`** ✅
   - Vous verrez : "Found render.yaml"
   - Liste des services détectés :
     * `collecte-backend` (Web Service)
     * `collecte-frontend` (Static Site)

5. **Cliquez sur "Apply"**

6. **⏳ Attendez le déploiement** (5-7 minutes)
   - Backend : installation des dépendances + démarrage
   - Frontend : publication des fichiers statiques

7. **✅ Déploiement terminé !**
   - Vous verrez : "Live" pour les deux services

---

### 3️⃣ Configuration Post-Déploiement

#### A. Récupérer les URLs

Après déploiement, notez vos URLs :
```
Backend  : https://collecte-backend-XXXX.onrender.com
Frontend : https://collecte-frontend-XXXX.onrender.com
```

#### B. Mettre à jour config.js

1. Ouvrez `frontend/assets/js/config.js`

2. Modifiez :
```javascript
const CONFIG = {
    API_URL: 'https://collecte-backend-XXXX.onrender.com/api',
    ADMIN_KEY: 'VOTRE_CLE_GENEREE_ETAPE_1',
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

4. ✅ Render redéploie automatiquement le frontend (1-2 min)

#### C. Configurer CORS Backend

1. Dans **Render Dashboard** → Service `collecte-backend`
2. Allez dans **"Environment"**
3. Trouvez `ALLOWED_ORIGINS`
4. Modifiez la valeur :
```
https://collecte-frontend-XXXX.onrender.com
```
5. Cliquez sur **"Save Changes"**
6. Le backend redémarre automatiquement (30 sec)

#### D. Vérifier/Modifier la Clé Admin

1. Toujours dans `collecte-backend` → **"Environment"**
2. Trouvez `ADMIN_SECRET_KEY`
3. Si elle a été générée automatiquement :
   - Cliquez sur "Reveal" pour voir la valeur
   - **COPIEZ-LA** et utilisez-la dans `config.js` (étape B)
4. OU remplacez par votre propre clé générée à l'étape 1

---

### 4️⃣ Tests de Production

#### Test 1 : Backend API
Ouvrez dans votre navigateur :
```
https://collecte-backend-XXXX.onrender.com/health
```

Réponse attendue :
```json
{
  "status": "OK",
  "timestamp": "2026-02-16T...",
  "database": "connected"
}
```

#### Test 2 : Frontend Public
Ouvrez :
```
https://collecte-frontend-XXXX.onrender.com
```

Vérifiez :
- ✅ Page charge correctement
- ✅ Formulaire visible
- ✅ Section Wave visible
- ✅ PAS de lien "Administration" dans le footer

#### Test 3 : Dashboard Admin
Ouvrez :
```
https://collecte-frontend-XXXX.onrender.com/admin/
```

1. Entrez votre clé admin
2. Vérifiez que le dashboard charge
3. Créez une inscription test
4. Validez-la depuis le dashboard

---

## 🎯 Résumé de la Configuration

| Élément | Valeur |
|---------|--------|
| **Plateforme** | Render (Blueprint) |
| **Backend** | Web Service (Node.js) |
| **Frontend** | Static Site (HTML/CSS/JS) |
| **Base de données** | SQLite (persistée dans le service backend) |
| **Région** | Frankfurt (EU Central) |
| **Plan** | Free (les deux services) |
| **SSL/HTTPS** | Automatique (Let's Encrypt) |
| **Déploiement** | Automatique via Git push |

---

## ⚙️ Variables d'Environnement (Backend)

Ces variables sont configurées via `render.yaml` :

```yaml
NODE_ENV=production
PORT=3003
DB_PATH=./database/collecte.db
ADMIN_SECRET_KEY=<générée automatiquement ou manuelle>
ALLOWED_ORIGINS=https://collecte-frontend-XXXX.onrender.com
```

---

## 🔄 Déploiements Futurs

Après la configuration initiale, c'est très simple :

```bash
# 1. Modifiez votre code
# 2. Commitez
git add .
git commit -m "Votre message"

# 3. Pushez
git push

# 4. Render redéploie automatiquement ! ✨
```

---

## 📊 Monitoring

### Logs Backend
1. Render Dashboard → `collecte-backend`
2. Onglet **"Logs"**
3. Surveillez :
   - `✅ Base de données initialisée`
   - `🚀 Serveur démarré sur le port 3003`
   - Erreurs éventuelles

### Logs Frontend
1. Render Dashboard → `collecte-frontend`
2. Onglet **"Logs"**
3. Vérifiez les requêtes HTTP

---

## 🚨 Limitations Plan Gratuit

### Backend (Web Service Free)
- ⏱️ Mise en veille après **15 min** d'inactivité
- ⏱️ Réveil : ~**30 secondes** au premier appel
- 💾 **750 heures/mois** gratuites
- 🔄 Redéploiements illimités

### Frontend (Static Site)
- ✅ **Toujours actif** (pas de mise en veille)
- ✅ Bande passante illimitée
- ✅ CDN mondial
- ⚡ Très rapide

### Solutions pour éviter la mise en veille :
1. **UptimeRobot** (gratuit) : ping toutes les 10 min
2. **Cron-job.org** (gratuit) : tâche planifiée
3. **Plan payant Render** : $7/mois → pas de veille

---

## 🆘 Dépannage Express

### Erreur : "Failed to fetch"
**Cause** : CORS mal configuré
**Solution** : Vérifiez `ALLOWED_ORIGINS` dans le backend

### Backend ne démarre pas
**Vérification** : Logs backend → cherchez l'erreur
**Solutions courantes** :
- Vérifiez `package.json` : présence de `"start": "node server.js"`
- Vérifiez toutes les dépendances sont dans `package.json`

### Frontend affiche une page blanche
**Solutions** :
1. Ouvrez la console navigateur (F12)
2. Cherchez les erreurs
3. Vérifiez que `API_URL` est correcte dans `config.js`

### Dashboard admin : "Clé invalide"
**Solutions** :
- Vérifiez que `ADMIN_KEY` (frontend) = `ADMIN_SECRET_KEY` (backend)
- Pas d'espaces avant/après la clé
- Clés identiques caractère par caractère

---

## 🎉 Checklist Finale

Avant de communiquer le lien au public :

- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] `config.js` mis à jour avec URL backend
- [ ] CORS configuré correctement
- [ ] Clé admin identique frontend/backend
- [ ] Test inscription réussie
- [ ] Test dashboard admin OK
- [ ] Lien Wave fonctionnel
- [ ] Aucun lien visible vers /admin/ sur page publique
- [ ] Monitoring configuré (UptimeRobot)

---

## 📱 Partager avec le Public

Une fois tout validé, partagez l'URL :

```
🎯 INSCRIPTION EN LIGNE
https://collecte-frontend-XXXX.onrender.com

💰 Montant : 10 000 F CFA
📱 Paiement : Wave Mobile Money
```

---

**Temps total estimé** : 10-15 minutes  
**Difficulté** : ⭐⭐☆☆☆ (Facile)  
**Coût** : 0 € (plan gratuit)

Bonne chance pour votre déploiement ! 🚀
