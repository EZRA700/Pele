# 🚀 Script de Vérification Pré-Déploiement
# Collecte Communautaire - Backend sur Render + Frontend sur Netlify

Write-Host "`n╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🚀 VÉRIFICATION PRÉ-DÉPLOIEMENT - COLLECTE COMMUNAUTAIRE     ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$errors = 0
$warnings = 0

# Fonction pour afficher les résultats
function Check-Item {
    param($message, $test, $isWarning = $false)
    if ($test) {
        Write-Host "  ✅ $message" -ForegroundColor Green
    } else {
        if ($isWarning) {
            Write-Host "  ⚠️  $message" -ForegroundColor Yellow
            $script:warnings++
        } else {
            Write-Host "  ❌ $message" -ForegroundColor Red
            $script:errors++
        }
    }
}

# === 1. STRUCTURE DES FICHIERS ===
Write-Host "📁 1. Vérification de la Structure des Fichiers" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

Check-Item "Dossier backend existe" (Test-Path ".\backend")
Check-Item "Dossier frontend existe" (Test-Path ".\frontend")
Check-Item "backend/package.json existe" (Test-Path ".\backend\package.json")
Check-Item "backend/server.js existe" (Test-Path ".\backend\server.js")
Check-Item "frontend/index.html existe" (Test-Path ".\frontend\index.html")
Check-Item "frontend/admin/index.html existe" (Test-Path ".\frontend\admin\index.html")
Check-Item "frontend/netlify.toml existe" (Test-Path ".\frontend\netlify.toml")

# === 2. FICHIERS DE CONFIGURATION ===
Write-Host "`n📝 2. Vérification des Fichiers de Configuration" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

$envExists = Test-Path ".\backend\.env"
$envExampleExists = Test-Path ".\backend\.env.example"
$gitignoreBackendExists = Test-Path ".\backend\.gitignore"
$gitignoreFrontendExists = Test-Path ".\frontend\.gitignore"

Check-Item "backend/.env.example existe (référence)" $envExampleExists
Check-Item "backend/.env existe (local)" $envExists $true
Check-Item "backend/.gitignore existe" $gitignoreBackendExists
Check-Item "frontend/.gitignore existe" $gitignoreFrontendExists

# === 3. VÉRIFICATION GITIGNORE ===
Write-Host "`n🔒 3. Vérification Sécurité GitIgnore" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

if ($gitignoreBackendExists) {
    $gitignoreContent = Get-Content ".\backend\.gitignore" -Raw
    Check-Item ".env dans .gitignore backend" ($gitignoreContent -match "\.env")
    Check-Item "database/ dans .gitignore backend" ($gitignoreContent -match "database/")
    Check-Item "node_modules/ dans .gitignore backend" ($gitignoreContent -match "node_modules")
} else {
    Write-Host "  ⚠️  Impossible de vérifier .gitignore backend (fichier manquant)" -ForegroundColor Yellow
    $warnings++
}

# === 4. PACKAGE.JSON BACKEND ===
Write-Host "`n📦 4. Vérification Backend Package.json" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

if (Test-Path ".\backend\package.json") {
    $packageJson = Get-Content ".\backend\package.json" -Raw | ConvertFrom-Json
    
    Check-Item "Script 'start' défini" ($null -ne $packageJson.scripts.start)
    Check-Item "Dépendance 'express'" ($null -ne $packageJson.dependencies.express)
    Check-Item "Dépendance 'sqlite3'" ($null -ne $packageJson.dependencies.sqlite3)
    Check-Item "Dépendance 'cors'" ($null -ne $packageJson.dependencies.cors)
    Check-Item "Dépendance 'helmet'" ($null -ne $packageJson.dependencies.helmet)
    Check-Item "Dépendance 'dotenv'" ($null -ne $packageJson.dependencies.dotenv)
    Check-Item "Version Node.js >= 18" ($packageJson.engines.node -match ">=\s*18")
}

# === 5. CONFIGURATION FRONTEND ===
Write-Host "`n🌐 5. Vérification Frontend Config" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

if (Test-Path ".\frontend\assets\js\config.js") {
    $configContent = Get-Content ".\frontend\assets\js\config.js" -Raw
    
    $hasApiUrl = $configContent -match "API_URL\s*:"
    $hasAdminKey = $configContent -match "ADMIN_KEY\s*:"
    $hasWaveUrl = $configContent -match "WAVE_PAYMENT_URL\s*:"
    
    Check-Item "API_URL configuré" $hasApiUrl
    Check-Item "ADMIN_KEY configuré" $hasAdminKey
    Check-Item "WAVE_PAYMENT_URL configuré" $hasWaveUrl
    
    # Vérifier si encore en localhost (warning)
    $isLocalhost = $configContent -match "localhost|127\.0\.0\.1"
    if ($isLocalhost) {
        Write-Host "  ⚠️  API_URL pointe vers localhost (à changer pour production)" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "  ✅ API_URL ne pointe pas vers localhost" -ForegroundColor Green
    }
}

# === 6. VÉRIFICATION GIT ===
Write-Host "`n🔀 6. Vérification Git" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

$isGitRepo = Test-Path ".git"
Check-Item "Repository Git initialisé" $isGitRepo

if ($isGitRepo) {
    # Vérifier s'il y a un remote
    $gitRemote = git remote -v 2>$null
    $hasRemote = $gitRemote -ne $null -and $gitRemote.Length -gt 0
    Check-Item "Remote Git configuré (GitHub)" $hasRemote
    
    # Vérifier s'il y a des changements non commités
    $gitStatus = git status --porcelain 2>$null
    $hasUncommitted = $gitStatus -ne $null -and $gitStatus.Length -gt 0
    if ($hasUncommitted) {
        Write-Host "  ⚠️  Il y a des changements non commités" -ForegroundColor Yellow
        $warnings++
        Write-Host "`n      Fichiers modifiés:" -ForegroundColor Gray
        git status --short | ForEach-Object {
            Write-Host "      $_" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ✅ Tous les changements sont commités" -ForegroundColor Green
    }
}

# === 7. DÉPENDANCES NODE.JS ===
Write-Host "`n📚 7. Vérification des Dépendances" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

$backendNodeModules = Test-Path ".\backend\node_modules"
Check-Item "node_modules backend installé" $backendNodeModules $true

# === 8. TESTS SYNTAXE (si Node.js disponible) ===
Write-Host "`n✨ 8. Vérification Syntaxe JavaScript" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "  ✅ Node.js installé : $nodeVersion" -ForegroundColor Green
        
        # Test syntaxe backend/server.js
        $syntaxCheck = node --check ".\backend\server.js" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ backend/server.js : syntaxe valide" -ForegroundColor Green
        } else {
            Write-Host "  ❌ backend/server.js : erreur de syntaxe" -ForegroundColor Red
            $errors++
        }
    } else {
        Write-Host "  ⚠️  Node.js non détecté" -ForegroundColor Yellow
        $warnings++
    }
} catch {
    Write-Host "  ⚠️  Impossible de vérifier Node.js" -ForegroundColor Yellow
    $warnings++
}

# === 9. RECOMMANDATIONS POUR RENDER ===
Write-Host "`n🖥️  9. Checklist Render (Backend)" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

Write-Host "  Configuration recommandée:" -ForegroundColor Cyan
Write-Host "    • Type: Web Service" -ForegroundColor White
Write-Host "    • Runtime: Node" -ForegroundColor White
Write-Host "    • Branch: main" -ForegroundColor White
Write-Host "    • Root Directory: backend" -ForegroundColor White
Write-Host "    • Build Command: npm install" -ForegroundColor White
Write-Host "    • Start Command: npm start" -ForegroundColor White
Write-Host "    • Instance Type: Free" -ForegroundColor White

Write-Host "`n  Variables d'environnement à configurer:" -ForegroundColor Cyan
Write-Host "    • ADMIN_SECRET_KEY (clé sécurisée 32+ caractères)" -ForegroundColor White
Write-Host "    • PORT=3003" -ForegroundColor White
Write-Host "    • NODE_ENV=production" -ForegroundColor White
Write-Host "    • ALLOWED_ORIGINS=https://VOTRE-SITE.netlify.app" -ForegroundColor White
Write-Host "    • DB_PATH=./database/collecte.db" -ForegroundColor White

# === 10. RECOMMANDATIONS POUR NETLIFY ===
Write-Host "`n🌐 10. Checklist Netlify (Frontend)" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

Write-Host "  Configuration recommandée:" -ForegroundColor Cyan
Write-Host "    • Branch: main" -ForegroundColor White
Write-Host "    • Base Directory: frontend" -ForegroundColor White
Write-Host "    • Build Command: (laisser vide)" -ForegroundColor White
Write-Host "    • Publish Directory: ." -ForegroundColor White

Write-Host "`n  Fichiers importants:" -ForegroundColor Cyan
if (Test-Path ".\frontend\netlify.toml") {
    Write-Host "    ✅ netlify.toml présent" -ForegroundColor Green
} else {
    Write-Host "    ❌ netlify.toml manquant" -ForegroundColor Red
    $errors++
}

# === 11. GÉNÉRATION DE CLÉ ADMIN ===
Write-Host "`n🔑 11. Génération de Clé Admin Sécurisée" -ForegroundColor Yellow
Write-Host "   ════════════════════════════════════════════════`n" -ForegroundColor Yellow

Write-Host "  Exécutez cette commande pour générer une clé:" -ForegroundColor Cyan
Write-Host "    node -e `"console.log(require('crypto').randomBytes(32).toString('hex'))`"`n" -ForegroundColor White

try {
    $newKey = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" 2>$null
    if ($newKey) {
        Write-Host "  Exemple de clé générée (à utiliser):" -ForegroundColor Green
        Write-Host "    $newKey`n" -ForegroundColor Yellow
        Write-Host "  ⚠️  COPIEZ CETTE CLÉ ET UTILISEZ-LA POUR:" -ForegroundColor Red
        Write-Host "    • Variable ADMIN_SECRET_KEY sur Render" -ForegroundColor White
        Write-Host "    • Constante ADMIN_KEY dans frontend/assets/js/config.js`n" -ForegroundColor White
    }
} catch {
    Write-Host "  ⚠️  Impossible de générer la clé automatiquement" -ForegroundColor Yellow
}

# === RÉSUMÉ ===
Write-Host "`n╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                        📊 RÉSUMÉ DE LA VÉRIFICATION                ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "  🎉 PARFAIT ! Aucun problème détecté." -ForegroundColor Green
    Write-Host "  ✅ Votre projet est prêt pour le déploiement !`n" -ForegroundColor Green
} elseif ($errors -eq 0) {
    Write-Host "  ✅ Aucune erreur critique" -ForegroundColor Green
    Write-Host "  ⚠️  $warnings avertissement(s)" -ForegroundColor Yellow
    Write-Host "  👍 Vous pouvez déployer, mais vérifiez les avertissements`n" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ $errors erreur(s) détectée(s)" -ForegroundColor Red
    Write-Host "  ⚠️  $warnings avertissement(s)" -ForegroundColor Yellow
    Write-Host "  🛑 Corrigez les erreurs avant de déployer`n" -ForegroundColor Red
}

# === PROCHAINES ÉTAPES ===
Write-Host "╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║                      📝 PROCHAINES ÉTAPES                          ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Magenta

Write-Host "  1️⃣  Consultez le guide détaillé:" -ForegroundColor Cyan
Write-Host "     📄 GUIDE-DEPLOIEMENT-PRODUCTION.md`n" -ForegroundColor White

Write-Host "  2️⃣  Utilisez la checklist:" -ForegroundColor Cyan
Write-Host "     ✅ CHECKLIST-DEPLOIEMENT.md`n" -ForegroundColor White

Write-Host "  3️⃣  Commandez et poussez sur GitHub:" -ForegroundColor Cyan
Write-Host "     git add ." -ForegroundColor White
Write-Host "     git commit -m `"Prêt pour production`"" -ForegroundColor White
Write-Host "     git push`n" -ForegroundColor White

Write-Host "  4️⃣  Déployez sur Render (Backend):" -ForegroundColor Cyan
Write-Host "     🔗 https://dashboard.render.com`n" -ForegroundColor White

Write-Host "  5️⃣  Déployez sur Netlify (Frontend):" -ForegroundColor Cyan
Write-Host "     🔗 https://app.netlify.com`n" -ForegroundColor White

Write-Host "  6️⃣  Mettez à jour frontend/assets/js/config.js:" -ForegroundColor Cyan
Write-Host "     • API_URL avec l'URL Render" -ForegroundColor White
Write-Host "     • ADMIN_KEY avec la clé générée`n" -ForegroundColor White

Write-Host "  7️⃣  Testez en production !`n" -ForegroundColor Cyan

Write-Host "╔═══════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                   🚀 BONNE CHANCE POUR LE DÉPLOIEMENT !           ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
