import mongoose, { Schema, Document } from "mongoose";
import type { ICategorie } from "./Categorie";
import type { IGrandeCategorie } from "./GrandeCategorie";

export interface ICible extends Document {
  nom: string;
  categorie: ICategorie["_id"];
  grandeCategorie: IGrandeCategorie["_id"];
  description?: string;
  ordre?: number;
  createdAt: Date;
  updatedAt: Date;
}

const CibleSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la cible est requis"],
      trim: true,
    },
    categorie: {
      type: Schema.Types.ObjectId,
      ref: "Categorie",
      required: [true, "La catégorie est requise"],
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

// Indexes
CibleSchema.index({ nom: 1 });
CibleSchema.index({ categorie: 1 });
CibleSchema.index({ grandeCategorie: 1 });
CibleSchema.index({ ordre: 1 });

export default mongoose.models.Cible ||
  mongoose.model<ICible>("Cible", CibleSchema);
