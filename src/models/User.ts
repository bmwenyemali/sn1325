import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Interface pour les Utilisateurs
export interface IUser extends Document {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  fonction?: string;
  organisation?: string;
  province?: mongoose.Types.ObjectId;
  role: mongoose.Types.ObjectId;
  privileges: mongoose.Types.ObjectId[];
  statut: "actif" | "inactif" | "suspendu";
  dernierLogin?: Date;
  emailVerified?: Date;
  image?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Rôles
export interface IRole extends Document {
  nom: string;
  description: string;
  code: string;
  niveau: number; // 1: Admin, 2: Éditeur, 3: Consultant
  privileges: mongoose.Types.ObjectId[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Privilèges
export interface IPrivilege extends Document {
  nom: string;
  description: string;
  code: string;
  module: string; // referentiel, donnees, utilisateurs, rapports, etc.
  action: string; // create, read, update, delete, validate, publish
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour les Sessions d'Audit
export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  ressource: string;
  ressourceId?: string;
  ancienneValeur?: Record<string, unknown>;
  nouvelleValeur?: Record<string, unknown>;
  adresseIP?: string;
  userAgent?: string;
  statut: "succes" | "echec";
  message?: string;
  createdAt: Date;
}

// Schémas Mongoose
const PrivilegeSchema = new Schema<IPrivilege>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    module: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ["create", "read", "update", "delete", "validate", "publish"],
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "privileges",
  }
);

const RoleSchema = new Schema<IRole>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    niveau: { type: Number, required: true, min: 1, max: 10 },
    privileges: [{ type: Schema.Types.ObjectId, ref: "Privilege" }],
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "roles",
  }
);

const UserSchema = new Schema<IUser>(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
    },
    password: { type: String, required: true, minlength: 6 },
    telephone: { type: String },
    fonction: { type: String },
    organisation: { type: String },
    province: { type: Schema.Types.ObjectId, ref: "Province" },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    privileges: [{ type: Schema.Types.ObjectId, ref: "Privilege" }],
    statut: {
      type: String,
      enum: ["actif", "inactif", "suspendu"],
      default: "actif",
    },
    dernierLogin: { type: Date },
    emailVerified: { type: Date },
    image: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    ressource: { type: String, required: true },
    ressourceId: { type: String },
    ancienneValeur: { type: Schema.Types.Mixed },
    nouvelleValeur: { type: Schema.Types.Mixed },
    adresseIP: { type: String },
    userAgent: { type: String },
    statut: {
      type: String,
      enum: ["succes", "echec"],
      required: true,
    },
    message: { type: String },
  },
  {
    timestamps: true,
    collection: "audit_logs",
  }
);

// Index pour optimiser les requêtes
// Note: `unique: true` is already declared on the `email` field above.
// Avoid declaring the same index twice to prevent mongoose duplicate-index warnings.
// UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ province: 1 });
UserSchema.index({ statut: 1 });

RoleSchema.index({ niveau: 1 });
RoleSchema.index({ active: 1 });

PrivilegeSchema.index({ module: 1, action: 1 });
PrivilegeSchema.index({ active: 1 });

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ ressource: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

// Middleware pour hasher le mot de passe avant sauvegarde
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hash password when using findOneAndUpdate/upsert if a plain password is provided
UserSchema.pre("findOneAndUpdate", async function (next) {
  type UpdateDoc = {
    password?: unknown;
    $set?: { password?: unknown; [k: string]: unknown };
    [k: string]: unknown;
  };

  const rawUpdate = this.getUpdate() as UpdateDoc | undefined;
  const update: UpdateDoc = rawUpdate ?? {};
  // Support both direct set and $set
  const directPwd = update.password;
  const setPwd = update.$set?.password;
  const pwd =
    typeof directPwd === "string"
      ? directPwd
      : typeof setPwd === "string"
      ? (setPwd as string)
      : undefined;

  if (typeof pwd === "string" && pwd.length > 0 && !pwd.startsWith("$2")) {
    const hashed = await bcrypt.hash(pwd, 12);
    if (update.$set) {
      update.$set.password = hashed;
    } else {
      update.password = hashed;
    }
  }
  next();
});

// Méthode pour obtenir les infos publiques de l'utilisateur
UserSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    nom: this.nom,
    prenom: this.prenom,
    email: this.email,
    fonction: this.fonction,
    organisation: this.organisation,
    province: this.province,
    role: this.role,
    statut: this.statut,
    dernierLogin: this.dernierLogin,
    image: this.image,
    createdAt: this.createdAt,
  };
};

// Export des modèles
export const Privilege =
  mongoose.models.Privilege ||
  mongoose.model<IPrivilege>("Privilege", PrivilegeSchema);
export const Role =
  mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
