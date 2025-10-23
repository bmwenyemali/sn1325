import mongoose, { Schema, Document } from "mongoose";
import type { IIndicateur } from "./Indicateur";
import type { ILoisMesuresActions } from "./LoisMesuresActions";

export interface IDataQualitativeItem {
  loisMesuresActions: ILoisMesuresActions["_id"];
  annee: number;
  ordre?: number;
  notes?: string;
}

export interface IDataQualitative extends Document {
  indicateur: IIndicateur["_id"];
  items: IDataQualitativeItem[];
  description?: string;
  source?: string;
  validePar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DataQualitativeItemSchema: Schema = new Schema(
  {
    loisMesuresActions: {
      type: Schema.Types.ObjectId,
      ref: "LoisMesuresActions",
      required: [true, "La loi/mesure/action est requise"],
    },
    annee: {
      type: Number,
      required: [true, "L'année est requise"],
      min: 2000,
      max: 2100,
    },
    ordre: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: true } // Enable _id for subdocuments so we can update/delete individual items
);

const DataQualitativeSchema: Schema = new Schema(
  {
    indicateur: {
      type: Schema.Types.ObjectId,
      ref: "Indicateur",
      required: [true, "L'indicateur est requis"],
      unique: true, // One DataQualitative per indicateur
    },
    items: {
      type: [DataQualitativeItemSchema],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    validePar: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
DataQualitativeSchema.index({ indicateur: 1 });
DataQualitativeSchema.index({ "items.annee": -1 });

export default mongoose.models.DataQualitative ||
  mongoose.model<IDataQualitative>("DataQualitative", DataQualitativeSchema);
