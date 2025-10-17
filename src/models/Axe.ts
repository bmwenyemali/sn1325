import mongoose, { Schema, Document } from "mongoose";

export interface IAxe extends Document {
  nom: string;
  description?: string;
  ordre: number;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AxeSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de l'axe est requis"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ordre: {
      type: Number,
      required: true,
      default: 0,
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
AxeSchema.index({ ordre: 1 });
AxeSchema.index({ nom: 1 });

export default mongoose.models.Axe || mongoose.model<IAxe>("Axe", AxeSchema);
