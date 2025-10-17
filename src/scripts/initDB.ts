import connectDB from "@/lib/mongodb";
import { Axe, Province, Annee, Sexe } from "@/models/Referentiel";
import { Role, Privilege, User } from "@/models/User";
import { TypeLMA } from "@/models/Data";

export async function initializeDatabase() {
  try {
    await connectDB();
    console.log("🔌 Connexion à MongoDB établie");

    // 1. Créer les privilèges
    await createPrivileges();

    // 2. Créer les rôles
    await createRoles();

    // 3. Créer les utilisateurs
    await createUsers();

    // 4. Créer les axes
    await createAxes();

    // 5. Créer les provinces
    await createProvinces();

    // 6. Créer les années
    await createAnnees();

    // 7. Créer les sexes
    await createSexes();

    // 8. Créer les types LMA
    await createTypesLMA();

    console.log("✅ Base de données initialisée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    throw error;
  }
}

async function createPrivileges() {
  const privileges = [
    // Référentiel
    {
      nom: "Créer Axe",
      code: "CREATE_AXE",
      module: "referentiel",
      action: "create",
    },
    {
      nom: "Lire Référentiel",
      code: "READ_REFERENTIEL",
      module: "referentiel",
      action: "read",
    },
    {
      nom: "Modifier Référentiel",
      code: "UPDATE_REFERENTIEL",
      module: "referentiel",
      action: "update",
    },
    {
      nom: "Supprimer Référentiel",
      code: "DELETE_REFERENTIEL",
      module: "referentiel",
      action: "delete",
    },

    // Données
    {
      nom: "Saisir Données",
      code: "CREATE_DATA",
      module: "donnees",
      action: "create",
    },
    {
      nom: "Lire Données",
      code: "READ_DATA",
      module: "donnees",
      action: "read",
    },
    {
      nom: "Modifier Données",
      code: "UPDATE_DATA",
      module: "donnees",
      action: "update",
    },
    {
      nom: "Supprimer Données",
      code: "DELETE_DATA",
      module: "donnees",
      action: "delete",
    },
    {
      nom: "Valider Données",
      code: "VALIDATE_DATA",
      module: "donnees",
      action: "validate",
    },
    {
      nom: "Publier Données",
      code: "PUBLISH_DATA",
      module: "donnees",
      action: "publish",
    },

    // Utilisateurs
    {
      nom: "Créer Utilisateur",
      code: "CREATE_USER",
      module: "utilisateurs",
      action: "create",
    },
    {
      nom: "Lire Utilisateurs",
      code: "READ_USERS",
      module: "utilisateurs",
      action: "read",
    },
    {
      nom: "Modifier Utilisateur",
      code: "UPDATE_USER",
      module: "utilisateurs",
      action: "update",
    },
    {
      nom: "Supprimer Utilisateur",
      code: "DELETE_USER",
      module: "utilisateurs",
      action: "delete",
    },

    // Rapports
    {
      nom: "Générer Rapports",
      code: "CREATE_REPORT",
      module: "rapports",
      action: "create",
    },
    {
      nom: "Lire Rapports",
      code: "READ_REPORTS",
      module: "rapports",
      action: "read",
    },
    {
      nom: "Exporter Données",
      code: "EXPORT_DATA",
      module: "rapports",
      action: "create",
    },
  ];

  for (const privilegeData of privileges) {
    await Privilege.findOneAndUpdate(
      { code: privilegeData.code },
      privilegeData,
      { upsert: true, new: true }
    );
  }
  console.log("🔐 Privilèges créés");
}

async function createRoles() {
  const allPrivileges = await Privilege.find();

  const roles = [
    {
      nom: "Administrateur",
      code: "ADMIN",
      niveau: 1,
      description: "Accès complet à toutes les fonctionnalités",
      privileges: allPrivileges.map((p) => p._id),
    },
    {
      nom: "Éditeur",
      code: "EDITOR",
      niveau: 2,
      description: "Peut saisir et modifier les données",
      privileges: allPrivileges
        .filter(
          (p) =>
            !p.code.includes("DELETE_USER") && !p.code.includes("CREATE_USER")
        )
        .map((p) => p._id),
    },
    {
      nom: "Consultant",
      code: "VIEWER",
      niveau: 3,
      description: "Accès en lecture seule",
      privileges: allPrivileges
        .filter(
          (p) =>
            p.action === "read" ||
            p.code === "CREATE_REPORT" ||
            p.code === "EXPORT_DATA"
        )
        .map((p) => p._id),
    },
  ];

  for (const roleData of roles) {
    await Role.findOneAndUpdate({ code: roleData.code }, roleData, {
      upsert: true,
      new: true,
    });
  }
  console.log("👥 Rôles créés");
}

async function createUsers() {
  const adminRole = await Role.findOne({ code: "ADMIN" });
  const editorRole = await Role.findOne({ code: "EDITOR" });
  const viewerRole = await Role.findOne({ code: "VIEWER" });

  const users = [
    {
      nom: "Administrateur",
      prenom: "Système",
      email: "admin@sn1325.cd",
      password: "admin123",
      role: adminRole?._id,
      fonction: "Administrateur Système",
      organisation: "SN1325",
      statut: "actif",
    },
    {
      nom: "Mukendi",
      prenom: "Marie",
      email: "editeur@sn1325.cd",
      password: "edit123",
      role: editorRole?._id,
      fonction: "Responsable Données",
      organisation: "Ministère du Genre",
      statut: "actif",
    },
    {
      nom: "Kabila",
      prenom: "Joseph",
      email: "consultant@sn1325.cd",
      password: "consult123",
      role: viewerRole?._id,
      fonction: "Consultant",
      organisation: "Expert Externe",
      statut: "actif",
    },
  ];

  for (const userData of users) {
    await User.findOneAndUpdate({ email: userData.email }, userData, {
      upsert: true,
      new: true,
    });
  }
  console.log("👤 Utilisateurs créés");
}

async function createAxes() {
  const axes = [
    {
      nom: "Prévention",
      description:
        "Mécanismes d'alerte précoce et action avant l'éclatement des conflits",
      code: "PREV",
      ordre: 1,
    },
    {
      nom: "Participation",
      description:
        "Participation des femmes aux instances de prise de décision",
      code: "PART",
      ordre: 2,
    },
    {
      nom: "Protection",
      description:
        "Protection des droits des femmes et lutte contre l'impunité",
      code: "PROT",
      ordre: 3,
    },
    {
      nom: "Relèvement",
      description: "Intégration du genre dans les projets post-conflit",
      code: "REL",
      ordre: 4,
    },
    {
      nom: "Coordination",
      description: "Suivi et évaluation des mécanismes de coordination",
      code: "COORD",
      ordre: 5,
    },
  ];

  for (const axeData of axes) {
    await Axe.findOneAndUpdate({ code: axeData.code }, axeData, {
      upsert: true,
      new: true,
    });
  }
  console.log("📊 Axes créés");
}

async function createProvinces() {
  const provinces = [
    { nom: "Kinshasa", code: "KIN", region: "Kinshasa" },
    { nom: "Bas-Uele", code: "BU", region: "Nord" },
    { nom: "Équateur", code: "EQ", region: "Nord-Ouest" },
    { nom: "Haut-Katanga", code: "HK", region: "Sud-Est" },
    { nom: "Haut-Lomami", code: "HL", region: "Centre-Sud" },
    { nom: "Haut-Uele", code: "HU", region: "Nord-Est" },
    { nom: "Ituri", code: "IT", region: "Nord-Est" },
    { nom: "Kasaï", code: "KS", region: "Centre" },
    { nom: "Kasaï Central", code: "KC", region: "Centre" },
    { nom: "Kasaï Oriental", code: "KO", region: "Centre" },
    { nom: "Kongo Central", code: "KoC", region: "Ouest" },
    { nom: "Kwango", code: "KW", region: "Sud-Ouest" },
    { nom: "Kwilu", code: "KWI", region: "Sud-Ouest" },
    { nom: "Lomami", code: "LOM", region: "Centre" },
    { nom: "Lualaba", code: "LUA", region: "Sud" },
    { nom: "Mai-Ndombe", code: "MN", region: "Ouest" },
    { nom: "Maniema", code: "MAN", region: "Est" },
    { nom: "Mongala", code: "MON", region: "Nord" },
    { nom: "Nord-Kivu", code: "NK", region: "Est" },
    { nom: "Nord-Ubangi", code: "NU", region: "Nord" },
    { nom: "Sankuru", code: "SAN", region: "Centre" },
    { nom: "Sud-Kivu", code: "SK", region: "Est" },
    { nom: "Sud-Ubangi", code: "SU", region: "Nord-Ouest" },
    { nom: "Tanganyika", code: "TAN", region: "Sud-Est" },
    { nom: "Tshopo", code: "TSH", region: "Nord-Est" },
    { nom: "Tshuapa", code: "TSU", region: "Centre-Nord" },
  ];

  for (const provinceData of provinces) {
    await Province.findOneAndUpdate({ code: provinceData.code }, provinceData, {
      upsert: true,
      new: true,
    });
  }
  console.log("🗺️ Provinces créées");
}

async function createAnnees() {
  const currentYear = new Date().getFullYear();
  const startYear = 2000;

  for (let year = startYear; year <= currentYear + 2; year++) {
    await Annee.findOneAndUpdate(
      { valeur: year },
      { valeur: year },
      { upsert: true, new: true }
    );
  }
  console.log("📅 Années créées");
}

async function createSexes() {
  const sexes = [
    { nom: "Homme", code: "H" },
    { nom: "Femme", code: "F" },
  ];

  for (const sexeData of sexes) {
    await Sexe.findOneAndUpdate({ code: sexeData.code }, sexeData, {
      upsert: true,
      new: true,
    });
  }
  console.log("⚧️ Sexes créés");
}

async function createTypesLMA() {
  const types = [
    { nom: "Loi", code: "LOI", description: "Texte législatif adopté" },
    {
      nom: "Décret",
      code: "DECRET",
      description: "Décret présidentiel ou ministériel",
    },
    {
      nom: "Arrêté",
      code: "ARRETE",
      description: "Arrêté ministériel ou administratif",
    },
    {
      nom: "Politique",
      code: "POLITIQUE",
      description: "Document de politique sectorielle",
    },
    {
      nom: "Mesure",
      code: "MESURE",
      description: "Mesure administrative ou opérationnelle",
    },
    {
      nom: "Programme",
      code: "PROGRAMME",
      description: "Programme ou projet spécifique",
    },
  ];

  for (const typeData of types) {
    await TypeLMA.findOneAndUpdate({ code: typeData.code }, typeData, {
      upsert: true,
      new: true,
    });
  }
  console.log("📄 Types LMA créés");
}
