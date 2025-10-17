import mongoose, { Schema, Document } from "mongoose";

export interface IGrandeCategorie extends Document {
  nom: string;
  description?: string;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GrandeCategorieSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la grande catégorie est requis"],
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
GrandeCategorieSchema.index({ nom: 1 });
GrandeCategorieSchema.index({ ordre: 1 });

export default mongoose.models.GrandeCategorie ||
  mongoose.model<IGrandeCategorie>("GrandeCategorie", GrandeCategorieSchema);
