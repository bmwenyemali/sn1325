import mongoose, { Schema, Document } from "mongoose";
import type { IGrandeCategorie } from "./GrandeCategorie";

export interface ICategorie extends Document {
  nom: string;
  grandeCategorie: IGrandeCategorie["_id"];
  description?: string;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorieSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la catégorie est requis"],
      trim: true,
    },
    grandeCategorie: {
      type: Schema.Types.ObjectId,
      ref: "GrandeCategorie",
      required: [true, "La grande catégorie est requise"],
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

// Unique constraint: nom + grandeCategorie
CategorieSchema.index({ nom: 1, grandeCategorie: 1 }, { unique: true });
CategorieSchema.index({ grandeCategorie: 1 });
CategorieSchema.index({ ordre: 1 });

export default mongoose.models.Categorie ||
  mongoose.model<ICategorie>("Categorie", CategorieSchema);
