import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    motDePasse: z.ZodString;
    prenom: z.ZodString;
    nom: z.ZodString;
    telephone: z.ZodString;
    localisation: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    motDePasse: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=AuthValidation.d.ts.map