import { type Response } from 'express';
import { type AuthRequest } from '../../middleware/AuthMiddleware.js';
export declare class ProduitsController {
    private serviceProduits;
    constructor();
    creerProduit(req: AuthRequest, res: Response): Promise<Response>;
    obtenirProduit(req: AuthRequest, res: Response): Promise<Response>;
    listerProduits(req: AuthRequest, res: Response): Promise<Response>;
    obtenirMesProduits(req: AuthRequest, res: Response): Promise<Response>;
    modifierProduit(req: AuthRequest, res: Response): Promise<Response>;
    supprimerProduit(req: AuthRequest, res: Response): Promise<Response>;
    enregistrerContact(req: AuthRequest, res: Response): Promise<Response>;
    listerProduitsEnAttente(req: AuthRequest, res: Response): Promise<Response>;
    modererProduit(req: AuthRequest, res: Response): Promise<Response>;
}
//# sourceMappingURL=ProduitsController.d.ts.map