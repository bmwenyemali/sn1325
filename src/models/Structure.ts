import mongoose, { Schema, Document } from "mongoose";

export interface IStructure extends Document {
  nom: string;
  type?: string; // "Ministère", "ONG", "Agence", etc.
  description?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  axes?: mongoose.Types.ObjectId[]; // Reference to Axe model
  cible?: string[]; // Array of target groups (enfants, femmes, etc.)
  aPropos?: string; // About the structure (rich text)
  pointFocal?: string; // Focal point contact person
  adresseGeographic?: {
    latitude?: number;
    longitude?: number;
    description?: string;
  }; // Geographic coordinates for Google Maps
  province?: mongoose.Types.ObjectId; // Reference to Province model
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
    axes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Axe",
      },
    ],
    cible: [
      {
        type: String,
        trim: true,
      },
    ],
    aPropos: {
      type: String,
      trim: true,
    },
    pointFocal: {
      type: String,
      trim: true,
    },
    adresseGeographic: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
      description: {
        type: String,
        trim: true,
      },
    },
    province: {
      type: Schema.Types.ObjectId,
      ref: "Province",
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
StructureSchema.index({ axes: 1 });
StructureSchema.index({ province: 1 });

export default mongoose.models.Structure ||
  mongoose.model<IStructure>("Structure", StructureSchema);
