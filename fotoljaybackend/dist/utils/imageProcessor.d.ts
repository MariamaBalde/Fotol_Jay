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
    static uploadToCloudinary(fichier: Express.Multer.File, dossier?: string): Promise<{
        url: string;
        urlMiniature: string;
        publicId: string;
        metadata: {
            largeur: number;
            hauteur: number;
            taille: number;
        };
    }>;
    static traiterLot(fichiers: Express.Multer.File[], options?: OptionsTraitement): Promise<Array<{
        url: string;
        urlMiniature: string;
        publicId: string;
        metadata: any;
    }>>;
    static supprimerDeCloudinary(publicId: string): Promise<void>;
}
//# sourceMappingURL=imageProcessor.d.ts.map