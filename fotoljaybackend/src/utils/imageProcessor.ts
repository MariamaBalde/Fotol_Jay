import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface OptionsTraitement {
  largeurMax?: number;
  hauteurMax?: number;
  qualite?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export class ProcesseurImage {
  // Optimiser et redimensionner une image
  static async optimiser(
    cheminSource: string,
    cheminDestination?: string,
    options: OptionsTraitement = {}
  ): Promise<string> {
    const {
      largeurMax = 1200,
      hauteurMax = 1200,
      qualite = 85,
      format = 'jpeg',
    } = options;

    try {
      // Si pas de destination spécifiée, écraser la source
      const destination = cheminDestination || cheminSource;

      // Traiter l'image
      await sharp(cheminSource)
        .resize(largeurMax, hauteurMax, {
          fit: 'inside', // Garde les proportions
          withoutEnlargement: true, // Ne pas agrandir si plus petite
        })
        .toFormat(format, { quality: qualite })
        .toFile(destination + '.tmp');

      // Remplacer l'original
      if (fs.existsSync(destination)) {
        fs.unlinkSync(destination);
      }
      fs.renameSync(destination + '.tmp', destination);

      return destination;
    } catch (erreur) {
      console.error('Erreur lors du traitement de l\'image:', erreur);
      throw new Error('Impossible de traiter l\'image');
    }
  }

  // Créer une miniature
  static async creerMiniature(
    cheminSource: string,
    largeur: number = 300,
    hauteur: number = 300
  ): Promise<string> {
    try {
      const dir = path.dirname(cheminSource);
      const ext = path.extname(cheminSource);
      const nom = path.basename(cheminSource, ext);
      const cheminMiniature = path.join(dir, `${nom}_thumb${ext}`);

      await sharp(cheminSource)
        .resize(largeur, hauteur, {
          fit: 'cover', // Recadrer pour remplir
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toFile(cheminMiniature);

      return cheminMiniature;
    } catch (erreur) {
      console.error('Erreur lors de la création de la miniature:', erreur);
      throw new Error('Impossible de créer la miniature');
    }
  }

  // Obtenir les métadonnées d'une image
  static async obtenirMetadonnees(cheminFichier: string) {
    try {
      const metadata = await sharp(cheminFichier).metadata();
      return {
        largeur: metadata.width,
        hauteur: metadata.height,
        format: metadata.format,
        taille: metadata.size,
        espace: metadata.space,
      };
    } catch (erreur) {
      console.error('Erreur lors de la lecture des métadonnées:', erreur);
      throw new Error('Impossible de lire les métadonnées');
    }
  }

  // Valider qu'un fichier est bien une image
  static async validerImage(cheminFichier: string): Promise<boolean> {
    try {
      const metadata = await sharp(cheminFichier).metadata();
      return !!(metadata.width && metadata.height);
    } catch (erreur) {
      return false;
    }
  }

  // Traiter un lot d'images
  static async traiterLot(
    fichiers: Express.Multer.File[],
    options: OptionsTraitement = {}
  ): Promise<Array<{
    original: string;
    optimise: string;
    miniature: string;
    metadata: any;
  }>> {
    const resultats = [];

    for (const fichier of fichiers) {
      try {
        // Valider l'image
        const estValide = await this.validerImage(fichier.path);
        if (!estValide) {
          fs.unlinkSync(fichier.path);
          throw new Error(`Fichier invalide: ${fichier.originalname}`);
        }

        // Optimiser
        const cheminOptimise = await this.optimiser(fichier.path, undefined, options);

        // Créer miniature
        const cheminMiniature = await this.creerMiniature(cheminOptimise);

        // Obtenir métadonnées
        const metadata = await this.obtenirMetadonnees(cheminOptimise);

        resultats.push({
          original: fichier.path,
          optimise: cheminOptimise,
          miniature: cheminMiniature,
          metadata,
        });
      } catch (erreur: any) {
        console.error(`Erreur traitement ${fichier.originalname}:`, erreur);
        // Nettoyer en cas d'erreur
        if (fs.existsSync(fichier.path)) {
          fs.unlinkSync(fichier.path);
        }
        throw erreur;
      }
    }

    return resultats;
  }
}