import mongoose, { Schema, Document } from "mongoose";

// Interface pour les Données Numériques
export interface IDataNumerique extends Document {
  indicateur: mongoose.Types.ObjectId;
  cible: mongoose.Types.ObjectId;
  province?: mongoose.Types.ObjectId;
  sexe?: mongoose.Types.ObjectId;
  annee: mongoose.Types.ObjectId;
  valeur: number;
  commentaire?: string;
  source?: string;
  statut: "brouillon" | "valide" | "publie";
  createdBy: mongoose.Types.ObjectId;
  validatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Lois, Mesures et Actions
export interface ILoiMesureAction extends Document {
  nom: string;
  description: string;
  type: mongoose.Types.ObjectId; // Référence vers TypeLMA
  annee: mongoose.Types.ObjectId;
  commentaire?: string;
  source?: string;
  documentUrl?: string; // URL du document PDF
  statut: "brouillon" | "valide" | "publie";
  createdBy: mongoose.Types.ObjectId;
  validatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Types de Lois/Mesures/Actions
export interface ITypeLMA extends Document {
  nom: string;
  description: string;
  code: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Données Qualitatives (listes)
export interface IDataQualitative extends Document {
  indicateur: mongoose.Types.ObjectId;
  cible: mongoose.Types.ObjectId;
  province?: mongoose.Types.ObjectId;
  annee: mongoose.Types.ObjectId;
  loiMesureActions: mongoose.Types.ObjectId[]; // Liste des lois/mesures/actions
  commentaire?: string;
  statut: "brouillon" | "valide" | "publie";
  createdBy: mongoose.Types.ObjectId;
  validatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Structures (organisations)
export interface IStructure extends Document {
  nom: string;
  sigle?: string;
  domaine: string;
  description?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  siteWeb?: string;
  logo?: string;
  pointFocal?: string;
  cibles?: string[];
  province?: mongoose.Types.ObjectId;
  typeStructure:
    | "gouvernementale"
    | "ong"
    | "association"
    | "internationale"
    | "autre";
  statut: "active" | "inactive";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schémas Mongoose
const DataNumeriqueSchema = new Schema<IDataNumerique>(
  {
    indicateur: {
      type: Schema.Types.ObjectId,
      ref: "Indicateur",
      required: true,
    },
    cible: { type: Schema.Types.ObjectId, ref: "Cible", required: true },
    province: { type: Schema.Types.ObjectId, ref: "Province" },
    sexe: { type: Schema.Types.ObjectId, ref: "Sexe" },
    annee: { type: Schema.Types.ObjectId, ref: "Annee", required: true },
    valeur: { type: Number, required: true },
    commentaire: { type: String },
    source: { type: String },
    statut: {
      type: String,
      enum: ["brouillon", "valide", "publie"],
      default: "brouillon",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    validatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "data_numerique",
  }
);

const TypeLMASchema = new Schema<ITypeLMA>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String },
    code: { type: String, required: true, unique: true, uppercase: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "types_lma",
  }
);

const LoiMesureActionSchema = new Schema<ILoiMesureAction>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: Schema.Types.ObjectId, ref: "TypeLMA", required: true },
    annee: { type: Schema.Types.ObjectId, ref: "Annee", required: true },
    commentaire: { type: String },
    source: { type: String },
    documentUrl: { type: String },
    statut: {
      type: String,
      enum: ["brouillon", "valide", "publie"],
      default: "brouillon",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    validatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "lois_mesures_actions",
  }
);

const DataQualitativeSchema = new Schema<IDataQualitative>(
  {
    indicateur: {
      type: Schema.Types.ObjectId,
      ref: "Indicateur",
      required: true,
    },
    cible: { type: Schema.Types.ObjectId, ref: "Cible", required: true },
    province: { type: Schema.Types.ObjectId, ref: "Province" },
    annee: { type: Schema.Types.ObjectId, ref: "Annee", required: true },
    loiMesureActions: [{ type: Schema.Types.ObjectId, ref: "LoiMesureAction" }],
    commentaire: { type: String },
    statut: {
      type: String,
      enum: ["brouillon", "valide", "publie"],
      default: "brouillon",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    validatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "data_qualitative",
  }
);

const StructureSchema = new Schema<IStructure>(
  {
    nom: { type: String, required: true, trim: true },
    sigle: { type: String, trim: true },
    domaine: { type: String, required: true },
    description: { type: String },
    adresse: { type: String },
    email: { type: String, lowercase: true },
    telephone: { type: String },
    siteWeb: { type: String },
    logo: { type: String },
    pointFocal: { type: String },
    cibles: [{ type: String }],
    province: { type: Schema.Types.ObjectId, ref: "Province" },
    typeStructure: {
      type: String,
      enum: [
        "gouvernementale",
        "ong",
        "association",
        "internationale",
        "autre",
      ],
      required: true,
    },
    statut: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    collection: "structures",
  }
);

// Index pour optimiser les requêtes
DataNumeriqueSchema.index({ indicateur: 1, annee: 1 });
DataNumeriqueSchema.index({ province: 1, annee: 1 });
DataNumeriqueSchema.index({ statut: 1 });
DataNumeriqueSchema.index({ createdBy: 1 });

DataQualitativeSchema.index({ indicateur: 1, annee: 1 });
DataQualitativeSchema.index({ province: 1, annee: 1 });
DataQualitativeSchema.index({ statut: 1 });

LoiMesureActionSchema.index({ type: 1, annee: 1 });
LoiMesureActionSchema.index({ statut: 1 });

StructureSchema.index({ typeStructure: 1 });
StructureSchema.index({ province: 1 });
StructureSchema.index({ statut: 1 });

// Export des modèles
export const DataNumerique =
  mongoose.models.DataNumerique ||
  mongoose.model<IDataNumerique>("DataNumerique", DataNumeriqueSchema);
export const TypeLMA =
  mongoose.models.TypeLMA || mongoose.model<ITypeLMA>("TypeLMA", TypeLMASchema);
export const LoiMesureAction =
  mongoose.models.LoiMesureAction ||
  mongoose.model<ILoiMesureAction>("LoiMesureAction", LoiMesureActionSchema);
export const DataQualitative =
  mongoose.models.DataQualitative ||
  mongoose.model<IDataQualitative>("DataQualitative", DataQualitativeSchema);
export const Structure =
  mongoose.models.Structure ||
  mongoose.model<IStructure>("Structure", StructureSchema);
