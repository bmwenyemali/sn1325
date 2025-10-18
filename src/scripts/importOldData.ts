/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/mongodb";
import fs from "fs";
import path from "path";
import {
  Axe,
  GrandeCategorie,
  Categorie,
  Cible,
  Province,
  Annee,
  Structure,
  Indicateur,
  TypeLMA,
  LoisMesuresActions,
  DataNumeric,
  DataQualitative,
  User,
  Role,
} from "@/models";

// Mapping des anciens IDs vers les nouveaux ObjectIds MongoDB
const idMaps: {
  axes: Map<number, string>;
  grandesCategories: Map<number, string>;
  categories: Map<number, string>;
  cibles: Map<number, string>;
  provinces: Map<number, string>;
  annees: Map<number, string>;
  structures: Map<number, string>;
  indicateurs: Map<number, string>;
  loisMesuresActions: Map<number, string>;
  typeLMA: Map<number, string>;
} = {
  axes: new Map(),
  grandesCategories: new Map(),
  categories: new Map(),
  cibles: new Map(),
  provinces: new Map(),
  annees: new Map(),
  structures: new Map(),
  indicateurs: new Map(),
  loisMesuresActions: new Map(),
  typeLMA: new Map(),
};

function readJsonFile(filename: string): any[] {
  const filePath = path.join(process.cwd(), "OldData", filename);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

async function importAxes() {
  console.log("\n📊 Import des Axes...");
  const axes = readJsonFile("All-Axes.json");

  for (const axe of axes) {
    // Utiliser findOneAndUpdate avec upsert pour éviter les doublons
    const result = await Axe.findOneAndUpdate(
      { nom: axe.Nom }, // Critère de recherche
      {
        nom: axe.Nom,
        description: axe.Nom,
        ordre: axe.ID,
        actif: true,
      },
      { upsert: true, new: true } // Créer si n'existe pas, retourner le nouveau doc
    );
    idMaps.axes.set(axe.ID, result._id.toString());
    console.log(`  ✓ Axe créé/mis à jour: ${axe.Nom}`);
  }
  console.log(`✅ ${axes.length} axes importés`);
}

async function importGrandesCategories() {
  console.log("\n📊 Import des Grandes Catégories...");
  const grandesCategories = readJsonFile("All-Grande-Categories.json");

  for (const gc of grandesCategories) {
    const result = await GrandeCategorie.findOneAndUpdate(
      { nom: gc.Nom },
      {
        nom: gc.Nom,
        ordre: gc.ID,
      },
      { upsert: true, new: true }
    );
    idMaps.grandesCategories.set(gc.ID, result._id.toString());
    console.log(`  ✓ Grande Catégorie créée/mise à jour: ${gc.Nom}`);
  }
  console.log(`✅ ${grandesCategories.length} grandes catégories importées`);
}

async function importCategories() {
  console.log("\n📊 Import des Catégories...");
  const categories = readJsonFile("All-Categories.json");

  for (const cat of categories) {
    const grandeCategorieId = idMaps.grandesCategories.get(cat.ID_Gdcat);
    if (!grandeCategorieId) {
      console.warn(`  ⚠ Grande catégorie non trouvée pour ID ${cat.ID_Gdcat}`);
      continue;
    }

    const result = await Categorie.findOneAndUpdate(
      { nom: cat.Nom },
      {
        nom: cat.Nom,
        grandeCategorie: grandeCategorieId,
        ordre: cat.ID,
      },
      { upsert: true, new: true }
    );
    idMaps.categories.set(cat.ID, result._id.toString());
    console.log(`  ✓ Catégorie créée/mise à jour: ${cat.Nom}`);
  }
  console.log(`✅ ${categories.length} catégories importées`);
}

async function importCibles() {
  console.log("\n📊 Import des Cibles...");
  const cibles = readJsonFile("All-Cibles.json");

  for (const cible of cibles) {
    const categorieId = idMaps.categories.get(cible.ID_Cat);
    const grandeCategorieId = idMaps.grandesCategories.get(cible.ID_Gdcat);

    if (!categorieId || !grandeCategorieId) {
      console.warn(
        `  ⚠ Catégorie/GrandeCategorie non trouvée pour cible ${cible.Nom}`
      );
      continue;
    }

    const result = await Cible.findOneAndUpdate(
      { nom: cible.Nom },
      {
        nom: cible.Nom,
        categorie: categorieId,
        grandeCategorie: grandeCategorieId,
        ordre: parseInt(cible.ID, 10) || 0,
      },
      { upsert: true, new: true }
    );
    idMaps.cibles.set(parseInt(cible.ID, 10) || 0, result._id.toString());
    console.log(`  ✓ Cible créée/mise à jour: ${cible.Nom}`);
  }
  console.log(`✅ ${cibles.length} cibles importées`);
}

async function importProvinces() {
  console.log("\n📊 Import des Provinces...");
  const provinces = readJsonFile("AllProvinces.json");

  for (const prov of provinces) {
    const result = await Province.findOneAndUpdate(
      { nom: prov.Nom },
      {
        nom: prov.Nom,
        ordre: parseInt(prov.ID, 10) || 0,
        actif: true,
      },
      { upsert: true, new: true }
    );
    idMaps.provinces.set(parseInt(prov.ID, 10) || 0, result._id.toString());
    console.log(`  ✓ Province créée/mise à jour: ${prov.Nom}`);
  }
  console.log(`✅ ${provinces.length} provinces importées`);
}

async function importAnnees() {
  console.log("\n📊 Import des Années...");
  const annees = readJsonFile("All-Annees.json");

  for (const annee of annees) {
    const anneeValue = parseInt(annee.Valeur, 10);

    if (isNaN(anneeValue)) {
      console.warn(`  ⚠ Année invalide: ${annee.Valeur}`);
      continue;
    }

    const result = await Annee.findOneAndUpdate(
      { annee: anneeValue },
      {
        annee: anneeValue,
        actif: true,
        ordre: parseInt(annee.ID, 10),
      },
      { upsert: true, new: true }
    );
    idMaps.annees.set(parseInt(annee.ID, 10), result._id.toString());
    console.log(`  ✓ Année créée/mise à jour: ${anneeValue}`);
  }
  console.log(`✅ ${annees.length} années importées`);
}

async function importStructures() {
  console.log("\n📊 Import des Structures...");
  const structures = readJsonFile("All-Structures.json");

  for (const struct of structures) {
    // Skip if no name
    if (!struct.Nom || struct.Nom.trim() === "") {
      console.warn(`  ⚠ Structure sans nom, ignorée`);
      continue;
    }

    const structId = parseInt(struct.ID, 10);
    if (isNaN(structId)) {
      console.warn(`  ⚠ ID invalide pour structure: ${struct.Nom}`);
      continue;
    }

    const result = await Structure.findOneAndUpdate(
      { nom: struct.Nom },
      {
        nom: struct.Nom,
        type: struct.Type || "Organisation",
        description: struct.APropos || struct.Description || "",
        adresse: struct.Adresse || "",
        telephone: struct["Phone Organisation"] || struct.Phone || "",
        email: struct["Email Organisation"] || struct.Email || "",
        siteWeb: struct.SiteWeb || "",
        actif: true,
      },
      { upsert: true, new: true }
    );
    idMaps.structures.set(structId, result._id.toString());
    console.log(`  ✓ Structure créée/mise à jour: ${struct.Nom}`);
  }
  console.log(`✅ ${structures.length} structures importées`);
}

async function importTypesLMA() {
  console.log("\n📊 Import des Types LMA...");
  const types = [
    { nom: "Lois", code: "LOI" },
    { nom: "Mesures", code: "MES" },
    { nom: "Mécanismes", code: "MEC" },
    { nom: "Actions", code: "ACT" },
  ];

  let id = 1;
  for (const type of types) {
    const newType = await TypeLMA.findOneAndUpdate(
      { code: type.code },
      { nom: type.nom, code: type.code },
      { upsert: true, new: true }
    );
    idMaps.typeLMA.set(id++, newType._id.toString());
    console.log(`  ✓ Type LMA créé/mis à jour: ${type.nom}`);
  }
  console.log(`✅ ${types.length} types LMA importés`);
}

async function importLoisMesuresActions() {
  console.log("\n📊 Import des Lois/Mesures/Actions...");
  const lmas = readJsonFile("All-LoisMesMecActs.json");

  for (const lma of lmas) {
    let typeId = idMaps.typeLMA.get(1); // Default to Lois
    if (lma.Type === "Mesure") typeId = idMaps.typeLMA.get(2);
    else if (lma.Type === "Mécanisme") typeId = idMaps.typeLMA.get(3);
    else if (lma.Type === "Action") typeId = idMaps.typeLMA.get(4);

    const lmaId = parseInt(lma.ID, 10);
    if (isNaN(lmaId)) {
      console.warn(`  ⚠ ID invalide pour LMA: ${lma.Nom}`);
      continue;
    }

    const newLMA = await LoisMesuresActions.findOneAndUpdate(
      { nom: lma.Nom, type: typeId },
      {
        nom: lma.Nom,
        type: typeId,
        description: lma.Description || "",
        annee: lma.Annee ? parseInt(lma.Annee, 10) : undefined,
        reference: lma.Reference,
        statut: "en vigueur",
      },
      { upsert: true, new: true }
    );
    idMaps.loisMesuresActions.set(lmaId, newLMA._id.toString());
    console.log(`  ✓ ${lma.Type} créé/mis à jour: ${lma.Nom}`);
  }
  console.log(`✅ ${lmas.length} lois/mesures/actions importées`);
}

async function importIndicateurs() {
  console.log("\n📊 Import des Indicateurs...");
  const indicateurs = readJsonFile("All-Indicateurs.json");

  for (const ind of indicateurs) {
    const axeId = idMaps.axes.get(ind.ID_Axe);
    if (!axeId) {
      console.warn(`  ⚠ Axe non trouvé pour indicateur ${ind.Nom}`);
      continue;
    }

    // Désagrégeable: 1 = numérique, 2 = qualitatif
    const type = ind.Désagrégeable === 1 ? "numerique" : "qualitatif";

    const indId = parseInt(ind.ID, 10);
    if (isNaN(indId)) {
      console.warn(`  ⚠ ID invalide pour indicateur: ${ind.Nom}`);
      continue;
    }

    const newInd = await Indicateur.findOneAndUpdate(
      { nom: ind.Nom, axe: axeId },
      {
        nom: ind.Nom,
        axe: axeId,
        type: type,
        desagregableParSexe: ind.sexeYN === 1,
        desagregableParProvince: ind.ProvinceYN === 1,
        desagregableParAnnee: true,
        avecCible: ind.cibleYN === 1,
        ordre: indId,
      },
      { upsert: true, new: true }
    );
    idMaps.indicateurs.set(indId, newInd._id.toString());
    console.log(`  ✓ Indicateur créé/mis à jour: ${ind.Nom} (${type})`);
  }
  console.log(`✅ ${indicateurs.length} indicateurs importés`);
}

async function importDataNumeric() {
  console.log("\n📊 Import des Données Numériques...");
  const data = readJsonFile("AllDATANumber.json");
  let imported = 0;

  for (const d of data) {
    const indicateurId = idMaps.indicateurs.get(d.ID_Indicateur);
    if (!indicateurId) continue;

    const provinceId = d.ID_Province
      ? idMaps.provinces.get(d.ID_Province)
      : undefined;
    const cibleId = d.ID_Cible ? idMaps.cibles.get(d.ID_Cible) : undefined;

    // Déterminer le sexe
    let sexe: "Homme" | "Femme" | "Total" = "Total";
    if (d.Sexe === "H" || d.Sexe === "Homme") sexe = "Homme";
    else if (d.Sexe === "F" || d.Sexe === "Femme") sexe = "Femme";

    try {
      await DataNumeric.findOneAndUpdate(
        {
          indicateur: indicateurId,
          annee: d.Annee,
          sexe: sexe,
          province: provinceId || null,
          cible: cibleId || null,
        },
        {
          indicateur: indicateurId,
          annee: d.Annee,
          sexe: sexe,
          province: provinceId,
          cible: cibleId,
          valeur: d.Valeur || 0,
          pourcentage: d.Pourcentage,
        },
        { upsert: true, new: true }
      );
      imported++;
    } catch (error: any) {
      console.warn(`  ⚠ Erreur import donnée: ${error.message}`);
    }
  }
  console.log(`✅ ${imported}/${data.length} données numériques importées`);
}

async function importDataQualitative() {
  console.log("\n📊 Import des Données Qualitatives...");
  const dataListes = readJsonFile("AllDataListes.json");
  let imported = 0;

  // Grouper par indicateur
  const byIndicateur = new Map<number, unknown[]>();
  for (const d of dataListes) {
    if (!byIndicateur.has(d.ID_Indicateur)) {
      byIndicateur.set(d.ID_Indicateur, []);
    }
    byIndicateur.get(d.ID_Indicateur)!.push(d);
  }

  for (const [oldIndId, items] of byIndicateur) {
    const indicateurId = idMaps.indicateurs.get(oldIndId);
    if (!indicateurId) continue;

    const mappedItems = items
      .map((item: any) => {
        const lmaId = idMaps.loisMesuresActions.get(item.ID_LMA);
        if (!lmaId) return null;
        return {
          loisMesuresActions: lmaId,
          annee: item.Annee,
          ordre: item.Ordre || 0,
        };
      })
      .filter((item) => item !== null);

    if (mappedItems.length > 0) {
      await DataQualitative.findOneAndUpdate(
        { indicateur: indicateurId },
        { indicateur: indicateurId, items: mappedItems },
        { upsert: true, new: true }
      );
      imported++;
      console.log(
        `  ✓ Liste qualitative créée/mise à jour pour indicateur ID ${oldIndId}`
      );
    }
  }
  console.log(`✅ ${imported} listes qualitatives importées`);
}

async function createUserBen() {
  console.log("\n👤 Création de l'utilisateur ben@gmail.com...");

  // Find USER role
  const userRole = await Role.findOne({ code: "USER" });
  if (!userRole) {
    console.error("❌ Rôle USER non trouvé");
    return;
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: "ben@gmail.com" });
  if (existingUser) {
    console.log("  ℹ Utilisateur ben@gmail.com existe déjà");
    return;
  }

  await User.create({
    nom: "Mukendi",
    prenom: "Ben",
    email: "ben@gmail.com",
    password: "12345",
    role: userRole._id,
    fonction: "Utilisateur Test",
    organisation: "Test",
    statut: "actif",
  });

  console.log("✅ Utilisateur ben@gmail.com créé (mot de passe: 12345)");
}

export async function importAllOldData(clearExisting = false) {
  try {
    await connectDB();
    console.log("🚀 Démarrage de l'import des données...\n");

    // Option: Supprimer les données existantes
    if (clearExisting) {
      console.log("🗑️  Suppression des données existantes...");

      // Supprimer les données
      await Promise.all([
        Axe.deleteMany({}),
        GrandeCategorie.deleteMany({}),
        Categorie.deleteMany({}),
        Cible.deleteMany({}),
        Province.deleteMany({}),
        Annee.deleteMany({}),
        Structure.deleteMany({}),
        TypeLMA.deleteMany({}),
        LoisMesuresActions.deleteMany({}),
        Indicateur.deleteMany({}),
        DataNumeric.deleteMany({}),
        DataQualitative.deleteMany({}),
      ]);

      // Supprimer les anciens index pour éviter les conflits
      console.log("🗑️  Suppression des anciens index...");
      try {
        const collections = [
          Axe,
          GrandeCategorie,
          Categorie,
          Cible,
          Province,
          Annee,
          Structure,
          TypeLMA,
          LoisMesuresActions,
          Indicateur,
          DataNumeric,
          DataQualitative,
        ];

        for (const Model of collections) {
          try {
            await Model.collection.dropIndexes();
            console.log(`  ✓ Index supprimés pour ${Model.modelName}`);
          } catch (err: unknown) {
            // Ignorer l'erreur si la collection n'existe pas
            const error = err as { code?: number };
            if (error.code !== 26) {
              // 26 = NamespaceNotFound
              console.warn(
                `  ⚠ Erreur suppression index ${Model.modelName}:`,
                err
              );
            }
          }
        }
      } catch (error) {
        console.warn("⚠️  Erreur lors de la suppression des index:", error);
      }

      console.log("✅ Données existantes supprimées\n");
    }

    // Import dans l'ordre des dépendances
    await importAxes();
    await importGrandesCategories();
    await importCategories();
    await importCibles();
    await importProvinces();
    await importAnnees();
    await importStructures();
    await importTypesLMA();
    await importLoisMesuresActions();
    await importIndicateurs();
    await importDataNumeric();
    await importDataQualitative();
    await createUserBen();

    console.log("\n✅ Import terminé avec succès!");
    console.log("\n📊 Résumé:");
    console.log(`  - ${idMaps.axes.size} axes`);
    console.log(`  - ${idMaps.grandesCategories.size} grandes catégories`);
    console.log(`  - ${idMaps.categories.size} catégories`);
    console.log(`  - ${idMaps.cibles.size} cibles`);
    console.log(`  - ${idMaps.provinces.size} provinces`);
    console.log(`  - ${idMaps.annees.size} années`);
    console.log(`  - ${idMaps.structures.size} structures`);
    console.log(`  - ${idMaps.indicateurs.size} indicateurs`);
    console.log(`  - ${idMaps.loisMesuresActions.size} lois/mesures/actions`);

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
    throw error;
  }
}

// Si exécuté directement
if (require.main === module) {
  importAllOldData()
    .then(() => {
      console.log("\n🎉 Import terminé!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erreur fatale:", error);
      process.exit(1);
    });
}
