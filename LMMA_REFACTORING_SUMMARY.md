# Refonte Architecture LMMA - Correctif Majeur

**Date**: 2025-10-21
**Build Status**: ✅ Successfully built (58 pages, 10.8s compile time)
**Commit**: En attente

---

## Problèmes Identifiés par l'Utilisateur

### 1. ❌ Architecture LMMA Incorrecte

**Rapport utilisateur**: "Je crois que tu ne m'as pas compris pour les donnees qualitatifs, dans le formulaire tu as bien fait de mettre seulement les indicateurs qualitatifs. mais pour l'ajout des LMMAs, ce n'est ici qu'on ajoutes les nouvelles LMMAs, plus on selectionne les LMMA a partir de la collection loismesuresactions."

**Problème**:

- L'implémentation actuelle **créait** de nouvelles LMMA directement dans les items
- Les LMMA avaient des champs `lmaTitre` et `lmaType` stockés directement dans DataQualitative
- **Architecture incorrecte** : Les LMMA doivent être **sélectionnées** depuis une collection existante

**Impact**: Duplication des données, pas de réutilisation, mauvaise normalisation de la base de données

### 2. ❌ Erreur de Modification des Indicateurs

**Rapport utilisateur**: "pour la gestion des indicateurs, modification ne fonctionne pas. que peut etre le probleme? j'ai mal importer les donnees? je recois cette erreur : TypeError: Cannot read properties of undefined (reading 'map')"

**Problème**:

- Lors de l'édition d'un indicateur, si `unitesMesure` est `undefined` dans la BD
- Le code tentait d'appeler `.map()` sur `undefined`
- Causait un crash de l'application

---

## Solutions Implémentées

### ✅ 1. Nouvelle Architecture LMMA (Refonte Complète)

#### A. Création des API Endpoints LMMA

**Fichiers créés**:

- `src/app/api/lois-mesures-actions/route.ts` (GET, POST)
- `src/app/api/lois-mesures-actions/[id]/route.ts` (GET, PATCH, DELETE)

**Fonctionnalités**:

```typescript
// GET /api/lois-mesures-actions
// - Récupère toutes les LMMA
// - Supporte filtres: type, statut, annee
// - Populate le type
// - Tri: annee DESC, nom ASC

// POST /api/lois-mesures-actions
// - Crée une nouvelle LMMA
// - Validation des données
// - Populate le type dans la réponse

// GET /api/lois-mesures-actions/[id]
// - Récupère une LMMA spécifique
// - Populate le type

// PATCH /api/lois-mesures-actions/[id]
// - Mise à jour partielle
// - Validation avec runValidators

// DELETE /api/lois-mesures-actions/[id]
// - Suppression d'une LMMA
```

**Note importante**: Utilisation de Next.js 15 async params pattern:

```typescript
// Avant (causait erreur de compilation)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
);

// Après (Next.js 15)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // ...
}
```

#### B. Hook Custom pour LMMA

**Fichier créé**: `src/hooks/useLoisMesuresActions.ts`

```typescript
export function useLoisMesuresActions() {
  const [loisMesuresActions, setLoisMesuresActions] = useState<LMA[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch automatique au montage
  // Fonction mutate() pour rafraîchir les données

  return { loisMesuresActions, isLoading, isError, mutate };
}
```

#### C. Refonte Complète de DataQualitativeTab

**Fichier modifié**: `src/components/data/DataQualitativeTab.tsx`

**Changements majeurs**:

1. **Import du hook LMMA**:

```typescript
import { useLoisMesuresActions } from "@/hooks/useLoisMesuresActions";

const { loisMesuresActions } = useLoisMesuresActions();
const [selectedLMMAs, setSelectedLMMAs] = useState<string[]>([]);
```

2. **Nouveau handleItemSubmit - Sélection Multiple**:

```typescript
const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  // Récupération des LMMA sélectionnées via checkboxes
  const selectedLMMAIds = Array.from(
    formData.getAll("loisMesuresActions")
  ) as string[];

  // Validation
  if (selectedLMMAIds.length === 0) {
    alert("Veuillez sélectionner au moins une Loi/Mesure/Action");
    return;
  }

  // Récupération des champs communs
  const annee = parseInt(formData.get("annee") as string);
  const ordre = formData.get("ordre") ? parseInt(...) : undefined;
  const notes = formData.get("notes") as string || "";

  // Création d'un item pour chaque LMMA sélectionnée
  const items = selectedLMMAIds.map((lmmaId, index) => ({
    loisMesuresActions: lmmaId,  // Référence ObjectId
    annee: annee,
    ordre: ordre ? ordre + index : index + 1,
    notes: notes,
  }));

  // Ajout de tous les items via POST API
  for (const itemData of items) {
    const res = await fetch(`/api/data-liste/${currentIndicatorId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });
    // Gestion des erreurs...
  }

  alert(`${selectedLMMAIds.length} item(s) LMMA ajouté(s) avec succès !`);
  window.location.reload();
};
```

3. **Nouveau Modal LMMA - Multi-Selection**:

**Avant** (modal de création):

- Champs: titre, type, année, ordre, notes
- Créait une nouvelle LMMA à chaque ajout
- Duplication des données

**Après** (modal de sélection):

- Liste scrollable de toutes les LMMA disponibles
- Checkboxes pour sélection multiple
- Affichage enrichi : nom, type (badge), année, statut, référence
- Champs communs : année (requise), ordre de départ, notes
- Badge indiquant le nombre d'items sélectionnés
- Bouton désactivé si aucune sélection

**Interface du modal**:

```tsx
{/* Liste des LMMA disponibles */}
<div className="border rounded-lg max-h-96 overflow-y-auto">
  {loisMesuresActions.map((lmma) => (
    <label key={lmma._id} className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer">
      <input
        type="checkbox"
        name="loisMesuresActions"
        value={lmma._id}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedLMMAs(prev => [...prev, lmma._id]);
          } else {
            setSelectedLMMAs(prev => prev.filter(id => id !== lmma._id));
          }
        }}
      />
      <div className="flex-1">
        <p className="font-medium">{lmma.nom}</p>
        <div className="flex gap-2 mt-1">
          <span className="badge">{lmma.type.nom}</span>
          {lmma.annee && <span className="badge">{lmma.annee}</span>}
          {lmma.statut && <span className="badge-status">{lmma.statut}</span>}
        </div>
        {lmma.reference && <p className="text-xs">Réf: {lmma.reference}</p>}
      </div>
    </label>
  ))}
</div>

{/* Indicateur de sélection */}
<p className="text-sm text-gray-500">{selectedLMMAs.length} item(s) sélectionné(s)</p>

{/* Champs communs */}
<select name="annee" required>{/* Années */}</select>
<input type="number" name="ordre" placeholder="Ordre de départ" />
<textarea name="notes" placeholder="Notes communes..." />

{/* Bouton d'ajout */}
<button type="submit" disabled={selectedLMMAs.length === 0}>
  Ajouter ({selectedLMMAs.length})
</button>
```

**Fonctionnalités UX**:

- Message d'instructions en haut
- Hover effect sur chaque LMMA
- Badges colorés par type et statut
- Message si aucune LMMA disponible
- Bouton désactivé si aucune sélection
- Compte en temps réel des sélections

---

### ✅ 2. Correction Erreur Modification Indicateurs

**Fichier modifié**: `src/app/admin/dashboard/referentiel/indicateurs/page.tsx`

**Problème**: `unitesMesure` pouvait être `undefined` lors de l'édition

**Solution**: Ajout de valeurs par défaut

```typescript
const handleEdit = (indicateur: Indicateur) => {
  setEditingIndicateur(indicateur);
  setFormData({
    nom: indicateur.nom,
    code: indicateur.code,
    description: indicateur.description,
    type: indicateur.type,
    axe:
      typeof indicateur.axe === "object" ? indicateur.axe._id : indicateur.axe,
    unitesMesure: indicateur.unitesMesure || [""], // ✅ Fallback à [""]
    frequenceCollecte: indicateur.frequenceCollecte || "trimestrielle", // ✅ Fallback
    statut: indicateur.statut || "actif", // ✅ Fallback
    desagregableParSexe: indicateur.desagregableParSexe || false,
    desagregableParProvince: indicateur.desagregableParProvince || false,
    desagregableParAnnee: indicateur.desagregableParAnnee !== false,
    avecCible: indicateur.avecCible || false,
  });
  setShowModal(true);
};
```

**Résultat**: Plus d'erreur "Cannot read properties of undefined"

---

## Modèle de Données (Rappel)

### LoisMesuresActions (Collection Principale)

```typescript
{
  nom: string;          // "Loi n°15/013 du 1er août 2015"
  type: ObjectId;       // Référence TypeLMA (Loi, Mesure, Action)
  description?: string;
  annee?: number;       // 2015
  reference?: string;   // "JO n°....."
  lien?: string;        // URL du document
  statut?: string;      // "en vigueur" | "abrogé" | "en projet" | "autre"
}
```

### DataQualitative.items (Items avec Références)

```typescript
{
  loisMesuresActions: ObjectId;  // ✅ Référence vers LoisMesuresActions
  annee: number;                 // Année d'application
  ordre?: number;                // Ordre d'affichage
  notes?: string;                // Notes spécifiques à cet indicateur
}
```

**Exemple d'utilisation**:

```
Indicateur: "Nombre de femmes dans les forces armées"
Items LMMA:
- loismesuresactions.id3 (Loi sur la parité) - 2023 - Ordre: 1
- loismesuresactions.id5 (Action de recrutement) - 2023 - Ordre: 2
```

---

## Workflow Administrateur (Nouveau)

### Étape 1: Créer des LMMA dans Référentiel

_Note: Cette fonctionnalité sera ajoutée dans la prochaine phase_

- Aller dans Référentiel > Lois/Mesures/Actions
- Créer les LMMA une seule fois
- Exemples: "Loi sur la parité", "Décret d'application", "Action de sensibilisation"

### Étape 2: Créer un Indicateur Qualitatif

- Aller dans Données > Données Qualitatives
- Cliquer "Ajouter Indicateur"
- Sélectionner un indicateur qualitatif dans le dropdown (filtré automatiquement)
- Remplir description et source
- Enregistrer

### Étape 3: Associer des LMMA à l'Indicateur

- Cliquer sur le bouton vert "Ajouter LMMA"
- Modal s'ouvre avec la liste de **toutes les LMMA disponibles**
- **Cocher** une ou plusieurs LMMA (multi-sélection)
- Renseigner l'année (commune à toutes)
- Optionnel: ordre de départ, notes
- Cliquer "Ajouter (X)" où X = nombre sélectionné

### Étape 4: Résultat

- Chaque LMMA sélectionnée devient un item séparé
- Les items sont numérotés automatiquement (ordre, ordre+1, ordre+2...)
- Toutes les LMMA partagent la même année et notes
- Les LMMA sont **réutilisables** pour d'autres indicateurs

---

## Avantages de la Nouvelle Architecture

### 1. Normalisation des Données ✅

- Une LMMA créée une seule fois
- Réutilisable pour plusieurs indicateurs
- Pas de duplication

### 2. Maintenance Facilitée ✅

- Modification d'une LMMA se répercute partout
- Exemple: Correction du nom de la loi, tous les indicateurs sont mis à jour

### 3. Reporting Amélioré ✅

- Possibilité de voir tous les indicateurs liés à une LMMA spécifique
- Analyse croisée: "Quels indicateurs sont impactés par cette loi?"

### 4. Performance ✅

- Moins de données stockées
- Requêtes optimisées avec populate()

### 5. UX Améliorée ✅

- Admin ne retape pas les mêmes LMMA
- Sélection multiple rapide
- Affichage visuel avec badges

---

## À Faire (Prochaines Étapes)

### 1. Page de Gestion des LMMA (PRIORITÉ HAUTE)

**Localisation**: `/admin/dashboard/referentiel/lois-mesures-actions`

**Fonctionnalités nécessaires**:

- Afficher toutes les LMMA avec filtres (type, statut, année)
- Créer nouvelle LMMA (formulaire complet)
- Modifier LMMA existante
- Supprimer LMMA (avec vérification si utilisée)
- Recherche par nom/référence
- Export CSV
- Statistiques: nombre total, par type, par statut

**Champs du formulaire**:

- Nom \* (texte)
- Type \* (dropdown depuis TypeLMA)
- Description (textarea)
- Année (number)
- Référence (texte) - ex: "JO n°..."
- Lien (URL) - ex: lien vers document PDF
- Statut (dropdown: en vigueur, abrogé, en projet, autre)

### 2. Affichage Visitor Portal

**Fichier à modifier**: Composant d'affichage des données qualitatives pour visiteurs

**Actuellement**: Affiche probablement les champs incorrects (lmaTitre, lmaType)

**À corriger**:

- Populate `loisMesuresActions` avec ses détails
- Afficher `loisMesuresActions.nom` au lieu de `lmaTitre`
- Afficher `loisMesuresActions.type.nom` au lieu de `lmaType`
- Afficher référence, lien, statut si disponibles

### 3. Migration des Données Existantes

**Script de migration nécessaire** pour convertir les anciennes données:

```javascript
// Pseudo-code de migration
for (dataQualitative of existingData) {
  for (item of dataQualitative.items) {
    if (item.lmaTitre && item.lmaType) {
      // 1. Chercher ou créer LMMA correspondante
      let lmma = await LoisMesuresActions.findOne({ nom: item.lmaTitre });

      if (!lmma) {
        // 2. Créer nouvelle LMMA
        const typeLMA = await TypeLMA.findOne({ nom: item.lmaType });
        lmma = await LoisMesuresActions.create({
          nom: item.lmaTitre,
          type: typeLMA._id,
          // Autres champs...
        });
      }

      // 3. Mettre à jour l'item avec la référence
      item.loisMesuresActions = lmma._id;
      delete item.lmaTitre;
      delete item.lmaType;
    }
  }
  await dataQualitative.save();
}
```

### 4. Validation et Tests

- [ ] Tester création indicateur qualitatif
- [ ] Tester sélection d'une seule LMMA
- [ ] Tester sélection de plusieurs LMMA (3-5 items)
- [ ] Vérifier incrémentation automatique de l'ordre
- [ ] Tester avec collection LMMA vide
- [ ] Vérifier populate dans l'affichage
- [ ] Tester modification/suppression d'items
- [ ] Vérifier visitor portal affiche correctement

---

## Build & Deployment

### Build Status

```
✓ Compiled successfully in 10.8s
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (58/58)
✓ Finalizing page optimization

Total Routes: 58 static + 32 dynamic API
New API Routes:
├ ƒ /api/lois-mesures-actions         (GET, POST)
└ ƒ /api/lois-mesures-actions/[id]    (GET, PATCH, DELETE)
```

### Warnings (Non-bloquants)

- React hooks exhaustive-deps dans statistiques page
- Variable `getMobileLinkClasses` non utilisée dans Header
- Mongoose duplicate index warnings (comportement normal)

### Fichiers Modifiés

1. `src/app/api/lois-mesures-actions/route.ts` (NEW)
2. `src/app/api/lois-mesures-actions/[id]/route.ts` (NEW)
3. `src/hooks/useLoisMesuresActions.ts` (NEW)
4. `src/components/data/DataQualitativeTab.tsx` (REFONTE MAJEURE)
5. `src/app/admin/dashboard/referentiel/indicateurs/page.tsx` (FIX)

---

## Message de Commit Proposé

```
feat(lmma): refonte architecture - sélection au lieu de création

PROBLÈMES RÉSOLUS:
1. ❌ Architecture LMMA incorrecte
   - Les LMMA étaient créées directement dans les items
   - Causait duplication et mauvaise normalisation

2. ❌ Erreur modification indicateurs
   - unitesMesure undefined causait crash
   - TypeError: Cannot read properties of undefined

SOLUTIONS IMPLÉMENTÉES:
1. ✅ Nouvelle architecture LMMA (refonte complète)
   - Création API endpoints: /api/lois-mesures-actions (GET, POST, PATCH, DELETE)
   - Hook custom useLoisMesuresActions pour fetch données
   - Refonte DataQualitativeTab: modal multi-sélection
   - Items stockent maintenant références ObjectId vers LMMA
   - Support Next.js 15 async params pattern

2. ✅ Correction erreur modification indicateurs
   - Ajout fallbacks: unitesMesure || [""]
   - Ajout fallbacks: frequenceCollecte, statut
   - Plus d'erreur .map() sur undefined

ARCHITECTURE:
- LoisMesuresActions: collection principale réutilisable
- DataQualitative.items: références via ObjectId
- Workflow: créer LMMA > sélectionner pour indicateur

FONCTIONNALITÉS:
- Sélection multiple de LMMA via checkboxes
- Affichage enrichi: badges type, statut, année, référence
- Incrémentation automatique de l'ordre
- Champs communs: année, notes
- Validation: au moins 1 LMMA sélectionnée
- Message succès: "X item(s) ajouté(s)"

TODO:
- Page gestion LMMA dans Référentiel
- Migration données existantes
- Corriger affichage visitor portal

Files:
+ src/app/api/lois-mesures-actions/route.ts
+ src/app/api/lois-mesures-actions/[id]/route.ts
+ src/hooks/useLoisMesuresActions.ts
M src/components/data/DataQualitativeTab.tsx (refonte)
M src/app/admin/dashboard/referentiel/indicateurs/page.tsx (fix)

Build: ✅ 58 pages, 10.8s, no errors
```

---

## Prochaine Session

### Priorités

1. **HAUTE**: Créer page de gestion LMMA dans Référentiel
2. **HAUTE**: Corriger affichage visitor portal (populate LMMA)
3. **MOYENNE**: Script de migration des données
4. **MOYENNE**: Tests end-to-end du workflow
5. **BASSE**: Page statistiques avancées (selon user request)

### Questions pour l'utilisateur

1. Avez-vous déjà des LMMA dans votre base de données?
2. Si oui, sont-elles dans une collection séparée ou dans les items?
3. Voulez-vous une migration automatique ou manuelle?
4. Quels champs LMMA sont les plus importants à afficher?

---

## Conclusion

Cette refonte corrige un problème d'architecture fondamental qui aurait causé des problèmes majeurs à long terme. La nouvelle implémentation suit les meilleures pratiques de normalisation des bases de données et offre une bien meilleure expérience utilisateur pour les administrateurs.

**Impact positif**:

- ✅ Pas de duplication des données
- ✅ Maintenance facilitée
- ✅ Performance améliorée
- ✅ UX administrative intuitive
- ✅ Possibilités de reporting avancé

**Prochaine étape critique**: Créer la page de gestion LMMA dans le référentiel pour permettre aux administrateurs de créer et gérer les LMMA avant de les associer aux indicateurs.
