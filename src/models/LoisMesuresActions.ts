import mongoose, { Schema, Document } from "mongoose";
import type { ITypeLMA } from "./TypeLMA";

export interface ILoisMesuresActions extends Document {
  nom: string;
  type: ITypeLMA["_id"];
  description?: string;
  annee?: number;
  reference?: string;
  lien?: string;
  statut?: string; // "en vigueur", "abrogé", "en projet"
  createdAt: Date;
  updatedAt: Date;
}

const LoisMesuresActionsSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: "TypeLMA",
      required: [true, "Le type est requis"],
    },
    description: {
      type: String,
      trim: true,
    },
    annee: {
      type: Number,
      min: 1960,
      max: 2100,
    },
    reference: {
      type: String,
      trim: true,
    },
    lien: {
      type: String,
      trim: true,
    },
    statut: {
      type: String,
      enum: ["en vigueur", "abrogé", "en projet", "autre"],
      default: "en vigueur",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
LoisMesuresActionsSchema.index({ type: 1, annee: -1 });
LoisMesuresActionsSchema.index({ nom: 1 });
LoisMesuresActionsSchema.index({ statut: 1 });

export default mongoose.models.LoisMesuresActions ||
  mongoose.model<ILoisMesuresActions>(
    "LoisMesuresActions",
    LoisMesuresActionsSchema
  );
