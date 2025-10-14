import type { Request } from 'express';

export interface ResultatValidation {
  valide: boolean;
  erreurs: string[];
}

export class ValidationImage {
  // Valider les dimensions minimales
  static validerDimensions(
    largeur: number,
    hauteur: number,
    largeurMin: number = 400,
    hauteurMin: number = 400
  ): ResultatValidation {
    const erreurs: string[] = [];

    if (largeur < largeurMin) {
      erreurs.push(`La largeur doit être au moins ${largeurMin}px (actuelle: ${largeur}px)`);
    }

    if (hauteur < hauteurMin) {
      erreurs.push(`La hauteur doit être au moins ${hauteurMin}px (actuelle: ${hauteur}px)`);
    }

    return {
      valide: erreurs.length === 0,
      erreurs,
    };
  }

  // Valider le ratio (pour éviter les images trop étirées)
  static validerRatio(largeur: number, hauteur: number): ResultatValidation {
    const ratio = largeur / hauteur;
    const erreurs: string[] = [];

    // Ratio acceptable entre 0.5 (vertical) et 2 (horizontal)
    if (ratio < 0.5 || ratio > 2) {
      erreurs.push(
        `Le ratio de l'image doit être entre 1:2 et 2:1 (actuel: ${ratio.toFixed(2)})`
      );
    }

    return {
      valide: erreurs.length === 0,
      erreurs,
    };
  }

  // Valider le nombre d'images
  static validerNombre(
    fichiers: Express.Multer.File[] | undefined,
    min: number = 1,
    max: number = 5
  ): ResultatValidation {
    const erreurs: string[] = [];

    if (!fichiers || fichiers.length === 0) {
      erreurs.push(`Au moins ${min} image est requise`);
    } else if (fichiers.length < min) {
      erreurs.push(`Minimum ${min} image(s) requise(s) (actuellement: ${fichiers.length})`);
    } else if (fichiers.length > max) {
      erreurs.push(`Maximum ${max} images autorisées (actuellement: ${fichiers.length})`);
    }

    return {
      valide: erreurs.length === 0,
      erreurs,
    };
  }

  // Validation complète
  static async validerTout(
    fichiers: Express.Multer.File[],
    options: {
      largeurMin?: number;
      hauteurMin?: number;
      validerRatio?: boolean;
      min?: number;
      max?: number;
    } = {}
  ): Promise<ResultatValidation> {
    const {
      largeurMin = 400,
      hauteurMin = 400,
      validerRatio = true,
      min = 1,
      max = 5,
    } = options;

    const erreurs: string[] = [];

    // Valider le nombre
    const validationNombre = this.validerNombre(fichiers, min, max);
    erreurs.push(...validationNombre.erreurs);

    if (!validationNombre.valide) {
      return { valide: false, erreurs };
    }

    // Valider chaque image (dimensions seront vérifiées après traitement)
    // Pour l'instant, on fait confiance à Multer pour le type MIME

    return {
      valide: erreurs.length === 0,
      erreurs,
    };
  }
}