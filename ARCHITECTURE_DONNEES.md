# Architecture des Données - SN1325

## 📋 Collections Existantes

### 1. **DataNumeric** (Données Numériques)

**Utilisation:** Données quantitatives nationales ET provinciales

**Structure:**

```typescript
{
  indicateur: ObjectId,      // Référence Indicateur
  annee: number,             // Année de la donnée
  sexe: "Homme" | "Femme" | "Total",
  province?: ObjectId,       // Si null = National, Si rempli = Provincial
  cible?: ObjectId,          // Désagrégation par cible
  valeur: number,            // Valeur numérique
  pourcentage?: number,      // Pourcentage si applicable
  source?: string,
  notes?: string,
  validePar?: string
}
```

**Cas d'usage:**

- Données nationales: `province = null`
- Données provinciales: `province = ObjectId`
- Désagrégation: sexe, cible, province

**Exemples:**

- Nombre de femmes dans l'armée (National)
- Nombre de secrétariats provinciaux par province
- Nombre de PAP élaborés par province

---

### 2. **DataQualitative** (Listes/LMMA)

**Utilisation:** Données qualitatives (listes de lois, mesures, actions)

**Structure:**

```typescript
{
  indicateur: ObjectId,      // Référence Indicateur (unique)
  items: [
    {
      loisMesuresActions: ObjectId,  // Référence LMMA
      annee: number,
      ordre?: number,
      notes?: string
    }
  ],
  description?: string,
  source?: string,
  validePar?: string
}
```

**Cas d'usage:**

- Lois et politiques intégrant l'égalité des sexes
- Mesures adoptées
- Mécanismes de suivi
- Actions menées

---

## 🎯 Organisation Proposée

### **Portal Admin: `/admin/dashboard/donnees`**

#### **3 Tabs:**

1. **Données Numériques Nationales**

   - Table: DataNumeric WHERE `province = null`
   - Colonnes: Année, Indicateur, Sexe, Cible, Valeur, Actions
   - CRUD complet

2. **Données Numériques Provinciales**

   - Table: DataNumeric WHERE `province != null`
   - Colonnes: Année, Indicateur, Province, Sexe, Cible, Valeur, Actions
   - CRUD complet

3. **Données Qualitatives (LMMA)**
   - Table: DataQualitative
   - Liste des indicateurs avec leurs items LMMA
   - CRUD complet (ajouter/modifier items)

---

### **Portal Visiteur: `/user/dashboard/donnees`**

#### **3 Tabs (Mode lecture):**

1. **Données Nationales**

   - Vue tableau filtrable
   - Filtres: Année, Axe, Indicateur, Sexe
   - Export Excel/CSV

2. **Données Provinciales**

   - Vue tableau filtrable
   - Filtres: Année, Province, Axe, Indicateur
   - Visualisation carte géographique

3. **Lois, Mesures & Actions**
   - Liste des LMMA par indicateur
   - Filtres: Année, Axe
   - Affichage chronologique

---

## 📊 Page Statistiques

**Utilise les 2 collections pour générer:**

### **Graphiques Numériques:**

- Évolution temporelle (lignes)
- Comparaison provinces (barres)
- Distribution par sexe (camemberts)
- Tableaux de bord interactifs

### **Analyses Qualitatives:**

- Nombre de LMMA par axe
- Timeline des lois adoptées
- Couverture par indicateur

---

## 🔄 Migration des Anciennes Données

**Fichiers sources:**

- `AllDATANumber.json` → DataNumeric
- `All-DATAProvinces.json` → DataNumeric (avec province)
- `AllDataListes.json` → DataQualitative

**Script de migration à créer:**

```typescript
// Importer les 3 fichiers JSON
// Parser et transformer selon le nouveau schéma
// Insérer dans MongoDB
```

---

## ✅ Avantages de cette Architecture

1. **Pas de duplication:** Une seule collection pour données numériques
2. **Flexible:** Gestion nationale + provinciale dans DataNumeric
3. **Performant:** Indexes optimisés pour les requêtes
4. **Cohérent:** Séparation claire numérique/qualitatif
5. **Évolutif:** Facile d'ajouter de nouvelles désagrégations

---

## 🚀 Prochaines Étapes

1. ✅ Créer les tabs dans admin/dashboard/donnees
2. ✅ Créer les composants de table pour chaque type
3. ✅ Implémenter CRUD pour chaque tab
4. ✅ Créer les tabs lecture seule dans user/dashboard/donnees
5. ✅ Créer le script de migration des anciennes données
6. ✅ Mettre à jour la page statistiques pour utiliser les vraies données
7. ✅ Supprimer ou réutiliser admin/dashboard/donnees/saisie

---

## 📝 Notes Importantes

- **DataNumeric.province = null** → National
- **DataNumeric.province = ObjectId** → Provincial
- **DataQualitative** → Une entrée par indicateur (unique)
- **LoisMesuresActions** → Collection séparée référencée
- **Indexes** → Optimisés pour requêtes fréquentes
