import { z } from 'zod';
export declare const schemaCreationProduit: z.ZodObject<{
    titre: z.ZodString;
    description: z.ZodString;
    prix: z.ZodNumber;
    categorie: z.ZodString;
    localisation: z.ZodOptional<z.ZodString>;
    images: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        urlMiniature: z.ZodString;
        ordre: z.ZodNumber;
        metadata: z.ZodObject<{
            largeur: z.ZodNumber;
            hauteur: z.ZodNumber;
            taille: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    etat: z.ZodEnum<{
        NEUF: "NEUF";
        COMME_NEUF: "COMME_NEUF";
        BON_ETAT: "BON_ETAT";
        ETAT_CORRECT: "ETAT_CORRECT";
        A_REPARER: "A_REPARER";
    }>;
}, z.core.$strip>;
export declare const schemaModificationProduit: z.ZodObject<{
    titre: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    prix: z.ZodOptional<z.ZodNumber>;
    categorie: z.ZodOptional<z.ZodString>;
    etat: z.ZodOptional<z.ZodEnum<{
        NEUF: "NEUF";
        COMME_NEUF: "COMME_NEUF";
        BON_ETAT: "BON_ETAT";
        ETAT_CORRECT: "ETAT_CORRECT";
        A_REPARER: "A_REPARER";
    }>>;
}, z.core.$strip>;
export declare const schemaFiltresProduits: z.ZodObject<{
    categorie: z.ZodOptional<z.ZodString>;
    prixMin: z.ZodOptional<z.ZodNumber>;
    prixMax: z.ZodOptional<z.ZodNumber>;
    etat: z.ZodOptional<z.ZodString>;
    recherche: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limite: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const schemaModerationProduit: z.ZodObject<{
    statut: z.ZodEnum<{
        APPROUVE: "APPROUVE";
        REFUSE: "REFUSE";
    }>;
    raisonRefus: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=ProduitsValidation.d.ts.map