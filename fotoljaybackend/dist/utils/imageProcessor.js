import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
export class ProcesseurImage {
    // Optimiser et redimensionner une image
    static async optimiser(cheminSource, cheminDestination, options = {}) {
        const { largeurMax = 1200, hauteurMax = 1200, qualite = 85, format = 'jpeg', } = options;
        try {
            const destination = cheminDestination || cheminSource;
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
        }
        catch (erreur) {
            console.error('Erreur lors du traitement de l\'image:', erreur);
            throw new Error('Impossible de traiter l\'image');
        }
    }
    // Créer une miniature
    static async creerMiniature(cheminSource, largeur = 300, hauteur = 300) {
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
        }
        catch (erreur) {
            console.error('Erreur lors de la création de la miniature:', erreur);
            throw new Error('Impossible de créer la miniature');
        }
    }
    // Obtenir les métadonnées d'une image
    static async obtenirMetadonnees(cheminFichier) {
        try {
            const metadata = await sharp(cheminFichier).metadata();
            return {
                largeur: metadata.width,
                hauteur: metadata.height,
                format: metadata.format,
                taille: metadata.size,
                espace: metadata.space,
            };
        }
        catch (erreur) {
            console.error('Erreur lors de la lecture des métadonnées:', erreur);
            throw new Error('Impossible de lire les métadonnées');
        }
    }
    // Valider qu'un fichier est bien une image
    static async validerImage(cheminFichier) {
        try {
            const metadata = await sharp(cheminFichier).metadata();
            return !!(metadata.width && metadata.height);
        }
        catch (erreur) {
            return false;
        }
    }
    // Upload vers Cloudinary
    static async uploadToCloudinary(fichier, dossier = 'produits') {
        try {
            // Upload vers Cloudinary avec transformation pour l'image principale
            const resultat = await cloudinary.uploader.upload(fichier.path, {
                folder: dossier,
                resource_type: 'auto',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // Image principale
                ],
            });
            // Générer l'URL de la miniature en utilisant les transformations Cloudinary
            const urlMiniature = cloudinary.url(resultat.public_id, {
                width: 300,
                height: 300,
                crop: 'fill',
                quality: 'auto',
                format: 'auto'
            });
            // Supprimer le fichier temporaire
            fs.unlinkSync(fichier.path);
            return {
                url: resultat.secure_url,
                urlMiniature: urlMiniature,
                publicId: resultat.public_id,
                metadata: {
                    largeur: resultat.width,
                    hauteur: resultat.height,
                    taille: resultat.bytes,
                },
            };
        }
        catch (error) {
            console.error('Erreur Cloudinary:', error);
            // Nettoyer le fichier temporaire en cas d'erreur
            if (fs.existsSync(fichier.path)) {
                fs.unlinkSync(fichier.path);
            }
            throw new Error(`Erreur lors de l'upload vers Cloudinary: ${error.message}`);
        }
    }
    // Traiter un lot d'images avec Cloudinary
    static async traiterLot(fichiers, options = {}) {
        const resultats = [];
        for (const fichier of fichiers) {
            try {
                // Valider l'image
                const estValide = await this.validerImage(fichier.path);
                if (!estValide) {
                    fs.unlinkSync(fichier.path);
                    throw new Error(`Fichier invalide: ${fichier.originalname}`);
                }
                // Upload vers Cloudinary
                const resultatCloudinary = await this.uploadToCloudinary(fichier, 'produits');
                resultats.push({
                    url: resultatCloudinary.url,
                    urlMiniature: resultatCloudinary.urlMiniature,
                    publicId: resultatCloudinary.publicId,
                    metadata: resultatCloudinary.metadata,
                });
            }
            catch (erreur) {
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
    // Supprimer une image de Cloudinary
    static async supprimerDeCloudinary(publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        }
        catch (error) {
            console.error('Erreur lors de la suppression de l\'image:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=imageProcessor.js.map