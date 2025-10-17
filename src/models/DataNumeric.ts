import mongoose, { Schema, Document } from "mongoose";
import type { IIndicateur } from "./Indicateur";
import type { ICible } from "./Cible";
import type { IProvince } from "./Province";

export interface IDataNumeric extends Document {
  indicateur: IIndicateur["_id"];
  annee: number;

  // Désagrégation optionnelle
  sexe?: "Homme" | "Femme" | "Total";
  province?: IProvince["_id"];
  cible?: ICible["_id"];

  // Valeurs
  valeur: number;
  pourcentage?: number;

  // Métadonnées
  source?: string;
  notes?: string;
  validePar?: string;

  createdAt: Date;
  updatedAt: Date;
}

const DataNumericSchema: Schema = new Schema(
  {
    indicateur: {
      type: Schema.Types.ObjectId,
      ref: "Indicateur",
      required: [true, "L'indicateur est requis"],
    },
    annee: {
      type: Number,
      required: [true, "L'année est requise"],
      min: 2000,
      max: 2100,
    },
    sexe: {
      type: String,
      enum: ["Homme", "Femme", "Total"],
      default: "Total",
    },
    province: {
      type: Schema.Types.ObjectId,
      ref: "Province",
    },
    cible: {
      type: Schema.Types.ObjectId,
      ref: "Cible",
    },
    valeur: {
      type: Number,
      required: [true, "La valeur est requise"],
    },
    pourcentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    source: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    validePar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Unique constraint: ensure one entry per indicateur/annee/sexe/province/cible combination
DataNumericSchema.index(
  { indicateur: 1, annee: 1, sexe: 1, province: 1, cible: 1 },
  { unique: true }
);
DataNumericSchema.index({ indicateur: 1, annee: -1 });
DataNumericSchema.index({ province: 1, annee: -1 });

export default mongoose.models.DataNumeric ||
  mongoose.model<IDataNumeric>("DataNumeric", DataNumericSchema);
