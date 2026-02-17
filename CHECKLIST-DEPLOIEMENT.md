# ✅ Checklist de Déploiement - Collecte Communautaire
## Déploiement Complet sur Render (Backend + Frontend)

## Avant de Déployer

### 1️⃣ Vérification des Fichiers

- [x] ✅ Backend : `package.json` avec script `start`
- [x] ✅ Backend : `.gitignore` exclut `.env` et `database/`
- [x] ✅ Backend : `.env.example` présent pour référence
- [x] ✅ Frontend : Fichiers HTML statiques prêts
- [x] ✅ Frontend : `.gitignore` exclut fichiers sensibles
- [x] ✅ Aucune erreur de compilation

### 2️⃣ Configuration à Modifier

#### IMPORTANT : Ces valeurs doivent être changées en production !

##### Backend (Variables Render - Service Web)
```env
ADMIN_SECRET_KEY=GENERER_UNE_NOUVELLE_CLE_32_CARACTERES
PORT=3003
NODE_ENV=production
ALLOWED_ORIGINS=https://VOTRE-FRONTEND.onrender.com
DB_PATH=./database/collecte.db
```

##### Frontend (`config.js`)
```javascript
API_URL: 'https://VOTRE-BACKEND.onrender.com/api'
ADMIN_KEY: 'MEME_CLE_QUE_BACKEND'
WAVE_PAYMENT_URL: 'https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/'
```

### 3️⃣ Générer une Clé Admin Sécurisée

```powershell
# Exécutez cette commande pour générer une clé sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez la clé générée et utilisez-la pour :
- Variable `ADMIN_SECRET_KEY` sur Render
- Constante `ADMIN_KEY` dans `config.js`

---

## Déploiement Backend (Render)

### Configuration du Service
- [ ] Repository GitHub connecté
- [ ] Branch : `main`
- [ ] Root Directory : `backend`
- [ ] Build Command : `npm install`
- [ ] Start Command : `npm start`
- [ ] Instance Type : `Free`

### Variables d'Environnement Configurées
- [ ] `ADMIN_SECRET_KEY`
- [ ] `PORT=3003`
- [ ] `NODE_ENV=production`
- [ ] `ALLOWED_ORIGINS` (avec URL Frontend Render)
- [ ] `DB_PATH=./database/collecte.db`

### Vérifications Post-Déploiement
- [ ] Service démarré avec succès
- [ ] Logs montrent : "✅ Base de données initialisée"
- [ ] Logs montrent : "🚀 Serveur démarré sur le port 3003"
- [ ] URL backend notée : `https://____________.onrender.com`

### Tests API
- [ ] `GET /health` → Status 200
- [ ] Headers CORS corrects

---

## Déploiement Frontend (Render Static Site)

### Configuration du Service
- [ ] Repository GitHub connecté
- [ ] Branch : `main`
- [ ] Root Directory : `frontend`
- [ ] Build Command : (vide)
- [ ] Publish Directory : `.`
- [ ] Type : Static Site

### Mise à Jour du Code
- [ ] `config.js` : API_URL mis à jour avec URL Backend Render
- [ ] `config.js` : ADMIN_KEY mis à jour
- [ ] Changements commités et pushés

### Vérifications Post-Déploiement
- [ ] Site déployé avec succès
- [ ] HTTPS activé automatiquement
- [ ] URL frontend notée : `https://____________.onrender.com`

### Tests Frontend
- [ ] Page d'accueil charge correctement
- [ ] Formulaire d'inscription visible
- [ ] Section Wave visible
- [ ] Logo Wave s'affiche

---

## Configuration Finale

### Mise à Jour CORS Backend
- [ ] Retour sur Render Dashboard
- [ ] Sélectionner le service backend `collecte-backend`
- [ ] Modification de `ALLOWED_ORIGINS` avec URL Frontend Render réelle
- [ ] Service redémarré (automatique)

### Tests d'Intégration Complète

#### Test 1 : Inscription Publique
- [ ] Ouvrir `https://VOTRE-FRONTEND.onrender.com`
- [ ] Remplir le formulaire :
  - Nom : Test
  - Prénoms : Production
  - Âge : 25
  - Taille : M
  - Téléphone : 0701020304
  - Numéro Wave : 0701020304
- [ ] Cliquer sur "S'inscrire"
- [ ] Section Wave s'affiche avec référence et montant
- [ ] Montant affiché : 10 000 F CFA

#### Test 2 : Lien Wave
- [ ] Cliquer sur "Payer avec Wave"
- [ ] Redirection vers `https://pay.wave.com/m/M_ci_ni2XKML6kc_S/c/ci/`
- [ ] Page Wave charge correctement

#### Test 3 : Dashboard Admin
- [ ] Ouvrir `https://VOTRE-FRONTEND.onrender.com/admin/`
- [ ] Entrer la clé admin
- [ ] Dashboard charge
- [ ] Statistiques affichées :
  - Total inscriptions : 1
  - Montant collecté : 10 000 F
  - Moyenne : 10 000 F
- [ ] Graphique par taille affiche correctement
- [ ] Tableau montre l'inscription test

#### Test 4 : Validation d'Inscription
- [ ] Cliquer sur l'icône ✓ (œil puis valider)
- [ ] Modal de confirmation s'ouvre
- [ ] Ajouter une note : "Test de production"
- [ ] Confirmer
- [ ] Statut change en "Confirmé"
- [ ] Badge devient vert
- [ ] Statistiques se mettent à jour

#### Test 5 : Export CSV
- [ ] Cliquer sur "Exporter CSV"
- [ ] Fichier téléchargé
- [ ] Ouvrir avec Excel/LibreOffice
- [ ] Colonnes présentes : Nom, Prénoms, Âge, Taille, Téléphone, N° Wave
- [ ] Données correctes
- [ ] Encodage UTF-8 correct (accents lisibles)

---

## Sécurité

### Variables Sensibles
- [ ] Fichier `.env` backend JAMAIS committé
- [ ] Clé admin >= 32 caractères
- [ ] Clé admin différente de l'exemple dans la doc
- [ ] Clé admin identique frontend/backend

### GitHub
- [ ] Authentification 2FA activée
- [ ] Repository privé (recommandé) ou public sans secrets

### Render (Backend + Frontend)
- [ ] Authentification 2FA activée (recommandé)
- [ ] Variables d'environnement masquées
- [ ] Deux services créés : backend (Web Service) + frontend (Static Site)

---

## Monitoring et Maintenance

### Monitoring (Optionnel mais Recommandé)
- [ ] Compte UptimeRobot créé
- [ ] Monitor créé pour `https://VOTRE-BACKEND.onrender.com/api/health`
- [ ] Intervalle : 10 minutes
- [ ] Notifications email activées

### Sauvegardes
- [ ] Plan de sauvegarde défini :
  - Option 1 : Export CSV hebdomadaire
  - Option 2 : Shell Render + téléchargement DB
  - Option 3 : Migration vers PostgreSQL (recommandé)

### Logs
- [ ] Savoir accéder aux logs Render (backend)
- [ ] Savoir accéder aux logs Render (frontend)
- [ ] Comprendre les messages d'erreur courants

---

## Documentation

### URLs Notées
```
Frontend : https://_________________________________.onrender.com
Backend  : https://_________________________________.onrender.com
Admin    : https://_________________________________.onrender.com/admin/
```

### Clés et Secrets (À GARDER SECRET)
```
Clé Admin : _______________________________________________
```

### Contacts Support
- Render Support : https://render.com/docs
- Netlify Support : https://docs.netlify.com
- Wave Support : (votre contact marchand)

---

## Performance

### Limitations Plan Gratuit

#### Render (Backend + Frontend)
- ⏱️ Mise en veille après 15 min d'inactivité (les deux services)
- ⏱️ Premier appel : ~30 secondes (réveil)
- 💾 750 heures/mois gratuites par service
- 💾 Static Sites : Bande passante illimitée

### Optimisations
- [ ] Monitoring pour garder l'API active (évite la mise en veille)
- [ ] Images optimisées (logo Wave, etc.)
- [ ] Considérer PostgreSQL pour persistance des données
- [ ] Considérer plan payant si trafic important :
  - Render Backend : $7/mois (pas de mise en veille)
  - Render Frontend : Gratuit (Static Sites toujours actifs)

---

## Plan de Rollback

En cas de problème critique :

### Rollback Backend (Render)
1. Aller dans **Dashboard** → **collecte-backend**
2. Onglet **"Events"**
3. Trouver le dernier déploiement fonctionnel
4. Cliquer sur **"Redeploy"**

### Rollback Frontend (Render)
1. Aller dans **Dashboard** → **collecte-frontend**
2. Onglet **"Events"**
3. Trouver le dernier déploiement fonctionnel
4. Cliquer sur **"Redeploy"****

### Rollback Git
```bash
# Annuler le dernier commit (sans perdre les changements)
git reset --soft HEAD~1

# Ou revenir à un commit spécifique
git reset --hard COMMIT_HASH
git push --force
```

---

## 🎉 Lancement Public

Quand tout est validé :

- [ ] Supprimer les inscriptions de test
- [ ] Vérifier une dernière fois tous les tests
- [ ] Préparer la communication :
  - Flyers avec lien du site
  - Posts réseaux sociaux
  - Message WhatsApp
- [ ] Avoir un plan de support :
  - Qui surveille les inscriptions ?
  - Qui valide les paiements Wave ?
  - Qui répond aux questions ?

### Contact pour les Inscriptions
- URL à partager : `https://VOTRE-FRONTEND.onrender.com`
- Montant : 10 000 F CFA
- Moyen de paiement : Wave Mobile Money

### Instructions pour les Utilisateurs
1. Aller sur le site
2. Remplir le formulaire
3. Cliquer sur "S'inscrire"
4. Noter la référence affichée
5. Cliquer sur "Payer avec Wave"
6. Effectuer le paiement
7. Prendre une capture d'écran
8. Attendre la confirmation par l'admin

---

**Checklist Version** : 1.0  
**Date** : 16 février 2026  
**Prochaine révision** : Après 1 semaine de production
