# 🔐 Configuration de l'Authentification Admin

## 📍 Fichier concerné
`frontend/admin/login.html` (lignes 239-242)

---

## ⚙️ Comment modifier les identifiants admin

### 1. Ouvrir le fichier
```
frontend/admin/login.html
```

### 2. Trouver la section ADMIN_CREDENTIALS (ligne ~239)
```javascript
// ⚠️ CREDENTIALS ADMIN - À MODIFIER PAR L'ADMINISTRATEUR
const ADMIN_CREDENTIALS = {
    matricule: 'ADMIN001',  // ← Modifier ici
    password: 'Admin@2026'   // ← Modifier ici
};
```

### 3. Modifier les valeurs
```javascript
const ADMIN_CREDENTIALS = {
    matricule: 'VOTRE_MATRICULE',     // Exemple: 'MAT-12345'
    password: 'VOTRE_MOT_DE_PASSE'    // Exemple: 'MonMotDePasse2026!'
};
```

---

## 🔒 Recommandations de sécurité

### Matricule (identifiant)
- ✅ Utiliser un format unique : `MAT-XXXXX` ou `ADMIN-XXX`
- ✅ Longueur minimum : 6 caractères
- ✅ Peut contenir lettres, chiffres, tirets
- ❌ Éviter les matricules évidents : `admin`, `root`, `test`

### Mot de passe
- ✅ Longueur minimum : 12 caractères
- ✅ Mélange de :
  - Majuscules (A-Z)
  - Minuscules (a-z)
  - Chiffres (0-9)
  - Caractères spéciaux (@, #, $, !, etc.)
- ✅ Exemples de mots de passe forts :
  - `SecureAdmin@2026!`
  - `P@ssw0rd!Collecte#2026`
  - `Admin$ecur!ty2026`
- ❌ Éviter :
  - Mots courants : `password`, `admin`, `123456`
  - Dates de naissance
  - Noms propres

---

## ⏱️ Durée de session

Par défaut : **2 heures** (7200000 ms)

Pour modifier (ligne ~245) :
```javascript
// Durée de session (en millisecondes)
const SESSION_DURATION = 2 * 60 * 60 * 1000;  // 2 heures

// Exemples :
// 1 heure  : 1 * 60 * 60 * 1000
// 4 heures : 4 * 60 * 60 * 1000
// 8 heures : 8 * 60 * 60 * 1000
```

---

## 🔄 Fonctionnement

### Page de login (`/admin/login.html`)
1. L'utilisateur entre son matricule et mot de passe
2. Vérification côté frontend (credentials stockés dans `login.html`)
3. Si correct : création d'une session dans `localStorage`
4. Redirection vers le dashboard (`index.html`)

### Dashboard (`/admin/index.html`)
1. Vérification automatique de la session au chargement
2. Si pas de session ou session expirée → redirection vers `login.html`
3. Si session valide → accès au dashboard
4. Affichage du matricule dans la navbar
5. Bouton "Déconnexion" pour détruire la session

### Session
- Stockée dans `localStorage` du navigateur
- Contient :
  - `authenticated`: true/false
  - `matricule`: identifiant de l'admin
  - `loginTime`: timestamp de connexion
  - `expiresAt`: timestamp d'expiration
- Détruite automatiquement après expiration
- Détruite manuellement via le bouton "Déconnexion"

---

## 🧪 Comment tester

### Test 1 : Accès direct au dashboard
1. Ouvrez `http://localhost:5500/admin/index.html` ou votre URL de production
2. ✅ Doit rediriger vers `login.html` (si pas connecté)

### Test 2 : Login avec mauvais credentials
1. Ouvrez `http://localhost:5500/admin/login.html`
2. Entrez un matricule ou mot de passe incorrect
3. ✅ Doit afficher une erreur "Matricule ou mot de passe incorrect"

### Test 3 : Login avec bons credentials
1. Ouvrez `http://localhost:5500/admin/login.html`
2. Entrez le bon matricule et mot de passe
3. ✅ Doit afficher "Connexion réussie !" et rediriger vers le dashboard

### Test 4 : Navigation après connexion
1. Connectez-vous
2. Vérifiez que le matricule s'affiche dans la navbar
3. Naviguez dans le dashboard
4. ✅ L'accès doit rester ouvert pendant 2 heures

### Test 5 : Déconnexion
1. Cliquez sur le bouton "Déconnexion" dans la navbar
2. Confirmez la déconnexion
3. ✅ Doit rediriger vers `login.html`
4. ✅ L'accès direct au dashboard doit être bloqué

### Test 6 : Expiration de session
1. Connectez-vous
2. **Modifier temporairement** `SESSION_DURATION` à `10000` (10 secondes) dans `login.html`
3. Attendez 10 secondes
4. Rechargez la page du dashboard
5. ✅ Doit rediriger vers `login.html` (session expirée)
6. **Rétablir** `SESSION_DURATION` à la valeur normale

---

## 🚀 Déploiement en production

### Avant de déployer :
1. ✅ Modifiez les credentials par défaut
2. ✅ Testez la connexion en local
3. ✅ Vérifiez que le matricule s'affiche correctement
4. ✅ Testez la déconnexion

### Après déploiement :
1. Testez immédiatement la page de login
2. Vérifiez que l'ancien lien direct `/admin/` redirige vers `/admin/login.html`
3. Notez les nouveaux identifiants dans un endroit sécurisé

---

## 📱 URLs importantes

### Développement local
- **Login** : `http://localhost:5500/admin/login.html`
- **Dashboard** : `http://localhost:5500/admin/index.html` (redirige vers login si pas authentifié)

### Production Render
- **Login** : `https://collecte-frontend.onrender.com/admin/login.html`
- **Dashboard** : `https://collecte-frontend.onrender.com/admin/index.html`

---

## ⚠️ Limitations actuelles

### Sécurité côté frontend uniquement
- ✅ Protection contre accès non autorisés basiques
- ✅ Session avec expiration automatique
- ⚠️ Les credentials sont stockés dans `login.html` (côté client)
- ⚠️ Un utilisateur technique pourrait voir le code source

### L'API backend reste protégée
- ✅ Toutes les routes admin nécessitent la clé `ADMIN_KEY` dans les headers
- ✅ Même avec accès au dashboard, impossible de modifier les données sans la vraie clé API
- ✅ Double protection : Login frontend + Authentication API backend

---

## 🔐 Amélioration future (optionnelle)

Pour une sécurité maximale, vous pourriez :
1. Ajouter une route `/api/admin/login` dans le backend
2. Stocker les credentials hachés en base de données
3. Générer des tokens JWT pour les sessions
4. Implémenter un système de rôles (super-admin, admin, etc.)

**Mais pour votre usage actuel (un seul admin), la solution actuelle est suffisante et efficace.**

---

## 💡 Identifiants par défaut actuels

⚠️ **À MODIFIER AVANT MISE EN PRODUCTION !**

```
Matricule : ADMIN001
Mot de passe : Admin@2026
```

**Ces valeurs sont dans le fichier `frontend/admin/login.html` lignes 239-242.**

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que `localStorage` n'est pas bloqué
3. Testez en navigation privée
4. Vérifiez que les credentials sont exactement identiques (sensible à la casse)

---

**Dernière mise à jour** : 17 février 2026  
**Version** : 1.0.0
