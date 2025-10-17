// Types pour l'authentification et les utilisateurs

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  fonction?: string;
  organisation?: string;
  province?: string;
  role: string | Role;
  privileges: string[] | Privilege[];
  statut: "actif" | "inactif" | "suspendu";
  dernierLogin?: Date;
  emailVerified?: Date;
  image?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  _id: string;
  nom: string;
  description: string;
  code: string;
  niveau: number;
  privileges: string[] | Privilege[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Privilege {
  _id: string;
  nom: string;
  description: string;
  code: string;
  module: string;
  action: "create" | "read" | "update" | "delete" | "validate" | "publish";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  _id: string;
  userId: string | User;
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

// Types pour l'authentification NextAuth
export interface SessionUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  privileges: string[];
  province?: string;
  image?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: SessionUser;
  token?: string;
}

// Types pour les formulaires d'utilisateur
export interface UserForm {
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  telephone?: string;
  fonction?: string;
  organisation?: string;
  province?: string;
  role: string;
  privileges?: string[];
}

export interface UserUpdateForm {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  fonction?: string;
  organisation?: string;
  province?: string;
  role: string;
  privileges?: string[];
  statut: "actif" | "inactif" | "suspendu";
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RoleForm {
  nom: string;
  description: string;
  code: string;
  niveau: number;
  privileges: string[];
}

// Types pour la gestion des permissions
export interface PermissionCheck {
  module: string;
  action: "create" | "read" | "update" | "delete" | "validate" | "publish";
  ressource?: string;
}

export interface UserPermissions {
  modules: {
    [key: string]: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
      validate: boolean;
      publish: boolean;
    };
  };
}

// Types pour les statistiques utilisateur
export interface UserStats {
  totalUtilisateurs: number;
  utilisateursActifs: number;
  utilisateursInactifs: number;
  utilisateursSuspendus: number;
  connexionsAujourdhui: number;
  connexionsSemaine: number;
  repartitionParRole: {
    role: string;
    nombre: number;
  }[];
  repartitionParProvince: {
    province: string;
    nombre: number;
  }[];
}

// Types pour les notifications
export interface Notification {
  _id: string;
  userId: string;
  type: "info" | "warning" | "error" | "success";
  titre: string;
  message: string;
  lue: boolean;
  url?: string;
  createdAt: Date;
}

export interface NotificationForm {
  destinataires: string[]; // IDs des utilisateurs
  type: "info" | "warning" | "error" | "success";
  titre: string;
  message: string;
  url?: string;
}

// Types pour l'activité utilisateur
export interface ActiviteUtilisateur {
  _id: string;
  userId: string;
  action: string;
  description: string;
  ressource?: string;
  ressourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Types pour la sécurité
export interface SecuritySettings {
  motDePasseComplexe: boolean;
  dureeSessionMinutes: number;
  tentativesMaxConnexion: number;
  dureeVerrouillageBlocage: number;
  authentificationDeuxFacteurs: boolean;
  expirationMotDePasse: number; // jours
}

// Types pour l'audit
export interface AuditFilters {
  userId?: string;
  action?: string;
  ressource?: string;
  statut?: "succes" | "echec";
  dateDebut?: Date;
  dateFin?: Date;
}
