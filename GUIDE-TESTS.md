# 🧪 Guide de Test - Collecte Communautaire

## ✅ État actuel

### Backend ✅
- **Serveur:** Démarré sur http://localhost:3003
- **Base de données:** SQLite initialisée avec 4 soumissions de test
- **Clé admin:** Configurée et fonctionnelle
- **CORS:** Autorise http://localhost:5500

### Frontend ✅
- **Serveur:** Démarré sur http://localhost:5500
- **Configuration:** Connecté au backend local
- **Clé admin:** Synchronisée avec le backend

---

## 🎯 Tests à effectuer

### 1️⃣ Test du formulaire public

**URL:** http://localhost:5500/index.html

**Scénario:**
1. Remplir le formulaire avec vos informations
2. Choisir un montant ou taper un montant personnalisé
3. Sélectionner un moyen de paiement (Wave, Orange, MTN, Moov)
4. Soumettre le formulaire
5. Vérifier la redirection vers la page de confirmation
6. Noter la référence générée (ex: REF-20260215-XXXX)
7. Copier le numéro de paiement
8. Saisir un code de transaction de test (ex: WV123456789)

**Résultat attendu:**
- ✅ Formulaire se soumet sans erreur
- ✅ Redirection vers confirmation.html
- ✅ Instructions de paiement affichées
- ✅ Référence visible et copiable
- ✅ Code de transaction enregistré

---

### 2️⃣ Test du dashboard admin

**URL:** http://localhost:5500/admin/index.html

**Scénario:**
1. Ouvrir le dashboard admin
2. Vérifier que les statistiques s'affichent
   - Total de soumissions (devrait être 4 ou plus)
   - Total collecté: 180 000 F CFA (ou plus si vous avez ajouté des soumissions)
3. Vérifier les graphiques:
   - **Graphique statuts:** Toutes les soumissions sont "En attente"
   - **Graphique moyens de paiement:** Répartition entre Wave, Orange, MTN, Moov
4. Consulter le tableau des soumissions
5. Cliquer sur "Détails" d'une soumission
6. Valider une soumission (bouton "Valider")
7. Vérifier que le statut change en "Confirmé"
8. Tester l'export CSV
9. Tester les filtres (par statut, par moyen de paiement)
10. Tester la recherche par nom ou référence

**Résultat attendu:**
- ✅ Dashboard charge sans erreur
- ✅ Statistiques affichées correctement
- ✅ 3 graphiques visibles (Chart.js)
- ✅ Tableau avec pagination et tri (DataTables)
- ✅ Actions fonctionnent (Valider, Rejeter, Annuler)
- ✅ Export CSV télécharge un fichier
- ✅ Filtres et recherche fonctionnent

---

### 3️⃣ Test des API endpoints (PowerShell)

#### Health check
```powershell
curl http://localhost:3003/health -UseBasicParsing
```

#### Créer une soumission
```powershell
$body = @{
    nom_complet = "Test User"
    telephone = "0712345678"
    email = "test@example.com"
    quartier = "Plateau"
    type_contribution = "don"
    description = "Test"
    montant = 10000
    moyen_paiement = "wave"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3003/api/soumissions" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

#### Récupérer une soumission par référence
```powershell
curl "http://localhost:3003/api/soumissions/REF-20260215-7199" -UseBasicParsing
```

#### Récupérer les stats (authentifié)
```powershell
$headers = @{
    'x-admin-key' = '39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3'
}

Invoke-WebRequest -Uri "http://localhost:3003/api/stats" `
    -Method GET `
    -Headers $headers `
    -UseBasicParsing
```

#### Lister les soumissions (admin)
```powershell
$headers = @{
    'x-admin-key' = '39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3'
}

Invoke-WebRequest -Uri "http://localhost:3003/api/admin/soumissions" `
    -Method GET `
    -Headers $headers `
    -UseBasicParsing
```

#### Valider une soumission (admin)
```powershell
$headers = @{
    'x-admin-key' = '39f33f4034fbacf126bf805fb9922059aa19457d51b7637a3a16f34ffda3c7f3'
}
$body = @{
    statut = "confirme"
    note_admin = "Paiement vérifié"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3003/api/admin/soumissions/1/statut" `
    -Method PUT `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

---

## 📊 Données de test disponibles

### Soumissions créées:
1. **Kouassi Jean-Pierre** - 50 000 F CFA - Wave
2. **Aya Marie** - 25 000 F CFA - MTN Money
3. **Koffi Bernard** - 75 000 F CFA - Moov Money
4. **Adjoua Christelle** - 30 000 F CFA - Orange Money

**Total:** 180 000 F CFA

---

## 🔍 Points à vérifier

### Frontend
- [ ] Pages se chargent sans erreur 404
- [ ] CSS Bootstrap appliqué correctement
- [ ] JavaScript fonctionne (pas d'erreur console)
- [ ] Formulaires soumettent correctement
- [ ] Appels API réussissent (vérifier Network tab)
- [ ] Messages d'erreur/succès s'affichent
- [ ] Navigation entre pages fonctionne
- [ ] Design responsive (tester sur mobile)

### Backend
- [ ] Serveur démarre sans erreur
- [ ] Base de données se crée automatiquement
- [ ] CORS autorise le frontend
- [ ] Validation des données fonctionne
- [ ] Authentification admin bloque sans clé
- [ ] Logs s'affichent en développement
- [ ] Rate limiting fonctionne (150/heure)

### Intégration
- [ ] Frontend communique avec le backend
- [ ] Erreurs backend affichées côté frontend
- [ ] Données persistent après refresh
- [ ] Références uniques générées
- [ ] Statistiques se mettent à jour

---

## 🐛 Résolution de problèmes

### Erreur CORS
**Symptôme:** "Origin not allowed"
**Solution:** Vérifier que `ALLOWED_ORIGINS` dans `.env` contient `http://localhost:5500`

### API non joignable
**Symptôme:** "Failed to fetch"
**Solution:** 
1. Vérifier que le backend tourne sur port 3003
2. Vérifier `API_URL` dans `frontend/assets/js/config.js`

### Charts ne s'affichent pas
**Symptôme:** Dashboard vide
**Solution:** Ouvrir la console (F12), vérifier les erreurs JavaScript

### Clé admin invalide
**Symptôme:** "Configuration serveur incorrecte"
**Solution:** Générer une nouvelle clé et mettre à jour `.env` ET `config.js`

---

## 📝 Prochaine étape: Déploiement

Une fois les tests locaux validés:

1. **Backend Render.com:**
   - Push code vers GitHub
   - Créer Web Service sur Render
   - Configurer les variables d'environnement
   - Déployer

2. **Frontend Netlify:**
   - Mettre à jour `API_URL` avec l'URL Render
   - Drag & drop du dossier `frontend/`
   - Configurer domaine personnalisé (optionnel)

3. **Backend final:**
   - Ajouter l'URL Netlify dans `ALLOWED_ORIGINS`
   - Re-déployer

---

## ✅ Checklist de validation

- [ ] ✅ Backend démarre sur port 3003
- [ ] ✅ Frontend accessible sur port 5500
- [ ] ✅ Formulaire public fonctionne
- [ ] ✅ Page confirmation affiche instructions
- [ ] ✅ Dashboard admin authentifié
- [ ] ✅ Statistiques affichées
- [ ] ✅ Graphiques visibles
- [ ] ✅ CRUD soumissions fonctionne
- [ ] ✅ Export CSV télécharge
- [ ] ✅ Aucune erreur console

**Bon test ! 🚀**
