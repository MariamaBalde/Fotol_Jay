import multer from 'multer';
import type { Request } from 'express';
export declare const uploadProduit: multer.Multer;
export declare const uploadProfil: multer.Multer;
export declare function gererErreursUpload(err: any, req: Request, res: any, next: any): any;
export declare function supprimerFichier(cheminFichier: string): void;
export declare function supprimerFichiers(chemins: string[]): void;
//# sourceMappingURL=imageUpload.d.ts.map