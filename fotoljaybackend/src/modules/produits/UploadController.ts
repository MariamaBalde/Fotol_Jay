import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/AuthMiddleware.js';
import { ProcesseurImage } from '../../utils/imageProcessor.js';
import { ValidationImage } from '../../utils/imageValidation.js';
import { supprimerFichiers } from '../../utils/imageUpload.js';
import path from 'path';

export class UploadController {
  async uploadImagesProduit(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      const fichiers = req.files as Express.Multer.File[];

      // Validation du nombre d'images
      const validationNombre = ValidationImage.validerNombre(fichiers, 1, 5);
      if (!validationNombre.valide) {
        // Supprimer les fichiers uploadés en cas d'erreur
        supprimerFichiers(fichiers.map((f) => f.path));
        return res.status(400).json({
          erreur: 'Validation échouée',
          details: validationNombre.erreurs,
        });
      }

      // Traiter les images (optimisation + miniatures)
      const imagesTraitees = await ProcesseurImage.traiterLot(fichiers, {
        largeurMax: 1200,
        hauteurMax: 1200,
        qualite: 85,
        format: 'jpeg',
      });

      // Construire les URLs relatives
      const images = imagesTraitees.map((img, index) => ({
        url: `/uploads/produits/${path.basename(img.optimise)}`,
        urlMiniature: `/uploads/produits/${path.basename(img.miniature)}`,
        ordre: index + 1,
        metadata: {
          largeur: img.metadata.largeur,
          hauteur: img.metadata.hauteur,
          taille: img.metadata.taille,
        },
      }));

      return res.status(200).json({
        message: `${images.length} image(s) uploadée(s) avec succès`,
        images,
      });
    } catch (erreur: any) {
      // En cas d'erreur, nettoyer les fichiers
      if (req.files) {
        const fichiers = req.files as Express.Multer.File[];
        supprimerFichiers(fichiers.map((f) => f.path));
      }

      return res.status(500).json({
        erreur: 'Erreur lors du traitement des images',
        details: erreur.message,
      });
    }
  }

  async uploadPhotoProfil(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const fichier = req.file;

      if (!fichier) {
        return res.status(400).json({
          erreur: 'Aucune image fournie',
        });
      }

      // Traiter l'image
      const cheminOptimise = await ProcesseurImage.optimiser(fichier.path, undefined, {
        largeurMax: 500,
        hauteurMax: 500,
        qualite: 90,
        format: 'jpeg',
      });

      // URL relative
      const url = `/uploads/profils/${path.basename(cheminOptimise)}`;

      return res.status(200).json({
        message: 'Photo de profil uploadée avec succès',
        url,
      });
    } catch (erreur: any) {
      // Nettoyer en cas d'erreur
      if (req.file) {
        supprimerFichiers([req.file.path]);
      }

      return res.status(500).json({
        erreur: 'Erreur lors du traitement de l\'image',
        details: erreur.message,
      });
    }
  }
}

export const controleurUpload = new UploadController();