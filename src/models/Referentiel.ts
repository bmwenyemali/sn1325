import mongoose, { Schema, Document } from "mongoose";

// Interface pour les Axes
export interface IAxe extends Document {
  nom: string;
  description: string;
  code: string;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Grandes Catégories
export interface IGrandeCategorie extends Document {
  nom: string;
  description: string;
  axe: mongoose.Types.ObjectId;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Catégories
export interface ICategorie extends Document {
  nom: string;
  description: string;
  grandeCategorie: mongoose.Types.ObjectId;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Cibles
export interface ICible extends Document {
  nom: string;
  description: string;
  categorie: mongoose.Types.ObjectId;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Indicateurs
export interface IIndicateur extends Document {
  nom: string;
  description: string;
  code: string;
  cible: mongoose.Types.ObjectId;
  axe: mongoose.Types.ObjectId;

  // Configuration de désagrégation
  desagregeable: boolean;
  desagregeableParProvince: boolean;
  desagregeableParSexe: boolean;

  // Type de données
  typeIndicateur: "numerique" | "liste" | "document";
  unite?: string; // Pour les indicateurs numériques

  // Métadonnées
  frequenceCollecte:
    | "mensuelle"
    | "trimestrielle"
    | "semestrielle"
    | "annuelle";
  source: string;
  methodCalcul?: string;
  interpretation?: string;

  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Provinces
export interface IProvince extends Document {
  nom: string;
  code: string;
  region: string;
  population?: number;
  superficie?: number;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Années
export interface IAnnee extends Document {
  valeur: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Sexes
export interface ISexe extends Document {
  nom: string;
  code: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schémas Mongoose
const AxeSchema = new Schema<IAxe>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    ordre: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "axes",
  }
);

const GrandeCategorieSchema = new Schema<IGrandeCategorie>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String },
    axe: { type: Schema.Types.ObjectId, ref: "Axe", required: true },
    ordre: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "grandes_categories",
  }
);

const CategorieSchema = new Schema<ICategorie>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String },
    grandeCategorie: {
      type: Schema.Types.ObjectId,
      ref: "GrandeCategorie",
      required: true,
    },
    ordre: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

const CibleSchema = new Schema<ICible>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String },
    categorie: {
      type: Schema.Types.ObjectId,
      ref: "Categorie",
      required: true,
    },
    ordre: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "cibles",
  }
);

const IndicateurSchema = new Schema<IIndicateur>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    cible: { type: Schema.Types.ObjectId, ref: "Cible", required: true },
    axe: { type: Schema.Types.ObjectId, ref: "Axe", required: true },

    desagregeable: { type: Boolean, default: false },
    desagregeableParProvince: { type: Boolean, default: false },
    desagregeableParSexe: { type: Boolean, default: false },

    typeIndicateur: {
      type: String,
      enum: ["numerique", "liste", "document"],
      required: true,
    },
    unite: { type: String },

    frequenceCollecte: {
      type: String,
      enum: ["mensuelle", "trimestrielle", "semestrielle", "annuelle"],
      default: "annuelle",
    },
    source: { type: String, required: true },
    methodCalcul: { type: String },
    interpretation: { type: String },

    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "indicateurs",
  }
);

const ProvinceSchema = new Schema<IProvince>(
  {
    nom: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    region: { type: String, required: true },
    population: { type: Number },
    superficie: { type: Number },
    coordonnees: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "provinces",
  }
);

const AnneeSchema = new Schema<IAnnee>(
  {
    valeur: { type: Number, required: true, unique: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "annees",
  }
);

const SexeSchema = new Schema<ISexe>(
  {
    nom: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "sexes",
  }
);

// Index pour optimiser les requêtes
AxeSchema.index({ ordre: 1 });
GrandeCategorieSchema.index({ axe: 1, ordre: 1 });
CategorieSchema.index({ grandeCategorie: 1, ordre: 1 });
CibleSchema.index({ categorie: 1, ordre: 1 });
IndicateurSchema.index({ cible: 1 });
IndicateurSchema.index({ axe: 1 });
ProvinceSchema.index({ region: 1 });

// Export des modèles
export const Axe =
  mongoose.models.Axe || mongoose.model<IAxe>("Axe", AxeSchema);
export const GrandeCategorie =
  mongoose.models.GrandeCategorie ||
  mongoose.model<IGrandeCategorie>("GrandeCategorie", GrandeCategorieSchema);
export const Categorie =
  mongoose.models.Categorie ||
  mongoose.model<ICategorie>("Categorie", CategorieSchema);
export const Cible =
  mongoose.models.Cible || mongoose.model<ICible>("Cible", CibleSchema);
export const Indicateur =
  mongoose.models.Indicateur ||
  mongoose.model<IIndicateur>("Indicateur", IndicateurSchema);
export const Province =
  mongoose.models.Province ||
  mongoose.model<IProvince>("Province", ProvinceSchema);
export const Annee =
  mongoose.models.Annee || mongoose.model<IAnnee>("Annee", AnneeSchema);
export const Sexe =
  mongoose.models.Sexe || mongoose.model<ISexe>("Sexe", SexeSchema);
