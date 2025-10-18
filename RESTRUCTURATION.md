# Restructuration de l'Application SN1325

## ✅ Travail Complété

### 1. Restructuration des Modèles Mongoose

Création d'une architecture complète pour supporter la hiérarchie des données selon le schéma OldData:

#### Modèles de Hiérarchie

- **GrandeCategorie** (`src/models/GrandeCategorie.ts`)
  - 11 grandes catégories: Finances, Armée, Police, Justice, Gouvernement, Parlement, etc.
- **Categorie** (`src/models/Categorie.ts`)
  - 19 catégories avec référence à GrandeCategorie
  - Exemples: Budget, Officiers, Sous-officiers, Officiers supérieurs, etc.
- **Cible** (`src/models/Cible.ts`)
  - Cibles spécifiques avec références à Categorie et GrandeCategorie
  - Exemples: Commissaire Divisionnaire principal, Colonel, etc.

#### Modèles de Base

- **Axe** (`src/models/Axe.ts`)
  - 6 axes: Prévention, Participation, Protection, Secours et Relèvement, Coordination/Suivi/évaluation, Actions Humanitaires
- **Indicateur** (`src/models/Indicateur.ts`)
  - Support de deux types d'indicateurs:
    - **Numérique** (désagrégeable = 1): Peut être désagrégé par sexe, année, province
    - **Qualitatif** (désagrégeable = 2): Contient des listes dynamiques de lois/mesures/actions
  - Flags: `desagregableParSexe`, `desagregableParProvince`, `desagregableParAnnee`, `avecCible`
- **Province** (`src/models/Province.ts`)
  - 26 provinces de la RDC
- **Annee** (`src/models/Annee.ts`)
  - Gestion des années pour les séries temporelles
- **Structure** (`src/models/Structure.ts`)
  - Organisations (Ministères, ONGs, Agences, etc.)

#### Modèles de Données

- **DataNumeric** (`src/models/DataNumeric.ts`)
  - Données numériques désagrégées
  - Champs: indicateur, annee, sexe, province, cible, valeur, pourcentage
  - Index unique sur (indicateur, annee, sexe, province, cible)
- **DataQualitative** (`src/models/DataQualitative.ts`)
  - Données qualitatives (listes de lois/mesures/actions)
  - Items avec référence à LoisMesuresActions, annee, ordre
- **TypeLMA** (`src/models/TypeLMA.ts`)
  - Types: Lois, Mesures, Mécanismes, Actions
- **LoisMesuresActions** (`src/models/LoisMesuresActions.ts`)
  - Items individuels avec type, nom, description, année, référence, lien, statut

#### Modèles d'Authentification

Les modèles User, Role, Privilege, et AuditLog existent déjà dans `src/models/User.ts`

#### Export Central

- **index.ts** (`src/models/index.ts`)
  - Export central de tous les modèles et types
  - Facilite les imports: `import { Axe, Indicateur, DataNumeric } from '@/models'`

### 2. Page de Gestion des Utilisateurs

Création de `/dashboard/utilisateurs` (`src/app/dashboard/utilisateurs/page.tsx`):

#### Fonctionnalités

- ✅ Protection admin uniquement (vérification du rôle)
- ✅ Liste des utilisateurs avec informations complètes (nom, prénom, email, rôle, organisation, province, statut)
- ✅ Recherche en temps réel (nom, prénom, email, organisation)
- ✅ Filtrage par statut (tous, actif, inactif, suspendu)
- ✅ Statistiques:
  - Total utilisateurs
  - Utilisateurs actifs
  - Nombre d'administrateurs
- ✅ Interface responsive avec dark mode complet
- ✅ Actions CRUD (boutons Modifier et Supprimer préparés)

#### À Implémenter

- ⏳ Appel API réel pour récupérer les utilisateurs (actuellement mock data)
- ⏳ Modal d'ajout/modification d'utilisateur
- ⏳ Confirmation de suppression
- ⏳ Activation/désactivation d'utilisateurs
- ⏳ Réinitialisation de mot de passe

### 3. Amélioration du Dark Mode

Corrections CSS dans `src/app/globals.css`:

#### Ajouts

- ✅ Overrides complets pour tous les tons de gris:
  - `bg-gray-50`, `bg-gray-100`, `bg-gray-200` → dark mode
  - `text-gray-400`, `text-gray-800` → dark mode
- ✅ États hover pour dark mode
- ✅ `color-scheme: dark` pour le rendu natif du navigateur
- ✅ Shadow adaptatif (`shadow-md` en dark mode)

#### Résultats

- ✅ Texte lisible partout en mode sombre
- ✅ Contrastes corrects sur tous les éléments
- ✅ Transitions fluides entre light/dark

### 4. Correction des Rôles Utilisateur

Modifications dans `src/scripts/initRealData.ts`:

#### Changements

- ✅ Suppression du rôle "Consultant"
- ✅ Ajout du rôle "Utilisateur" (USER) avec privilèges READ uniquement
- ✅ Structure simplifiée:
  - **Admin** (ADMIN): Accès complet CRUD sur tout
  - **Utilisateur** (USER): Lecture seule (visualisation des données, statistiques, tableaux de bord)
  - **Public**: Page d'accueil uniquement (non authentifié)

#### Credentials

- Admin: `admin@sn1325.cd` / `admin123`
- Utilisateur: `user@sn1325.cd` / `user123`

### 5. Build et Déploiement

- ✅ Build Next.js réussi (16 routes)
- ✅ Aucune erreur TypeScript
- ✅ Aucune erreur ESLint
- ✅ Commit Git avec message détaillé (28f0acc)
- ✅ Push vers GitHub réussi

---

## ⏳ Travail Restant

### Phase 1: Import des Données (Priorité HAUTE)

#### Script d'Import

Créer `src/scripts/importOldData.ts` pour importer toutes les données du dossier `OldData/`:

1. **All-Axes.json** (6 axes) → Collection `axes`
2. **All-Grande-Categories.json** (11) → Collection `grandecategories`
3. **All-Categories.json** (19) → Collection `categories`
4. **All-Cibles.json** → Collection `cibles`
5. **AllProvinces.json** (26 provinces) → Collection `provinces`
6. **All-Annees.json** → Collection `annees`
7. **All-Structures.json** → Collection `structures`
8. **All-Indicateurs.json** (~40 indicateurs) → Collection `indicateurs`
9. **All-LoisMesMecActs.json** → Collection `typelmas` + `loismesuresactions`
10. **AllDATANumber.json** (données numériques) → Collection `datanumerics`
11. **AllDataListes.json** (données qualitatives) → Collection `dataqualitatives`

#### Transformations Nécessaires

- Mapper les IDs de l'ancien schéma vers les ObjectIds MongoDB
- Convertir les flags numériques (Désagrégeable 1/2) en types string (numerique/qualitatif)
- Gérer les références entre collections (ID_Gdcat, ID_Cat, ID_Indicateur, etc.)
- Parser les champs de date

#### Endpoint API

Créer `/api/import-old-data` pour déclencher l'import (admin uniquement)

### Phase 2: Pages CRUD Admin (Priorité HAUTE)

Créer les interfaces d'administration dans `/dashboard/admin/`:

#### 2.1 Gestion des Référentiels

- `/dashboard/admin/axes` - CRUD sur les axes
- `/dashboard/admin/grandes-categories` - CRUD sur les grandes catégories
- `/dashboard/admin/categories` - CRUD sur les catégories (avec sélecteur de grande catégorie)
- `/dashboard/admin/cibles` - CRUD sur les cibles (avec sélecteurs de catégorie et grande catégorie)
- `/dashboard/admin/provinces` - CRUD sur les provinces
- `/dashboard/admin/annees` - CRUD sur les années
- `/dashboard/admin/structures` - CRUD sur les structures

#### 2.2 Gestion des Indicateurs

- `/dashboard/admin/indicateurs` - CRUD sur les indicateurs
  - Formulaire avec:
    - Nom, description
    - Sélecteur d'axe
    - Type (numérique/qualitatif)
    - Checkboxes de désagrégation (sexe, province, année)
    - Checkbox "avec cible"
    - Unité de mesure (pour type numérique)
    - Ordre d'affichage

#### 2.3 Saisie des Données

- `/dashboard/admin/donnees/numeriques` - Saisie des données numériques
  - Sélecteur d'indicateur (filtre par type numérique)
  - Sélecteur d'année
  - Sélecteurs conditionnels (sexe, province, cible) selon flags de l'indicateur
  - Champs valeur et pourcentage
  - Source et notes
- `/dashboard/admin/donnees/qualitatives` - Gestion des listes de lois/mesures/actions
  - Sélecteur d'indicateur (filtre par type qualitatif)
  - Ajout/suppression d'items dans la liste
  - Sélecteur de loi/mesure/action existante ou création nouvelle
  - Année et ordre pour chaque item
- `/dashboard/admin/lois-mesures-actions` - CRUD sur les lois/mesures/actions
  - Type (Loi, Mesure, Mécanisme, Action)
  - Nom, description
  - Année, référence, lien
  - Statut (en vigueur, abrogé, en projet)

#### 2.4 Finalisation de la Gestion des Utilisateurs

- Compléter `/dashboard/utilisateurs` avec:
  - Modal d'ajout/modification
  - API endpoints CRUD (`/api/users`)
  - Confirmation de suppression
  - Activation/désactivation
  - Réinitialisation de mot de passe

### Phase 3: Pages de Visualisation pour Utilisateurs (Priorité MOYENNE)

#### 3.1 Tableaux de Bord

- `/dashboard` - Vue d'ensemble avec statistiques clés
  - KPIs par axe
  - Graphiques d'évolution temporelle
  - Répartition par province

#### 3.2 Consultation des Données

- `/dashboard/donnees/consultation` - Interface de consultation
  - Sélection d'axe, indicateur
  - Filtres: année, sexe, province, cible
  - Affichage adapté au type d'indicateur (tableau ou liste)
  - Export Excel/PDF

#### 3.3 Rapports et Statistiques

- `/dashboard/rapports/analyses` - Analyses avancées
  - Comparaisons inter-provinces
  - Évolution temporelle
  - Analyse par genre
  - Graphiques interactifs (Chart.js ou Recharts)
- `/dashboard/rapports/indicateurs` - Rapports par indicateur
  - Fiche détaillée d'indicateur
  - Historique complet
  - Visualisations

### Phase 4: API Endpoints (Priorité HAUTE)

Créer les endpoints API nécessaires dans `/api/`:

#### Référentiels

- `GET /api/axes` - Liste des axes
- `POST /api/axes` - Créer un axe (admin)
- `PUT /api/axes/[id]` - Modifier un axe (admin)
- `DELETE /api/axes/[id]` - Supprimer un axe (admin)

Répéter pour: grandes-categories, categories, cibles, provinces, annees, structures

#### Indicateurs

- `GET /api/indicateurs` - Liste des indicateurs (avec filtres)
- `GET /api/indicateurs/[id]` - Détails d'un indicateur
- `POST /api/indicateurs` - Créer un indicateur (admin)
- `PUT /api/indicateurs/[id]` - Modifier un indicateur (admin)
- `DELETE /api/indicateurs/[id]` - Supprimer un indicateur (admin)

#### Données

- `GET /api/donnees/numeriques` - Récupérer données numériques (avec filtres)
- `POST /api/donnees/numeriques` - Ajouter une donnée (admin)
- `PUT /api/donnees/numeriques/[id]` - Modifier une donnée (admin)
- `DELETE /api/donnees/numeriques/[id]` - Supprimer une donnée (admin)

- `GET /api/donnees/qualitatives` - Récupérer données qualitatives (avec filtres)
- `POST /api/donnees/qualitatives` - Ajouter/modifier liste (admin)

#### Utilisateurs

- `GET /api/users` - Liste des utilisateurs (admin)
- `POST /api/users` - Créer un utilisateur (admin)
- `PUT /api/users/[id]` - Modifier un utilisateur (admin)
- `DELETE /api/users/[id]` - Supprimer un utilisateur (admin)

#### Rapports

- `GET /api/rapports/statistiques` - Statistiques générales
- `GET /api/rapports/export` - Export Excel/PDF

### Phase 5: Tests et Optimisations (Priorité MOYENNE)

#### Tests

- Tests unitaires des modèles
- Tests d'intégration des API endpoints
- Tests E2E des parcours utilisateur
- Tests de permissions (admin vs user vs public)

#### Optimisations

- Indexation MongoDB optimale
- Pagination des listes
- Caching (Redis si nécessaire)
- Compression des images
- Optimisation des queries (populate sélectif)

#### Sécurité

- Rate limiting sur les APIs
- Validation des inputs (Zod)
- Sanitization des données
- CSRF protection
- Audit logs pour toutes les actions admin

### Phase 6: Documentation et Déploiement Final (Priorité BASSE)

#### Documentation

- Guide utilisateur (admin)
- Guide utilisateur (lecture)
- Documentation API (Swagger/OpenAPI)
- Guide de maintenance
- Procédures de backup

#### Déploiement

- Configuration production (variables d'environnement)
- Backup automatique MongoDB
- Monitoring (Sentry, LogRocket)
- Déploiement Vercel optimisé
- Configuration CDN pour assets

---

## 📊 État Actuel

### ✅ Complété (Étapes 1-5)

1. ✅ Architecture des modèles Mongoose complète
2. ✅ Page de gestion des utilisateurs (interface seulement)
3. ✅ Dark mode entièrement fonctionnel
4. ✅ Rôles utilisateur simplifiés (Admin/User)
5. ✅ Build et déploiement GitHub réussis

### 🔄 En Cours

- Aucune tâche en cours actuellement

### ⏳ À Faire (Par Ordre de Priorité)

1. **Import des données OldData** (Critique - bloque visualisation)
2. **API endpoints CRUD** (Haute - permet les fonctionnalités admin)
3. **Pages CRUD admin** (Haute - interface pour gérer les données)
4. **Pages de visualisation** (Moyenne - pour les utilisateurs finaux)
5. **Tests et optimisations** (Moyenne - qualité)
6. **Documentation et déploiement final** (Basse - polish)

---

## 🎯 Prochaines Étapes Recommandées

1. **Créer le script d'import** (`importOldData.ts`)
   - Lire tous les fichiers JSON du dossier OldData
   - Transformer et insérer dans MongoDB
   - Gérer les relations entre entités
2. **Créer l'endpoint d'import** (`/api/import-old-data`)
   - Protected route (admin seulement)
   - Appelle le script d'import
   - Retourne statut et logs
3. **Tester l'import en local**
   - Vérifier toutes les données
   - Valider les relations
   - Corriger les erreurs
4. **Commencer les pages CRUD**
   - Axes (le plus simple)
   - Provinces
   - Grandes Catégories
   - Catégories
   - Cibles
   - Indicateurs
5. **Créer les API endpoints correspondants**
   - Un endpoint par entité
   - CRUD complet
   - Validation et sécurité

---

## 🛠️ Commandes Utiles

```bash
# Lancer en développement
npm run dev

# Builder pour production
npm run build

# Lancer le script d'initialisation
npm run init-data

# Lancer le script d'import (à créer)
npm run import-old-data

# Tests (à configurer)
npm test

# Commit et push
git add .
git commit -m "feat: message"
git push origin master
```

---

## 📝 Notes Importantes

1. **Structure des données OldData**

   - Hiérarchie: Axe → Indicateur → [optionnel] Cible → Categorie → Grande Categorie
   - Deux types d'indicateurs: numériques (désagrégés) et qualitatifs (listes)
   - 26 provinces de la RDC
   - Désagrégation par sexe (Homme/Femme/Total), année, province

2. **Modèles créés**

   - Tous les modèles suivent les conventions Mongoose
   - Indexes pour optimiser les queries
   - Timestamps automatiques (createdAt, updatedAt)
   - Validations intégrées
   - Support des relations (références ObjectId)

3. **Authentification**

   - NextAuth v5 (beta)
   - JWT sessions
   - Role-based access control (RBAC)
   - Deux rôles: Admin (full access) et User (read-only)

4. **Dark Mode**
   - Tailwind CSS class strategy
   - Persisté dans localStorage
   - Toggle dans le header
   - CSS overrides complets

---

## 🔗 Liens Utiles

- Repository GitHub: https://github.com/bmwenyemali/sn1325
- Application Déployée: https://sn1325.vercel.app
- Documentation Next.js: https://nextjs.org/docs
- Documentation Mongoose: https://mongoosejs.com/docs
- Documentation NextAuth: https://authjs.dev

---

**Dernière mise à jour**: 17 octobre 2024  
**Commit**: 28f0acc - "feat: Restructuration des modèles et ajout de la gestion des utilisateurs"
