import mongoose, { Schema, Document } from "mongoose";

export interface IStructure extends Document {
  nom: string;
  sigle?: string; // Acronym/Abbreviation
  type?: string; // "Org Internationale", "Org Publique", "Privée", "Société Civile", "Autres"
  description?: string;
  adresse?: string; // Text address manually entered
  telephone?: string; // Phone Organisation
  telephonePrive?: string; // Phone Privé
  email?: string; // Email Organisation
  emailPrive?: string; // Email Privé
  siteWeb?: string;
  photo?: string; // Logo URL
  axes?: mongoose.Types.ObjectId[]; // Reference to Axe model - liste des axes
  cible?: mongoose.Types.ObjectId[]; // Reference to Cible model - liste des cibles
  aPropos?: string; // About the structure (rich text)
  pointFocal?: string; // Focal point contact person
  adresseGeographic?: {
    latitude?: number;
    longitude?: number;
    description?: string;
  }; // Geographic coordinates for Google Maps (will setup later)
  provinces?: mongoose.Types.ObjectId[]; // Multiple provinces or "National" if all
  isNational?: boolean; // If structure covers all provinces
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
    sigle: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Org Internationale",
        "Org Publique",
        "Privée",
        "Société Civile",
        "Autres",
      ],
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
    telephonePrive: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    emailPrive: {
      type: String,
      trim: true,
      lowercase: true,
    },
    siteWeb: {
      type: String,
      trim: true,
    },
    photo: {
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
        type: Schema.Types.ObjectId,
        ref: "Cible",
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
    provinces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Province",
      },
    ],
    isNational: {
      type: Boolean,
      default: false,
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
StructureSchema.index({ sigle: 1 });
StructureSchema.index({ type: 1 });
StructureSchema.index({ axes: 1 });
StructureSchema.index({ provinces: 1 });
StructureSchema.index({ isNational: 1 });

export default mongoose.models.Structure ||
  mongoose.model<IStructure>("Structure", StructureSchema);
