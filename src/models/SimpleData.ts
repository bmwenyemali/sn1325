import mongoose, { Schema, Document } from "mongoose";

// Interface pour les données simplifiées
export interface ISimpleData extends Document {
  axeId: mongoose.Types.ObjectId;
  indicateurId?: mongoose.Types.ObjectId;
  provinceId: mongoose.Types.ObjectId;
  annee: number;
  trimestre?: string;
  valeurNumerique?: number;
  valeurTexte?: string;
  uniteMesure: string;
  description: string;
  commentaire?: string;
  statut: "brouillon" | "valide" | "planifie";
  source?: string;
  createdBy: mongoose.Types.ObjectId;
  dateCreation: Date;
  dateModification: Date;
}

// Schéma MongoDB
const SimpleDataSchema = new Schema<ISimpleData>({
  axeId: { type: Schema.Types.ObjectId, ref: "Axe", required: true },
  indicateurId: { type: Schema.Types.ObjectId, ref: "Indicateur" },
  provinceId: { type: Schema.Types.ObjectId, ref: "Province", required: true },
  annee: { type: Number, required: true },
  trimestre: { type: String, enum: ["T1", "T2", "T3", "T4"] },
  valeurNumerique: { type: Number },
  valeurTexte: { type: String },
  uniteMesure: { type: String, required: true },
  description: { type: String, required: true },
  commentaire: { type: String },
  statut: {
    type: String,
    enum: ["brouillon", "valide", "planifie"],
    default: "brouillon",
  },
  source: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
});

// Index pour les performances
SimpleDataSchema.index({ axeId: 1, provinceId: 1, annee: 1 });
SimpleDataSchema.index({ statut: 1 });

// Export du modèle
export const SimpleData =
  mongoose.models.SimpleData ||
  mongoose.model<ISimpleData>("SimpleData", SimpleDataSchema);
