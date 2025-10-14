import { z } from 'zod';
const ETATS = ['NEUF', 'COMME_NEUF', 'BON_ETAT', 'ETAT_CORRECT', 'A_REPARER'];
export const schemaCreationProduit = z.object({
    titre: z
        .string()
        .min(5, 'Le titre doit contenir au moins 5 caractères')
        .max(100, 'Le titre ne doit pas dépasser 100 caractères'),
    description: z
        .string()
        .min(10, 'La description doit contenir au moins 10 caractères')
        .max(1000, 'La description ne doit pas dépasser 1000 caractères'),
    prix: z
        .number()
        .positive('Le prix doit être supérieur à 0')
        .max(999999999, 'Le prix est trop élevé'),
    categorie: z.string().min(1, 'La catégorie est requise'),
    localisation: z.string().optional(),
    images: z.array(z.object({
        url: z.string(),
        urlMiniature: z.string(),
        ordre: z.number(),
        metadata: z.object({
            largeur: z.number(),
            hauteur: z.number(),
            taille: z.number().optional()
        })
    })).min(1, 'Au moins une image est requise'),
    etat: z.enum(ETATS),
});
export const schemaModificationProduit = z.object({
    titre: z.string().min(5).max(100).optional(),
    description: z.string().min(20).max(1000).optional(),
    prix: z.number().positive().max(999999999).optional(),
    categorie: z.string().min(1).optional(),
    etat: z.enum(ETATS).optional(),
});
export const schemaFiltresProduits = z.object({
    categorie: z.string().optional(),
    prixMin: z.number().positive().optional(),
    prixMax: z.number().positive().optional(),
    etat: z.string().optional(),
    recherche: z.string().optional(),
    page: z.number().int().positive().default(1),
    limite: z.number().int().positive().max(100).default(20),
});
export const schemaModerationProduit = z.object({
    statut: z.enum(['APPROUVE', 'REFUSE']),
    raisonRefus: z.string().min(10).optional(),
});
//# sourceMappingURL=ProduitsValidation.js.map