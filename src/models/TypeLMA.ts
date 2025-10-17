import mongoose, { Schema, Document } from "mongoose";

export interface ITypeLMA extends Document {
  nom: string; // "Lois", "Mesures", "Mécanismes", "Actions"
  code: string; // "LOI", "MES", "MEC", "ACT"
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TypeLMASchema: Schema = new Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom du type est requis"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Le code du type est requis"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
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
TypeLMASchema.index({ code: 1 });
TypeLMASchema.index({ nom: 1 });

export default mongoose.models.TypeLMA ||
  mongoose.model<ITypeLMA>("TypeLMA", TypeLMASchema);
