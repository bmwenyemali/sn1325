// Types pour les données SN1325

export interface DataNumerique {
  _id: string;
  indicateur: string;
  cible: string;
  province?: string;
  sexe?: string;
  annee: string;
  valeur: number;
  commentaire?: string;
  source?: string;
  statut: "brouillon" | "valide" | "publie";
  createdBy: string;
  validatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypeLMA {
  _id: string;
  nom: string;
  description: string;
  code: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoiMesureAction {
  _id: string;
  nom: string;
  description: string;
  type: string | TypeLMA;
  annee: string;
  commentaire?: string;
  source?: string;
  documentUrl?: string;
  statut: "brouillon" | "valide" | "publie";
  createdBy: string;
  validatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataQualitative {
  _id: string;
  indicateur: string;
  cible: string;
  province?: string;
  annee: string;
  loiMesureActions: string[] | LoiMesureAction[];
  commentaire?: string;
  statut: "brouillon" | "valide" | "publie";
  createdBy: string;
  validatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Structure {
  _id: string;
  nom: string;
  sigle?: string;
  domaine: string;
  description?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  siteWeb?: string;
  logo?: string;
  pointFocal?: string;
  cibles?: string[];
  province?: string;
  typeStructure:
    | "gouvernementale"
    | "ong"
    | "association"
    | "internationale"
    | "autre";
  statut: "active" | "inactive";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les formulaires de saisie
export interface DataNumeriqueForm {
  indicateur: string;
  cible: string;
  province?: string;
  sexe?: string;
  annee: string;
  valeur: number;
  commentaire?: string;
  source?: string;
}

export interface LoiMesureActionForm {
  nom: string;
  description: string;
  type: string;
  annee: string;
  commentaire?: string;
  source?: string;
  documentUrl?: string;
}

export interface DataQualitativeForm {
  indicateur: string;
  cible: string;
  province?: string;
  annee: string;
  loiMesureActions: string[];
  commentaire?: string;
}

export interface StructureForm {
  nom: string;
  sigle?: string;
  domaine: string;
  description?: string;
  adresse?: string;
  email?: string;
  telephone?: string;
  siteWeb?: string;
  pointFocal?: string;
  cibles?: string[];
  province?: string;
  typeStructure:
    | "gouvernementale"
    | "ong"
    | "association"
    | "internationale"
    | "autre";
}

// Types pour les statistiques et rapports
export interface StatistiqueIndicateur {
  indicateur: string;
  nom: string;
  axe: string;
  nomAxe: string;
  valeurTotale: number;
  nombreDonnees: number;
  derniereValeur: number;
  derniereAnnee: number;
  evolution: {
    annee: number;
    valeur: number;
  }[];
}

export interface StatistiqueAxe {
  axe: string;
  nom: string;
  nombreIndicateurs: number;
  nombreDonnees: number;
  indicateurs: StatistiqueIndicateur[];
}

export interface StatistiqueProvince {
  province: string;
  nom: string;
  nombreDonnees: number;
  indicateursAvecDonnees: number;
  dernieresSaisies: {
    indicateur: string;
    valeur: number;
    annee: number;
    date: Date;
  }[];
}

// Types pour l'export et les rapports
export interface RapportOptions {
  axes?: string[];
  provinces?: string[];
  anneeDebut?: number;
  anneeFin?: number;
  format: "pdf" | "excel" | "json";
  includeGraphiques: boolean;
  includeCommentaires: boolean;
}

export interface DonneeExport {
  axe: string;
  indicateur: string;
  cible: string;
  province?: string;
  sexe?: string;
  annee: number;
  valeur: number | string;
  commentaire?: string;
  source?: string;
  statut: string;
  dateCreation: Date;
}

// Types pour la validation et workflow
export interface ValidationRequest {
  ressourceType: "data_numerique" | "data_qualitative" | "loi_mesure_action";
  ressourceId: string;
  commentaire?: string;
}

export interface ValidationResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Types pour les filtres et recherche
export interface FiltresDonnees {
  axes?: string[];
  indicateurs?: string[];
  provinces?: string[];
  annees?: number[];
  sexes?: string[];
  statuts?: ("brouillon" | "valide" | "publie")[];
  dateDebut?: Date;
  dateFin?: Date;
  recherche?: string;
}

export interface ResultatRecherche<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
