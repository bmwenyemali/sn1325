import mongoose, { Schema, Document } from "mongoose";
import type { IAxe } from "./Axe";

export interface IIndicateur extends Document {
  nom: string;
  axe: IAxe["_id"];
  type: "quantitatif" | "qualitatif"; // quantitatif = numeric, qualitatif = text
  description?: string;

  // Flags de désagrégation (pour type quantitatif)
  desagregableParSexe: boolean; // sexeYN
  desagregableParProvince: boolean; // ProvinceYN
  desagregableParAnnee: boolean; // Always true for time series

  // Cible (optionnel selon indicateur)
  avecCible: boolean; // cibleYN

  // Unité de mesure (pour type quantitatif)
  unite?: string; // "nombre", "pourcentage", etc.

  // Ordre d'affichage
  ordre?: number;

  createdAt: Date;
  updatedAt: Date;
}

const IndicateurSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de l'indicateur est requis"],
      trim: true,
    },
    axe: {
      type: Schema.Types.ObjectId,
      ref: "Axe",
      required: [true, "L'axe est requis"],
    },
    type: {
      type: String,
      enum: ["quantitatif", "qualitatif"],
      required: [true, "Le type d'indicateur est requis"],
      default: "quantitatif",
    },
    description: {
      type: String,
      trim: true,
    },
    desagregableParSexe: {
      type: Boolean,
      default: false,
    },
    desagregableParProvince: {
      type: Boolean,
      default: false,
    },
    desagregableParAnnee: {
      type: Boolean,
      default: true,
    },
    avecCible: {
      type: Boolean,
      default: false,
    },
    unite: {
      type: String,
      trim: true,
    },
    ordre: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
IndicateurSchema.index({ axe: 1, ordre: 1 });
IndicateurSchema.index({ nom: 1 });
IndicateurSchema.index({ type: 1 });

export default mongoose.models.Indicateur ||
  mongoose.model<IIndicateur>("Indicateur", IndicateurSchema);
