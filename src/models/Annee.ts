import mongoose, { Schema, Document } from "mongoose";

export interface IAnnee extends Document {
  annee: number;
  libelle?: string; // e.g., "2024 - Année électorale"
  actif: boolean;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AnneeSchema: Schema = new Schema(
  {
    annee: {
      type: Number,
      required: [true, "L'année est requise"],
      unique: true,
      min: 2000,
      max: 2100,
    },
    libelle: {
      type: String,
      trim: true,
    },
    actif: {
      type: Boolean,
      default: true,
    },
    ordre: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
AnneeSchema.index({ annee: -1 });
AnneeSchema.index({ actif: 1, annee: -1 });

export default mongoose.models.Annee ||
  mongoose.model<IAnnee>("Annee", AnneeSchema);
