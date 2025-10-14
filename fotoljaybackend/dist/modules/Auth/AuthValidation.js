import { z } from 'zod';
export const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    motDePasse: z.string().min(5, 'Le mot de passe doit contenir au moins 8 caractères'),
    prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    telephone: z.string().regex(/^(\+221)?[0-9]{9}$/, 'Numéro de téléphone invalide'),
    localisation: z.string().optional(),
});
export const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    motDePasse: z.string().min(1, 'Le mot de passe est requis'),
});
//# sourceMappingURL=AuthValidation.js.map