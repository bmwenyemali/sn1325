import mongoose, { Schema, Document } from "mongoose";

export interface IProvince extends Document {
  nom: string;
  code?: string;
  region?: string;
  ordre?: number;
  actif: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProvinceSchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la province est requis"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    region: {
      type: String,
      trim: true,
    },
    ordre: {
      type: Number,
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
ProvinceSchema.index({ nom: 1 });
ProvinceSchema.index({ ordre: 1 });

export default mongoose.models.Province ||
  mongoose.model<IProvince>("Province", ProvinceSchema);
