// Types pour le référentiel SN1325

export interface Axe {
  _id: string;
  nom: string;
  description: string;
  code: string;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrandeCategorie {
  _id: string;
  nom: string;
  description?: string;
  axe: string | Axe;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Categorie {
  _id: string;
  nom: string;
  description?: string;
  grandeCategorie: string | GrandeCategorie;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cible {
  _id: string;
  nom: string;
  description?: string;
  categorie: string | Categorie;
  ordre: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Indicateur {
  _id: string;
  nom: string;
  description: string;
  code: string;
  cible: string | Cible;
  axe: string | Axe;

  // Configuration de désagrégation
  desagregeable: boolean;
  desagregeableParProvince: boolean;
  desagregeableParSexe: boolean;

  // Type de données
  typeIndicateur: "numerique" | "liste" | "document";
  unite?: string;

  // Métadonnées
  frequenceCollecte:
    | "mensuelle"
    | "trimestrielle"
    | "semestrielle"
    | "annuelle";
  source: string;
  methodCalcul?: string;
  interpretation?: string;

  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Province {
  _id: string;
  nom: string;
  code: string;
  region: string;
  population?: number;
  superficie?: number;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Annee {
  _id: string;
  valeur: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sexe {
  _id: string;
  nom: string;
  code: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour la hiérarchie complète
export interface IndicateurComplet extends Indicateur {
  cible: Cible & {
    categorie: Categorie & {
      grandeCategorie: GrandeCategorie & {
        axe: Axe;
      };
    };
  };
  axe: Axe;
}

// Types pour les formulaires
export interface IndicateurForm {
  nom: string;
  description: string;
  code: string;
  cible: string;
  axe: string;
  desagregeable: boolean;
  desagregeableParProvince: boolean;
  desagregeableParSexe: boolean;
  typeIndicateur: "numerique" | "liste" | "document";
  unite?: string;
  frequenceCollecte:
    | "mensuelle"
    | "trimestrielle"
    | "semestrielle"
    | "annuelle";
  source: string;
  methodCalcul?: string;
  interpretation?: string;
}

export interface AxeForm {
  nom: string;
  description: string;
  code: string;
  ordre: number;
}

// Options pour les selects
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Hiérarchie pour la navigation
export interface HierarchieReferentiel {
  axes: (Axe & {
    grandesCategories: (GrandeCategorie & {
      categories: (Categorie & {
        cibles: Cible[];
      })[];
    })[];
  })[];
}
