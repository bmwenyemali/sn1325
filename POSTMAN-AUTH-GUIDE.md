# 🔐 Guide Authentification Postman - SN1325

## Problème Résolu ✅

**Erreur 401** : L'API `/api/import-old-data` nécessite une authentification admin avec NextAuth.

---

## 🎯 Solution Recommandée: Page Web Admin

**La façon la PLUS SIMPLE** d'importer les données est d'utiliser la page web :

👉 **https://sn1325.vercel.app/dashboard/admin/import**

1. Connectez-vous avec `admin@sn1325.cd` / `admin123`
2. Cliquez sur le bouton "Lancer l'Import"
3. ✅ Terminé!

---

## 📝 Si vous préférez Postman (Méthode Avancée)

### Étape 1: Obtenir le Cookie de Session

#### Option A: Via le Navigateur (RECOMMANDÉ)

1. **Connectez-vous sur le site**

   - Allez sur: https://sn1325.vercel.app/auth/signin
   - Email: `admin@sn1325.cd`
   - Mot de passe: `admin123`
   - Cliquez sur "Se connecter"

2. **Extraire le cookie de session**

   - Appuyez sur `F12` pour ouvrir DevTools
   - Allez dans l'onglet **"Application"** (Chrome) ou **"Storage"** (Firefox)
   - Dans le menu de gauche, cliquez sur **"Cookies"**
   - Cliquez sur `https://sn1325.vercel.app`
   - Cherchez le cookie: `next-auth.session-token` ou `__Secure-next-auth.session-token`
   - **Copiez la valeur complète** (longue chaîne de caractères)

   ```
   Exemple:
   Nom: next-auth.session-token
   Valeur: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M...
   ```

3. **Notes importantes**:
   - Le cookie peut s'appeler `next-auth.session-token` OU `__Secure-next-auth.session-token` selon l'environnement
   - Si vous voyez les deux, utilisez celui qui commence par `__Secure-`
   - Ce token expire après quelques heures

#### Option B: Via Postman (Plus Complexe)

Si vous voulez vous connecter directement via Postman:

1. **Requête de Login**

   ```
   Méthode: POST
   URL: https://sn1325.vercel.app/api/auth/callback/credentials

   Headers:
   Content-Type: application/x-www-form-urlencoded

   Body (x-www-form-urlencoded):
   email: admin@sn1325.cd
   password: admin123
   callbackUrl: /dashboard
   ```

2. **Récupérer le cookie dans la réponse**
   - Dans l'onglet "Cookies" de Postman
   - Copiez la valeur de `next-auth.session-token`

---

### Étape 2: Configurer Postman pour l'Import

1. **Créer une nouvelle requête**

   - Cliquez sur "New" → "HTTP Request"

2. **Configuration de base**

   ```
   Méthode: POST (PAS GET!)
   URL: https://sn1325.vercel.app/api/import-old-data
   ```

3. **Ajouter les Headers**

   Allez dans l'onglet **"Headers"** et ajoutez:

   ```
   Content-Type: application/json
   Cookie: next-auth.session-token=VOTRE_TOKEN_ICI
   ```

   **OU si le cookie s'appelle \_\_Secure-next-auth.session-token:**

   ```
   Content-Type: application/json
   Cookie: __Secure-next-auth.session-token=VOTRE_TOKEN_ICI
   ```

   **Remplacez `VOTRE_TOKEN_ICI`** par la valeur copiée à l'étape 1!

4. **Body (optionnel)**

   - Onglet "Body"
   - Sélectionnez "raw" et "JSON"
   - Mettez: `{}`

5. **Envoyer la requête**
   - Cliquez sur le gros bouton bleu **"Send"**
   - Attendez 2-5 minutes (l'import prend du temps!)

---

## 📸 Capture d'Écran Postman

```
┌─────────────────────────────────────────────────────────────────┐
│ POST ▼  https://sn1325.vercel.app/api/import-old-data   [Send] │
├─────────────────────────────────────────────────────────────────┤
│ Params | Authorization | Headers | Body | ...                   │
├─────────────────────────────────────────────────────────────────┤
│ Headers (2):                                                    │
│ ┌────────────────────────────┬──────────────────────────────┐  │
│ │ KEY                        │ VALUE                        │  │
│ ├────────────────────────────┼──────────────────────────────┤  │
│ │ Content-Type          [✓]  │ application/json             │  │
│ │ Cookie                [✓]  │ next-auth.session-token=eyJ..│  │
│ └────────────────────────────┴──────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ Body:  ○ none  ○ form-data  ● raw  ▼ JSON                      │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ {}                                                        │  │
│ └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Réponse Attendue

### Succès (200 OK)

```json
{
  "success": true,
  "message": "Import terminé avec succès!",
  "details": {
    "axes": 6,
    "grandesCategories": 11,
    "categories": 19,
    "cibles": "...",
    "indicateurs": 40,
    "donnees": "...",
    "utilisateur": "ben@gmail.com créé"
  }
}
```

### Erreur 401 - Non Authentifié

```json
{
  "error": "Non autorisé",
  "message": "Vous devez être connecté"
}
```

**Solution**: Vérifiez que vous avez bien ajouté le cookie dans les headers!

### Erreur 403 - Non Admin

```json
{
  "error": "Accès refusé",
  "message": "Réservé aux administrateurs"
}
```

**Solution**: Votre utilisateur n'est pas admin. Utilisez `admin@sn1325.cd`.

---

## 🔍 Dépannage

### Le cookie ne fonctionne pas

1. **Vérifiez le nom du cookie**

   - Essayez `next-auth.session-token`
   - Essayez `__Secure-next-auth.session-token`

2. **Vérifiez que le cookie n'a pas expiré**

   - Reconnectez-vous sur le site
   - Récupérez un nouveau cookie

3. **Vérifiez le format dans Postman**
   ```
   Cookie: next-auth.session-token=eyJhbG...
   ```
   Pas d'espaces avant ou après le `=`!

### Le token est trop long

C'est normal! Les JWT sont longs. Copiez-le entièrement, même s'il fait plusieurs lignes.

### Erreur "CORS"

Ajoutez ce header:

```
Origin: https://sn1325.vercel.app
```

---

## 🚀 Alternative: cURL (Terminal)

Si vous préférez le terminal:

```bash
# 1. Récupérez le cookie via le navigateur (voir Étape 1)

# 2. Lancez la commande (remplacez VOTRE_TOKEN)
curl -X POST https://sn1325.vercel.app/api/import-old-data \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=VOTRE_TOKEN" \
  -d '{}'
```

---

## 📋 Récapitulatif

### Méthode 1: Page Web (PLUS SIMPLE) ⭐

1. Allez sur https://sn1325.vercel.app/dashboard/admin/import
2. Connectez-vous
3. Cliquez sur le bouton
4. ✅ Terminé!

### Méthode 2: Postman

1. Connectez-vous sur le site web
2. Copiez le cookie `next-auth.session-token` depuis DevTools
3. Ajoutez-le dans les headers Postman
4. POST vers `/api/import-old-data`

### Méthode 3: cURL

1. Même principe que Postman
2. Utilisez la commande ci-dessus

---

## 💡 Pourquoi cette complexité?

NextAuth utilise des **cookies HTTP-only** pour la sécurité:

- Protège contre le vol de tokens
- Empêche l'accès JavaScript malveillant
- Mais nécessite de récupérer le cookie manuellement pour Postman

**C'est pour ça que la page web est plus simple!** 😊

---

**Besoin d'aide?** La page web reste la meilleure option : https://sn1325.vercel.app/dashboard/admin/import
