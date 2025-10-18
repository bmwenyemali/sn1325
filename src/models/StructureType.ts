import mongoose, { Schema, Document } from "mongoose";

export interface IStructureType extends Document {
  nom: string;
  description?: string;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
}

const StructureTypeSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du type de structure est requis"],
      unique: true,
      trim: true,
    },
    description: {
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

// Index for faster queries
StructureTypeSchema.index({ nom: 1 });
StructureTypeSchema.index({ ordre: 1 });

export default mongoose.models.StructureType ||
  mongoose.model<IStructureType>("StructureType", StructureTypeSchema);
