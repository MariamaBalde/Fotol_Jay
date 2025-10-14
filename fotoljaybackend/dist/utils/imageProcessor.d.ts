import sharp from 'sharp';
export interface OptionsTraitement {
    largeurMax?: number;
    hauteurMax?: number;
    qualite?: number;
    format?: 'jpeg' | 'png' | 'webp';
}
export declare class ProcesseurImage {
    static optimiser(cheminSource: string, cheminDestination?: string, options?: OptionsTraitement): Promise<string>;
    static creerMiniature(cheminSource: string, largeur?: number, hauteur?: number): Promise<string>;
    static obtenirMetadonnees(cheminFichier: string): Promise<{
        largeur: number;
        hauteur: number;
        format: keyof sharp.FormatEnum;
        taille: number | undefined;
        espace: keyof sharp.ColourspaceEnum;
    }>;
    static validerImage(cheminFichier: string): Promise<boolean>;
    static traiterLot(fichiers: Express.Multer.File[], options?: OptionsTraitement): Promise<Array<{
        original: string;
        optimise: string;
        miniature: string;
        metadata: any;
    }>>;
}
//# sourceMappingURL=imageProcessor.d.ts.map