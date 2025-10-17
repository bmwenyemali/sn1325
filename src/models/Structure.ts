import mongoose, { Schema, Document } from "mongoose";

export interface IStructure extends Document {
  nom: string;
  type?: string; // "Ministère", "ONG", "Agence", etc.
  description?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StructureSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la structure est requis"],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    adresse: {
      type: String,
      trim: true,
    },
    telephone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    siteWeb: {
      type: String,
      trim: true,
    },
    actif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
StructureSchema.index({ nom: 1 });
StructureSchema.index({ type: 1 });

export default mongoose.models.Structure ||
  mongoose.model<IStructure>("Structure", StructureSchema);
