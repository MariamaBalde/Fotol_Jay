import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export class ProduitsCloudinaryService {
  static async uploadToCloudinary(produitId: string): Promise<void> {
    try {
      // Récupérer le produit avec ses images
      const produit = await prisma.produit.findUnique({
        where: { id: produitId },
        include: { images: true }
      });

      if (!produit) throw new Error('Produit non trouvé');

      // Pour chaque image
      for (const image of produit.images) {
        try {
          // Construire le chemin local complet
          const localPath = path.join(process.cwd(), image.url);
          
          // Uploader sur Cloudinary
          const result = await cloudinary.uploader.upload(localPath, {
            folder: `produits/${produitId}`,
            use_filename: true,
            unique_filename: true
          });

          // Mettre à jour l'URL dans la base de données
          await prisma.imageProduit.update({
            where: { id: image.id },
            data: {
              url: result.secure_url,
              urlMiniature: result.secure_url // Vous pouvez utiliser Cloudinary transformations pour les miniatures
            }
          });

          // Optionnel : supprimer le fichier local
          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
          }
        } catch (error) {
          console.error(`Erreur lors de l'upload de l'image ${image.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload des images sur Cloudinary:', error);
      throw error;
    }
  }
}