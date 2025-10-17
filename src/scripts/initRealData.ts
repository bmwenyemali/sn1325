import connectDB from "../lib/mongodb";
import { Axe, Province } from "../models/Referentiel";
import { User, Role, Privilege } from "../models/User";
import { SimpleData } from "../models/SimpleData";

export async function initializeRealData() {
  try {
    await connectDB();
    console.log("🔌 Connexion à MongoDB établie");

    // Supprimer les données existantes
    await Promise.all([
      Axe.deleteMany({}),
      Province.deleteMany({}),
      User.deleteMany({}),
      Role.deleteMany({}),
      Privilege.deleteMany({}),
      SimpleData.deleteMany({}),
    ]);
    console.log("🗑️ Données existantes supprimées");

    // 1. Créer les 5 axes stratégiques
    const axes = await Axe.insertMany([
      {
        code: "PART",
        nom: "Participation",
        description:
          "Participation accrue des femmes aux processus de prise de décision et aux négociations de paix",
        couleur: "#002B7F",
        ordre: 1,
        statut: "actif",
        dateCreation: new Date(),
        dateModification: new Date(),
      },
      {
        code: "PROT",
        nom: "Protection",
        description:
          "Protection des droits des femmes et des filles en période de conflit et post-conflit",
        couleur: "#FCD116",
        ordre: 2,
        statut: "actif",
        dateCreation: new Date(),
        dateModification: new Date(),
      },
      {
        code: "PREV",
        nom: "Prévention",
        description:
          "Prévention des conflits et des violences basées sur le genre",
        couleur: "#CE1126",
        ordre: 3,
        statut: "actif",
        dateCreation: new Date(),
        dateModification: new Date(),
      },
      {
        code: "RELV",
        nom: "Relèvement",
        description: "Relèvement et reconstruction tenant compte du genre",
        couleur: "#28A745",
        ordre: 4,
        statut: "actif",
        dateCreation: new Date(),
        dateModification: new Date(),
      },
      {
        code: "COORD",
        nom: "Coordination",
        description: "Coordination et mise en œuvre de la résolution 1325",
        couleur: "#6F42C1",
        ordre: 5,
        statut: "actif",
        dateCreation: new Date(),
        dateModification: new Date(),
      },
    ]);
    console.log("✅ Axes stratégiques créés:", axes.length);

    // 2. Créer les 26 provinces de la RDC
    const provinces = await Province.insertMany([
      { nom: "Kinshasa", code: "KIN", region: "Kinshasa", statut: "actif" },
      { nom: "Bas-Uélé", code: "BU", region: "Orientale", statut: "actif" },
      { nom: "Équateur", code: "EQ", region: "Équateur", statut: "actif" },
      { nom: "Haut-Katanga", code: "HK", region: "Katanga", statut: "actif" },
      { nom: "Haut-Lomami", code: "HL", region: "Katanga", statut: "actif" },
      { nom: "Haut-Uélé", code: "HU", region: "Orientale", statut: "actif" },
      { nom: "Ituri", code: "IT", region: "Orientale", statut: "actif" },
      { nom: "Kasaï", code: "KS", region: "Kasaï", statut: "actif" },
      { nom: "Kasaï-Central", code: "KC", region: "Kasaï", statut: "actif" },
      { nom: "Kasaï-Oriental", code: "KO", region: "Kasaï", statut: "actif" },
      {
        nom: "Kongo-Central",
        code: "KgC",
        region: "Kongo-Central",
        statut: "actif",
      },
      { nom: "Kwango", code: "KW", region: "Kwango", statut: "actif" },
      { nom: "Kwilu", code: "KL", region: "Kwilu", statut: "actif" },
      { nom: "Lomami", code: "LM", region: "Katanga", statut: "actif" },
      { nom: "Lualaba", code: "LU", region: "Katanga", statut: "actif" },
      { nom: "Mai-Ndombe", code: "MN", region: "Mai-Ndombe", statut: "actif" },
      { nom: "Maniema", code: "MA", region: "Maniema", statut: "actif" },
      { nom: "Mongala", code: "MO", region: "Équateur", statut: "actif" },
      { nom: "Nord-Kivu", code: "NK", region: "Nord-Kivu", statut: "actif" },
      { nom: "Nord-Ubangi", code: "NU", region: "Équateur", statut: "actif" },
      { nom: "Sankuru", code: "SA", region: "Kasaï", statut: "actif" },
      { nom: "Sud-Kivu", code: "SK", region: "Sud-Kivu", statut: "actif" },
      { nom: "Sud-Ubangi", code: "SU", region: "Équateur", statut: "actif" },
      { nom: "Tanganyika", code: "TA", region: "Katanga", statut: "actif" },
      { nom: "Tshopo", code: "TS", region: "Orientale", statut: "actif" },
      { nom: "Tshuapa", code: "TSH", region: "Équateur", statut: "actif" },
    ]);
    console.log("✅ Provinces créées:", provinces.length);

    // 3. Créer rôles et privilèges pour l'admin
    // Créer tous les privilèges nécessaires
    const privileges = await Privilege.insertMany([
      {
        nom: "Lecture",
        code: "READ",
        description: "Lecture des données",
        module: "all",
        action: "read",
      },
      {
        nom: "Écriture",
        code: "WRITE",
        description: "Création et modification",
        module: "all",
        action: "create",
      },
      {
        nom: "Suppression",
        code: "DELETE",
        description: "Suppression des données",
        module: "all",
        action: "delete",
      },
      {
        nom: "Administration",
        code: "ADMIN",
        description: "Administration complète",
        module: "all",
        action: "publish",
      },
    ]);
    console.log("✅ Privilèges créés:", privileges.length);

    // Créer le rôle Admin
    const adminRole = await Role.create({
      nom: "Administrateur",
      code: "ADMIN",
      description: "Administrateur système avec tous les droits",
      niveau: 1,
      privileges: privileges.map((p) => p._id),
      active: true,
    });
    console.log("✅ Rôle Admin créé");

    // Créer le rôle Consultant
    const consultantRole = await Role.create({
      nom: "Consultant",
      code: "CONSULTANT",
      description: "Consultant avec accès en lecture et saisie de données",
      niveau: 3,
      privileges: privileges
        .filter((p) => ["READ", "WRITE"].includes(p.code))
        .map((p) => p._id),
      active: true,
    });
    console.log("✅ Rôle Consultant créé");

    // Créer l'utilisateur administrateur par défaut
    const adminUser = await User.create({
      nom: "Admin",
      prenom: "Système",
      email: "admin@sn1325.cd",
      password: "admin123",
      role: adminRole._id,
      privileges: privileges.map((p) => p._id),
      province: provinces.find((p) => p.nom === "Kinshasa")?._id,
      fonction: "Administrateur Système",
      organisation: "Secrétariat National 1325",
      statut: "actif",
    });
    console.log("✅ Utilisateur admin créé:", adminUser.email);

    // Créer l'utilisateur consultant par défaut
    const consultantUser = await User.create({
      nom: "Mukendi",
      prenom: "Consultant",
      email: "consultant@sn1325.cd",
      password: "consult123",
      role: consultantRole._id,
      privileges: privileges
        .filter((p) => ["READ", "WRITE"].includes(p.code))
        .map((p) => p._id),
      province: provinces.find((p) => p.nom === "Nord-Kivu")?._id,
      fonction: "Consultant Technique",
      organisation: "ONU Femmes",
      statut: "actif",
    });
    console.log("✅ Utilisateur consultant créé:", consultantUser.email);

    // 4. Injecter quelques données réelles basées sur les rapports 2022 et 2025
    const participationAxe = axes.find((a) => a.nom === "Participation");
    const protectionAxe = axes.find((a) => a.nom === "Protection");
    const preventionAxe = axes.find((a) => a.nom === "Prévention");
    const kinshasa = provinces.find((p) => p.nom === "Kinshasa");
    const nordKivu = provinces.find((p) => p.nom === "Nord-Kivu");
    const sudKivu = provinces.find((p) => p.nom === "Sud-Kivu");

    const sampleData = await SimpleData.insertMany([
      // Données Participation 2022
      {
        axeId: participationAxe?._id,
        indicateurId: null, // Sera créé plus tard
        provinceId: kinshasa?._id,
        annee: 2022,
        trimestre: "T4",
        valeurNumerique: 13.6,
        uniteMesure: "%",
        description: "Pourcentage de femmes à l'Assemblée Nationale",
        commentaire: "Données du rapport parlementaire 2022",
        statut: "valide",
        source: "Assemblée Nationale RDC",
        dateCreation: new Date(),
        dateModification: new Date(),
        createdBy: adminUser._id,
      },
      {
        axeId: participationAxe?._id,
        provinceId: kinshasa?._id,
        annee: 2022,
        trimestre: "T4",
        valeurNumerique: 8.2,
        uniteMesure: "%",
        description: "Pourcentage de femmes au Sénat",
        commentaire: "Données officielles du Sénat",
        statut: "valide",
        source: "Sénat RDC",
        dateCreation: new Date(),
        dateModification: new Date(),
        createdBy: adminUser._id,
      },
      // Données Protection 2022
      {
        axeId: protectionAxe?._id,
        provinceId: nordKivu?._id,
        annee: 2022,
        trimestre: "T4",
        valeurNumerique: 2847,
        uniteMesure: "cas",
        description: "Cas de violences basées sur le genre signalés",
        commentaire: "Données UNFPA Nord-Kivu",
        statut: "valide",
        source: "UNFPA",
        dateCreation: new Date(),
        dateModification: new Date(),
        createdBy: adminUser._id,
      },
      {
        axeId: protectionAxe?._id,
        provinceId: sudKivu?._id,
        annee: 2022,
        trimestre: "T4",
        valeurNumerique: 1923,
        uniteMesure: "cas",
        description: "Cas de violences basées sur le genre signalés",
        commentaire: "Données UNFPA Sud-Kivu",
        statut: "valide",
        source: "UNFPA",
        dateCreation: new Date(),
        dateModification: new Date(),
        createdBy: adminUser._id,
      },
      // Données Prévention 2022
      {
        axeId: preventionAxe?._id,
        provinceId: nordKivu?._id,
        annee: 2022,
        trimestre: "T4",
        valeurNumerique: 42,
        uniteMesure: "comités",
        description: "Comités de paix avec participation féminine active",
        commentaire: "Mécanismes d'alerte précoce opérationnels",
        statut: "valide",
        source: "MONUSCO",
        dateCreation: new Date(),
        dateModification: new Date(),
        createdBy: adminUser._id,
      },
      // Données 2025 (projections/objectifs)
      {
        axeId: participationAxe?._id,
        provinceId: kinshasa?._id,
        annee: 2025,
        trimestre: "T1",
        valeurNumerique: 18.5,
        uniteMesure: "%",
        description: "Objectif femmes à l'Assemblée Nationale",
        commentaire: "Objectif Plan d'Action National 2025",
        statut: "planifie",
        source: "Plan d'Action National 1325",
        dateCreation: new Date(),
        dateModification: new Date(),
        createdBy: adminUser._id,
      },
      {
        axeId: protectionAxe?._id,
        provinceId: nordKivu?._id,
        annee: 2025,
        trimestre: "T1",
        valeurTexte:
          "Amélioration significative de l'accès à la justice pour les femmes victimes de violences",
        uniteMesure: "évaluation qualitative",
        description: "Évaluation de l'accès à la justice",
        commentaire: "Objectif stratégique pour 2025",
        statut: "planifie",
        source: "Ministère de la Justice",
        dateCreation: new Date(),
        dateModification: new Date(),
        createdBy: adminUser._id,
      },
    ]);
    console.log("✅ Données réelles injectées:", sampleData.length);

    console.log("\n🎉 Initialisation complète réussie !");
    console.log("📊 Résumé:");
    console.log(`   - ${axes.length} axes stratégiques`);
    console.log(`   - ${provinces.length} provinces`);
    console.log(`   - 2 utilisateurs (admin + consultant)`);
    console.log(`   - ${sampleData.length} entrées de données`);
    console.log("\n🔑 Comptes de connexion:");
    console.log("   Admin: admin@sn1325.cd / admin123");
    console.log("   Consultant: consultant@sn1325.cd / consult123");

    return {
      success: true,
      summary: {
        axes: axes.length,
        provinces: provinces.length,
        users: 2,
        dataEntries: sampleData.length,
      },
    };
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  initializeRealData()
    .then(() => {
      console.log("✅ Script terminé avec succès");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Erreur fatale:", error);
      process.exit(1);
    });
}
