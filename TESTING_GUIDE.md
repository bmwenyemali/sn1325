# Guide de Test - SN1325

## ✅ Vérifications Techniques Effectuées

### 1. Configuration Tailwind CSS ✓

- **Config**: `tailwind.config.ts` contient les couleurs RDC
- **CSS File**: Le fichier `/_next/static/css/app/layout.css` est servi avec succès (HTTP 200)
- **Compilation**: Les couleurs personnalisées sont bien compilées dans le CSS:
  ```css
  --bleu-rdc: #002b7f;
  --jaune-rdc: #fcd116;
  --rouge-rdc: #ce1126;
  .bg-bleu-rdc {
    ...;
  }
  .text-bleu-rdc {
    ...;
  }
  .border-bleu-rdc {
    ...;
  }
  ```
- **HTML**: Les classes Tailwind sont présentes dans le HTML généré

### 2. NextAuth Session ✓

- **Endpoint**: `/api/auth/session` fonctionne (retourne 200 avec null quand non authentifié)
- **Configuration**: `auth.ts` suit le pattern NextAuth v5 beta
- **Handlers**: Exportés correctement dans le route handler

### 3. Base de Données MongoDB ✓

- **Connexion**: MongoDB Atlas connecté
- **Données**: Base initialisée avec:
  - 5 Axes (PART, PROT, PREV, RELV, COORD)
  - 26 Provinces
  - 4 Privileges
  - 1 Role admin
  - 1 Utilisateur admin
  - 7 Données d'exemple

## 🧪 Tests à Effectuer dans le Navigateur

### Test 1: Page d'Accueil

1. Ouvrir http://localhost:3000
2. **Vérifier**:
   - [ ] Les couleurs RDC sont appliquées (bleu, jaune, rouge)
   - [ ] Le header avec logo SN1325 s'affiche
   - [ ] Le footer avec les partenaires s'affiche
   - [ ] Les sections sont bien stylées
   - [ ] Le bouton "Se connecter" est visible

### Test 2: Page de Connexion

1. Cliquer sur "Se connecter" ou aller à http://localhost:3000/auth/signin
2. **Vérifier**:
   - [ ] Le formulaire de connexion s'affiche
   - [ ] Le logo SN1325 est centré
   - [ ] Les champs email et mot de passe sont stylés
   - [ ] Le bouton "Se connecter" a le style bleu RDC
   - [ ] Les informations de compte par défaut sont affichées
   - [ ] Le gradient de fond est visible (bleu foncé)

### Test 3: Connexion avec Admin

1. Sur la page `/auth/signin`, entrer:
   - **Email**: `admin@sn1325.cd`
   - **Mot de passe**: `admin123`
2. Cliquer sur "Se connecter"
3. **Vérifier**:
   - [ ] Pas de message d'erreur
   - [ ] Redirection automatique vers `/dashboard`
   - [ ] Le dashboard s'affiche
   - [ ] Le nom de l'utilisateur apparaît (Admin SN1325)

### Test 4: Dashboard

Une fois connecté, sur `/dashboard`:

1. **Vérifier l'affichage**:

   - [ ] Le header montre l'utilisateur connecté
   - [ ] Les cartes de statistiques s'affichent (4 cartes)
   - [ ] La section "Activités récentes" est visible
   - [ ] La section "Actions rapides" avec 4 boutons s'affiche

2. **Tester les liens** (certains peuvent ne pas exister encore):
   - [ ] "Saisir des données" → `/dashboard/donnees/saisie`
   - [ ] "Valider les données" → `/dashboard/donnees/validation`
   - [ ] "Voir toutes les données" → `/dashboard/donnees/liste`
   - [ ] "Générer un rapport" → `/dashboard/rapports`

### Test 5: Navigation

1. **Dans le Header**:

   - [ ] Cliquer sur le logo → retour à l'accueil
   - [ ] "À propos" → scroll vers section #about
   - [ ] "Statistiques" → scroll vers section #stats
   - [ ] "Axes Stratégiques" → scroll vers section #axes
   - [ ] "Tableau de bord" → `/dashboard` (si connecté)

2. **Dans le Footer**:
   - [ ] Liens externes (ONU, Ministère) s'ouvrent dans un nouvel onglet
   - [ ] Les logos des partenaires s'affichent

### Test 6: Déconnexion

1. Sur le dashboard, chercher le bouton de déconnexion
2. **Vérifier**:
   - [ ] Redirection vers la page d'accueil
   - [ ] Impossible d'accéder au dashboard sans reconnexion
   - [ ] Le header ne montre plus l'utilisateur

## ⚠️ Problèmes Possibles et Solutions

### Problème: Les styles ne s'appliquent pas

**Solutions**:

1. **Hard refresh du navigateur**: `Ctrl + Shift + R` (ou `Cmd + Shift + R` sur Mac)
2. **Vider le cache**:
   - Chrome: F12 → Network → Cocher "Disable cache"
   - Firefox: F12 → Network → Cocher "Disable HTTP Cache"
3. **Vérifier la console navigateur**: F12 → Console (chercher les erreurs CSS)

### Problème: Erreur 404 sur certaines pages

**Cause**: Pages pas encore créées
**Pages manquantes à créer**:

- `/dashboard/donnees/saisie`
- `/dashboard/donnees/validation`
- `/dashboard/donnees/liste`
- `/dashboard/rapports`
- `/dashboard/profil`

### Problème: Login ne fonctionne pas

**Vérifications**:

1. Ouvrir la console navigateur (F12)
2. Regarder l'onglet Network pendant la connexion
3. Vérifier la réponse de `/api/auth/callback/credentials`
4. Si erreur, noter le message et le code d'erreur

### Problème: Session perdue après refresh

**Vérifications**:

1. Les cookies NextAuth sont-ils créés? (F12 → Application → Cookies)
2. Chercher: `next-auth.session-token` ou `__Secure-next-auth.session-token`
3. Si absent, problème avec la configuration NextAuth

## 📊 Checklist de Test Complet

### Pré-requis

- [ ] Serveur de développement lancé (`npm run dev`)
- [ ] MongoDB Atlas accessible
- [ ] Variables d'environnement définies
- [ ] Cache navigateur vidé

### Tests Fonctionnels

- [ ] Page d'accueil charge et est stylée
- [ ] Page de connexion charge et est stylée
- [ ] Connexion avec admin réussit
- [ ] Redirection vers dashboard après login
- [ ] Dashboard affiche les données
- [ ] Navigation dans le header fonctionne
- [ ] Navigation dans le footer fonctionne
- [ ] Déconnexion fonctionne

### Tests Visuels

- [ ] Couleurs RDC appliquées (bleu #002B7F, jaune #FCD116, rouge #CE1126)
- [ ] Logo SN1325 s'affiche partout
- [ ] Logos des partenaires (ONU Femmes, Ministère, Norvège) s'affichent
- [ ] Responsive design (tester sur mobile)
- [ ] Pas de texte tronqué ou mal aligné

### Tests de Sécurité

- [ ] Impossible d'accéder au dashboard sans connexion
- [ ] Redirection automatique vers `/auth/signin` si non authentifié
- [ ] Le mot de passe ne s'affiche pas en clair
- [ ] Les tokens de session sont sécurisés

## 🚀 Prochaines Étapes Après Tests

### Si tous les tests passent:

1. **Créer les pages CRUD manquantes**
2. **Implémenter les fonctionnalités de saisie/validation**
3. **Tester à nouveau**
4. **Commit et push vers GitHub**
5. **Vérifier le déploiement automatique sur Vercel**
6. **Tester en production**

### Si certains tests échouent:

1. **Noter tous les problèmes observés**
2. **Faire des captures d'écran**
3. **Copier les erreurs de la console**
4. **Créer une liste de bugs à corriger**

## 📝 Template de Rapport de Bug

```markdown
### Bug: [Titre court]

**URL**: http://localhost:3000/...
**Navigateur**: Chrome/Firefox/... version X
**Reproduire**:

1. Étape 1
2. Étape 2
3. Étape 3

**Résultat attendu**: Ce qui devrait se passer
**Résultat observé**: Ce qui se passe réellement
**Erreur console**: (copier/coller)
**Capture d'écran**: (si possible)
```

## 💡 Conseils

1. **Tester sur plusieurs navigateurs**: Chrome, Firefox, Edge
2. **Tester en mode responsive**: F12 → Toggle device toolbar
3. **Garder la console ouverte**: Pour voir les erreurs en temps réel
4. **Tester les cas limites**: Champs vides, mauvais mot de passe, etc.
5. **Prendre des notes**: Documenter tout problème observé

---

**Date du guide**: 16 Janvier 2025
**Version de l'app**: Pre-production
**Status**: Prêt pour tests manuels
