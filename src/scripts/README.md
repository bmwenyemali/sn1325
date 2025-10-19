# Scripts Utilitaires

## ⚠️ IMPORTANT: Configuration Requise

Ces scripts nécessitent que la variable d'environnement `MONGODB_URI` soit définie dans votre fichier `.env.local`.

**Ne jamais hardcoder vos credentials dans le code!**

## Scripts Disponibles

### 1. Check Users (`checkUsers.mjs`)

Affiche tous les utilisateurs dans la base de données.

**Usage:**

```bash
node src/scripts/checkUsers.mjs
```

### 2. Create Test Users (`createTestUsers.mjs`)

Crée des utilisateurs de test pour le développement.

**Usage:**

```bash
node src/scripts/createTestUsers.mjs
```

**Utilisateurs créés:**

- Admin: `admin@sn1325.cd` / `admin123`
- User: `user@sn1325.cd` / `user123`

## Prérequis

1. Fichier `.env.local` configuré avec `MONGODB_URI`
2. Node.js installé
3. Dépendances installées (`npm install`)

## Sécurité

⚠️ **Ces scripts ne doivent JAMAIS contenir de credentials en dur!**

- Utilisez toujours `.env.local` pour les secrets
- Ne commitez JAMAIS le fichier `.env.local`
- Ajoutez `.env.local` à `.gitignore`
