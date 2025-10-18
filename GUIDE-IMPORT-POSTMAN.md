# Guide d'Import des Données - Méthodes Multiples

## 🎯 3 Méthodes pour Importer les Données

### ✅ Méthode 1: Via la Page Admin (PLUS SIMPLE)

**C'est la méthode recommandée!**

1. **Connectez-vous en tant qu'admin**

   - URL: https://sn1325.vercel.app/auth/signin
   - Email: `admin@sn1325.cd`
   - Mot de passe: `admin123`

2. **Accédez à la page d'import**

   - URL: https://sn1325.vercel.app/dashboard/admin/import
   - Ou ajoutez un lien dans le menu admin

3. **Cliquez sur "Lancer l'Import"**

   - L'import se lance automatiquement
   - Vous verrez une barre de progression
   - Un message de succès apparaîtra à la fin

4. **C'est fait!**
   - Toutes les données sont maintenant dans MongoDB
   - L'utilisateur `ben@gmail.com` a été créé
   - Vous pouvez consulter les données dans le dashboard

---

### 📮 Méthode 2: Via Postman

#### Étape 1: Ouvrir Postman

- Téléchargez Postman si vous ne l'avez pas: https://www.postman.com/downloads/
- Lancez l'application

#### Étape 2: Créer une Nouvelle Requête

1. Cliquez sur **"New"** → **"HTTP Request"**
2. Ou utilisez le raccourci `Ctrl+N` (Windows) / `Cmd+N` (Mac)

#### Étape 3: Configurer la Requête

**URL:**

```
https://sn1325.vercel.app/api/import-old-data
```

**Méthode:**

- Changez de `GET` à **`POST`** dans le dropdown

**Headers:**

1. Cliquez sur l'onglet **"Headers"**
2. Ajoutez:
   ```
   Key: Content-Type
   Value: application/json
   ```

**Authentification (Important!):**

Vous devez être connecté en tant qu'admin. Il y a 2 façons:

**Option A: Avec Cookie de Session (Recommandé)**

1. Connectez-vous d'abord sur https://sn1325.vercel.app/auth/signin
2. Dans votre navigateur, ouvrez les DevTools (F12)
3. Allez dans l'onglet **"Application"** → **"Cookies"**
4. Copiez le cookie `next-auth.session-token`
5. Dans Postman, onglet **"Headers"**:
   ```
   Key: Cookie
   Value: next-auth.session-token=VOTRE_TOKEN_ICI
   ```

**Option B: En Local**
Si vous testez en local (`localhost:3000`):

1. Connectez-vous sur http://localhost:3000/auth/signin
2. Même processus pour récupérer le cookie
3. URL devient: `http://localhost:3000/api/import-old-data`

#### Étape 4: Body (Optionnel)

- Onglet **"Body"**
- Sélectionnez **"raw"**
- Sélectionnez **"JSON"** dans le dropdown
- Vous pouvez laisser vide: `{}`

#### Étape 5: Lancer la Requête

1. Cliquez sur le bouton bleu **"Send"**
2. Attendez la réponse (peut prendre 1-5 minutes)

#### Étape 6: Vérifier la Réponse

**Succès (Status 200):**

```json
{
  "success": true,
  "message": "Import des données réalisé avec succès",
  "data": {
    "success": true
  }
}
```

**Erreur - Non authentifié (Status 401):**

```json
{
  "error": "Non authentifié"
}
```

→ Solution: Ajoutez le cookie de session

**Erreur - Pas admin (Status 403):**

```json
{
  "error": "Accès refusé. Réservé aux administrateurs."
}
```

→ Solution: Connectez-vous avec admin@sn1325.cd

**Erreur - Problème d'import (Status 500):**

```json
{
  "error": "Erreur lors de l'import des données",
  "details": "..."
}
```

→ Solution: Vérifiez les logs, le dossier OldData, la connexion MongoDB

---

### 🖥️ Méthode 3: Via cURL (Terminal)

Si vous préférez la ligne de commande:

#### En Local:

```bash
# 1. D'abord, récupérez le cookie après connexion
# Connectez-vous sur localhost:3000/auth/signin
# Puis copiez le cookie depuis les DevTools

# 2. Lancez la commande
curl -X POST http://localhost:3000/api/import-old-data \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=VOTRE_TOKEN_ICI" \
  -d '{}'
```

#### En Production:

```bash
curl -X POST https://sn1325.vercel.app/api/import-old-data \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=VOTRE_TOKEN_ICI" \
  -d '{}'
```

---

## 📸 Captures d'Écran Postman (Configuration Visuelle)

### Vue d'ensemble de la requête:

```
┌─────────────────────────────────────────────────────────┐
│ POST ▼  https://sn1325.vercel.app/api/import-old-data │
│                                                [Send]    │
├─────────────────────────────────────────────────────────┤
│ Params | Authorization | Headers | Body | ...          │
├─────────────────────────────────────────────────────────┤
│ Headers:                                                │
│ ┌─────────────────────┬─────────────────────────────┐  │
│ │ KEY                 │ VALUE                       │  │
│ ├─────────────────────┼─────────────────────────────┤  │
│ │ Content-Type   [✓]  │ application/json            │  │
│ │ Cookie         [✓]  │ next-auth.session-token=... │  │
│ └─────────────────────┴─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Vérification Post-Import

Après l'import, vérifiez que tout est bien importé:

### 1. Dans MongoDB (si vous avez accès)

```javascript
// Compter les documents
db.axes.countDocuments(); // Devrait être 6
db.grandecategories.countDocuments(); // Devrait être 11
db.categories.countDocuments(); // Devrait être 19
db.provinces.countDocuments(); // Devrait être 26
db.indicateurs.countDocuments(); // Devrait être ~40
db.datanumerics.countDocuments(); // Dépend de vos données
db.dataqualitatives.countDocuments(); // Dépend de vos données

// Vérifier l'utilisateur ben
db.users.findOne({ email: "ben@gmail.com" });
```

### 2. Via l'Interface (Quand les pages seront créées)

- Consultez `/dashboard/referentiel/axes` → devrait afficher 6 axes
- Consultez `/dashboard/referentiel/indicateurs` → devrait afficher ~40 indicateurs
- etc.

### 3. Tester la Connexion de Ben

1. Déconnectez-vous
2. Connectez-vous avec:
   - Email: `ben@gmail.com`
   - Mot de passe: `12345`
3. Vérifiez que vous avez accès en **lecture seule**

---

## 🔧 Dépannage

### Problème: "Non authentifié"

**Cause**: Cookie de session manquant ou expiré  
**Solution**:

1. Reconnectez-vous sur le site
2. Récupérez un nouveau cookie de session
3. Réessayez

### Problème: "Accès refusé"

**Cause**: Vous n'êtes pas connecté en tant qu'admin  
**Solution**:

1. Vérifiez que vous utilisez `admin@sn1325.cd`
2. Vérifiez le cookie de la bonne session

### Problème: Import très lent

**Cause**: Beaucoup de données à importer  
**Solution**:

- C'est normal, attendez 2-5 minutes
- Ne fermez pas la page/Postman pendant l'import

### Problème: Doublons

**Cause**: Import lancé plusieurs fois  
**Solution**:

- Les doublons sont automatiquement ignorés grâce aux index uniques
- Pas de souci si vous relancez l'import

### Problème: Erreur MongoDB

**Cause**: Connexion à MongoDB échoue  
**Solution**:

1. Vérifiez `MONGODB_URI` dans `.env.local`
2. Vérifiez que MongoDB Atlas est accessible
3. Vérifiez les credentials MongoDB

---

## 📝 Logs de l'Import

L'import affiche des logs détaillés dans la console:

```
🚀 Démarrage de l'import des données...

📊 Import des Axes...
  ✓ Axe créé: Prévention
  ✓ Axe créé: Participation
  ...
✅ 6 axes importés

📊 Import des Grandes Catégories...
  ✓ Grande Catégorie créée: Finances
  ...
✅ 11 grandes catégories importées

...

✅ Import terminé avec succès!

📊 Résumé:
  - 6 axes
  - 11 grandes catégories
  - 19 catégories
  - ... (etc.)
```

---

## 🎉 Succès!

Une fois l'import terminé avec succès:

1. ✅ Toutes les données sont dans MongoDB
2. ✅ Utilisateur `ben@gmail.com` créé (mot de passe: `12345`)
3. ✅ Vous pouvez commencer à utiliser l'application
4. ✅ Les données sont prêtes à être consultées

**Prochaines étapes**:

- Créer les pages de visualisation des données
- Créer les pages CRUD admin
- Tester avec l'utilisateur ben@gmail.com

---

## 🔗 Liens Utiles

- **Page d'import**: https://sn1325.vercel.app/dashboard/admin/import
- **Login**: https://sn1325.vercel.app/auth/signin
- **Dashboard**: https://sn1325.vercel.app/dashboard
- **API Endpoint**: https://sn1325.vercel.app/api/import-old-data

---

**Questions?** Consultez les logs dans la console ou vérifiez MongoDB directement.
