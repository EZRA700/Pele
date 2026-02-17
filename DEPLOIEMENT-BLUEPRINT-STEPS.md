# 🚀 Déploiement Blueprint - Guide Simplifié
**Vos fichiers sont prêts ! Suivez ces étapes.**

---

## ✅ Ce qui est déjà fait

- [x] Clé admin générée : `f9228dc7440232c1df16f82809e394e18da2b2f8a50521e4f283ebb7fba8b01e`
- [x] render.yaml configuré avec la clé
- [x] Template config.js de production créé
- [x] Compte Render créé
- [x] Dépôt GitHub créé

---

## 📋 Étapes à suivre (10 minutes)

### ÉTAPE 1️⃣ : Commiter et pousser sur GitHub

```powershell
# 1. Vérifier les fichiers modifiés
git status

# 2. Ajouter tous les fichiers
git add .

# 3. Commiter
git commit -m "Configuration production Blueprint Render"

# 4. Configurer le remote (si pas déjà fait)
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/collecte-communautaire.git

# 5. Pousser sur GitHub
git push -u origin main
```

**⚠️ Note** : Si vous avez une erreur "remote already exists", utilisez :
```powershell
git remote set-url origin https://github.com/VOTRE-USERNAME/collecte-communautaire.git
git push -u origin main
```

---

### ÉTAPE 2️⃣ : Déployer via Blueprint sur Render

1. **Connectez-vous à Render** : https://dashboard.render.com

2. **Cliquez sur "New +"** en haut à droite

3. **Sélectionnez "Blueprint"**

4. **Connectez GitHub** (si première fois) :
   - Cliquez sur "Connect GitHub"
   - Autorisez Render à accéder à vos repos

5. **Sélectionnez votre repository** :
   - Cherchez `collecte-communautaire`
   - Cliquez dessus

6. **Render détecte render.yaml** ✅ :
   - Vous verrez : "We found a render.yaml file"
   - Liste des services :
     * `collecte-backend` (Web Service - Free)
     * `collecte-frontend` (Static Site - Free)

7. **Cliquez sur "Apply"**

8. **⏳ Attendez le déploiement** (5-7 minutes) :
   - Render installe les dépendances du backend
   - Render démarre le serveur backend
   - Render publie le frontend
   - Vous verrez "Live ✅" quand c'est terminé

---

### ÉTAPE 3️⃣ : Récupérer les URLs Render

Une fois le déploiement terminé :

1. Dans le **Render Dashboard**, vous verrez 2 services :
   - `collecte-backend` → Cliquez dessus
   - Notez l'URL : `https://collecte-backend-XXXX.onrender.com`

2. Retournez au Dashboard, cliquez sur `collecte-frontend`
   - Notez l'URL : `https://collecte-frontend-XXXX.onrender.com`

**Exemple** :
```
Backend  : https://collecte-backend-abc123.onrender.com
Frontend : https://collecte-frontend-xyz789.onrender.com
```

---

### ÉTAPE 4️⃣ : Mettre à jour la configuration frontend

1. **Ouvrez le fichier** : `frontend/assets/js/config.PRODUCTION-TEMPLATE.js`

2. **Modifiez la ligne 24** :
   ```javascript
   API_URL: 'https://collecte-backend-XXXX.onrender.com/api',
   ```
   Remplacez `XXXX` par votre vraie URL backend

3. **Renommez le fichier** :
   - De : `config.PRODUCTION-TEMPLATE.js`
   - En : `config.js` (écrase l'ancien)

4. **Commitez et pushez** :
   ```powershell
   git add frontend/assets/js/config.js
   git commit -m "Update API URL for production"
   git push
   ```

5. **Render redéploie automatiquement** le frontend (1-2 min)

---

### ÉTAPE 5️⃣ : Configurer CORS du backend

1. Retournez sur **Render Dashboard** → Service `collecte-backend`

2. Allez dans l'onglet **"Environment"**

3. Trouvez la variable `ALLOWED_ORIGINS`

4. **Modifiez sa valeur** avec votre URL frontend réelle :
   ```
   https://collecte-frontend-xyz789.onrender.com
   ```

5. Cliquez sur **"Save Changes"**

6. Le backend redémarre automatiquement (30 secondes)

---

### ÉTAPE 6️⃣ : Tester votre application en production

#### Test Backend
Ouvrez dans votre navigateur :
```
https://collecte-backend-XXXX.onrender.com/health
```

Vous devriez voir :
```json
{
  "status": "OK",
  "timestamp": "2026-02-17T...",
  "database": "connected"
}
```

#### Test Frontend Public
Ouvrez :
```
https://collecte-frontend-XXXX.onrender.com
```

Vérifiez :
- ✅ Page se charge
- ✅ Formulaire visible
- ✅ Section Wave visible
- ✅ PAS de lien "Administration" dans le footer

#### Test Dashboard Admin
Ouvrez :
```
https://collecte-frontend-XXXX.onrender.com/admin/
```

1. Entrez la clé admin : `f9228dc7440232c1df16f82809e394e18da2b2f8a50521e4f283ebb7fba8b01e`
2. Le dashboard doit s'ouvrir

#### Test Inscription Complète
1. Remplissez le formulaire d'inscription
2. Cliquez sur "S'inscrire"
3. Vérifiez que la section Wave s'affiche
4. Allez dans l'admin
5. Vérifiez que l'inscription apparaît

---

## ✅ Checklist Finale

Avant de partager au public :

- [ ] Backend accessible et répond
- [ ] Frontend accessible
- [ ] `config.js` mis à jour avec la bonne URL backend
- [ ] CORS configuré correctement
- [ ] Clé admin fonctionne
- [ ] Test inscription réussi
- [ ] Dashboard admin opérationnel
- [ ] Lien Wave fonctionne

---

## 🎉 Félicitations !

Votre application est en production !

**URLs à partager** :
- Public : `https://collecte-frontend-XXXX.onrender.com`
- Admin : `https://collecte-frontend-XXXX.onrender.com/admin/`

**Montant** : 10 000 F CFA  
**Paiement** : Wave Mobile Money

---

## 🆘 Dépannage Rapide

### Erreur "Failed to fetch" sur le frontend
**Cause** : CORS mal configuré  
**Solution** : Vérifiez `ALLOWED_ORIGINS` dans le backend (Étape 5)

### Backend ne démarre pas
**Solution** : Vérifiez les logs dans Render Dashboard → collecte-backend → Logs

### Clé admin invalide
**Solution** : Vérifiez que la clé dans `config.js` est identique à celle dans `render.yaml`

---

## 📊 Limitations Plan Gratuit

**Backend** :
- Mise en veille après 15 min d'inactivité
- Réveil : ~30 secondes au premier appel
- 750 heures/mois

**Frontend** :
- Toujours actif (pas de veille)
- Bande passante illimitée

**Solution anti-veille** : Utilisez UptimeRobot (gratuit) pour pinger votre backend toutes les 10 minutes.

---

**Bon déploiement ! 🚀**
