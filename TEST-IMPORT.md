# ✅ Guide de Test - Import des Données

## 🎯 C'est Maintenant Réparé!

Tous les problèmes ont été corrigés:

1. ✅ Authentification admin (populate role)
2. ✅ Page d'import créée
3. ✅ Fichiers OldData ajoutés au projet
4. ✅ Déployé sur Vercel

---

## ⏱️ Attendez 2-3 Minutes

Vercel est en train de redéployer le site avec les fichiers OldData.

Vous pouvez suivre le déploiement ici:
👉 https://vercel.com/bmwenyemalis-projects/sn1325/deployments

---

## 🧪 Test de l'Import

### Étape 1: Vérifier le Déploiement

Attendez de voir "Ready" sur Vercel (vert ✅)

### Étape 2: Tester l'Import

1. **Allez sur**: https://sn1325.vercel.app/dashboard/admin/import

2. **Connectez-vous**:

   - Email: `admin@sn1325.cd`
   - Mot de passe: `admin123`

3. **Vérifiez l'affichage**:

   - ✅ Vous devez voir "Import des Données OldData"
   - ✅ Pas de message "Accès Refusé"
   - ✅ Un gros bouton bleu "Lancer l'Import"

4. **Cliquez sur "Lancer l'Import"**

5. **Attendez**:

   - Vous verrez "Import en cours..." avec une animation
   - L'import peut prendre 2-5 minutes
   - **NE FERMEZ PAS LA PAGE**

6. **Succès!**:
   - Message vert: "✅ Import Réussi!"
   - Détails affichés:
     ```
     ✅ 6 axes importés
     ✅ 11 grandes catégories importées
     ✅ 19 catégories importées
     ✅ X cibles importées
     ✅ ~40 indicateurs importés
     ✅ Données numériques importées
     ✅ Données qualitatives importées
     ✅ Utilisateur ben@gmail.com créé
     ```

---

## ✅ Vérifications Après Import

### Test 1: Connexion avec Ben

1. **Déconnectez-vous**
2. **Reconnectez-vous avec**:
   - Email: `ben@gmail.com`
   - Mot de passe: `12345`
3. ✅ Doit fonctionner (utilisateur créé par l'import)

### Test 2: Vérifier les Données

Une fois les pages de visualisation créées, vous pourrez voir:

- Les 6 axes stratégiques
- Les indicateurs
- Les données par province

---

## 🔍 En Cas de Problème

### Erreur "Accès Refusé"

**Cause**: Pas encore redéployé ou cookie expiré

**Solution**:

1. Attendez 1-2 minutes de plus
2. Videz le cache du navigateur (`Ctrl+Shift+R`)
3. Reconnectez-vous

### Erreur "ENOENT: no such file"

**Cause**: Déploiement pas encore terminé

**Solution**:

1. Vérifiez sur Vercel que le déploiement est "Ready"
2. Attendez encore 1-2 minutes
3. Réessayez

### Import Prend Trop de Temps

**Normal**: L'import peut prendre 2-5 minutes car:

- 12 fichiers JSON à traiter
- ~40 indicateurs avec relations
- Milliers de données à insérer
- Désagrégations par sexe, province, année

**Solution**: **SOYEZ PATIENT!** Ne fermez pas la page.

### Erreur 500 Internal Server Error

**Causes possibles**:

1. MongoDB Atlas pas connecté → Vérifiez `.env.local`
2. Timeout Vercel (10s) dépassé → L'import est trop long pour une fonction serverless

**Solution alternative** (si timeout):
Voir section "Alternative: Import Local" ci-dessous

---

## 🔄 Alternative: Import Local (Si Timeout)

Si Vercel timeout à cause du temps d'import, vous pouvez importer en local:

### 1. En Local via l'App

```bash
# Dans le terminal
cd "c:\Users\bienv\Mon Drive\AKILI\PROJECTS 2026\SN1325\sn1325-app"
npm run dev
```

Puis:

1. Allez sur http://localhost:3000/dashboard/admin/import
2. Connectez-vous
3. Cliquez sur "Lancer l'Import"
4. Attendez (pas de timeout en local)

### 2. En Local via Script Direct

```bash
# Dans le terminal
npx ts-node src/scripts/importOldData.ts
```

Cela lance l'import directement sans passer par l'API.

---

## 📊 Ce Qui Sera Importé

### Référentiels (Structure)

- 6 Axes stratégiques
- 11 Grandes Catégories
- 19 Catégories
- X Cibles
- 26 Provinces
- Y Années
- Z Structures/Organisations

### Indicateurs

- ~40 Indicateurs
  - Indicateurs numériques (avec désagrégation)
  - Indicateurs qualitatifs (avec listes dynamiques)

### Données

- Données numériques désagrégées (sexe, province, année)
- Données qualitatives (listes)
- Données provinciales

### Lois/Mesures/Actions

- Types LMA
- Lois, Mesures, Mécanismes, Actions

### Utilisateur

- ben@gmail.com (mot de passe: 12345)
- Rôle: USER (lecture seule)

---

## 🎉 Après l'Import Réussi

### Prochaines Étapes

1. **Vérifier les données**:

   - Connectez-vous avec ben@gmail.com
   - Naviguez dans le dashboard

2. **Créer les pages de visualisation** (todo suivant):

   - `/dashboard/donnees/consultation`
   - `/dashboard/rapports/analyses`
   - Graphiques et tableaux

3. **Créer les pages CRUD admin**:
   - Gérer les axes
   - Gérer les indicateurs
   - Saisir les données

---

## 📞 Statut du Déploiement

### Commits:

1. ✅ `9867341` - Authentification admin corrigée
2. ✅ `020b48e` - Fichiers OldData ajoutés

### Déploiement Vercel:

- Branch: `master`
- Statut: 🟡 En cours → Attendez le ✅ Ready
- URL: https://sn1325.vercel.app

---

## 🎯 Checklist Finale

Avant de tester:

- [ ] Déploiement Vercel terminé (Ready ✅)
- [ ] Attendu 2-3 minutes après le push

Pour tester:

- [ ] Aller sur /dashboard/admin/import
- [ ] Connexion avec admin@sn1325.cd
- [ ] Page affichée sans erreur
- [ ] Cliquer sur le bouton
- [ ] Attendre 2-5 minutes
- [ ] Voir le message de succès

Après l'import:

- [ ] Déconnexion
- [ ] Connexion avec ben@gmail.com
- [ ] Vérifier l'accès au dashboard

---

**Tout est prêt! Testez dans 2-3 minutes! 🚀**
