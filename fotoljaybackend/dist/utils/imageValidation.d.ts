export interface ResultatValidation {
    valide: boolean;
    erreurs: string[];
}
export declare class ValidationImage {
    static validerDimensions(largeur: number, hauteur: number, largeurMin?: number, hauteurMin?: number): ResultatValidation;
    static validerRatio(largeur: number, hauteur: number): ResultatValidation;
    static validerNombre(fichiers: Express.Multer.File[] | undefined, min?: number, max?: number): ResultatValidation;
    static validerTout(fichiers: Express.Multer.File[], options?: {
        largeurMin?: number;
        hauteurMin?: number;
        validerRatio?: boolean;
        min?: number;
        max?: number;
    }): Promise<ResultatValidation>;
}
//# sourceMappingURL=imageValidation.d.ts.map