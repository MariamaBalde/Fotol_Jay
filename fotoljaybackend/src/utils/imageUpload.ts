import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Récupérer __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
const produitsDir = path.join(uploadsDir, 'produits');
const profilsDir = path.join(uploadsDir, 'profils');
const tempDir = path.join(uploadsDir, 'temp');

[uploadsDir, produitsDir, profilsDir, tempDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Détermine le dossier selon le type d'upload
    const uploadType = req.body.uploadType || 'produits';
    let destinationDir = produitsDir;

    if (uploadType === 'profil') {
      destinationDir = profilsDir;
    }

    cb(null, destinationDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Génère un nom unique : timestamp-random-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    // Nettoyer le nom de fichier
    const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

// Filtre pour n'accepter que les images
function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  // Types MIME autorisés
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé. Acceptés: JPEG, PNG, WebP`));
  }
}

// Configuration Multer pour produits
export const uploadProduit = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max par image
    files: 5, // Maximum 5 images
  },
});

// Configuration Multer pour photo de profil
export const uploadProfil = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB max
    files: 1, // Une seule image
  },
});

// Middleware pour gérer les erreurs Multer
export function gererErreursUpload(err: any, req: Request, res: any, next: any) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        erreur: 'Fichier trop volumineux',
        details: 'Taille maximale: 5 MB par image',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        erreur: 'Trop de fichiers',
        details: 'Maximum 5 images autorisées',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        erreur: 'Champ de fichier inattendu',
        details: 'Utilisez le champ "images" pour les produits',
      });
    }
    return res.status(400).json({
      erreur: 'Erreur d\'upload',
      details: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      erreur: err.message || 'Erreur lors de l\'upload',
    });
  }

  next();
}

// Fonction pour supprimer un fichier
export function supprimerFichier(cheminFichier: string): void {
  try {
    const cheminComplet = path.join(__dirname, '../../', cheminFichier);
    if (fs.existsSync(cheminComplet)) {
      fs.unlinkSync(cheminComplet);
    }
  } catch (erreur) {
    console.error('Erreur lors de la suppression du fichier:', erreur);
  }
}

// Fonction pour supprimer plusieurs fichiers
export function supprimerFichiers(chemins: string[]): void {
  chemins.forEach((chemin) => supprimerFichier(chemin));
}