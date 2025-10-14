import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/AuthMiddleware.js';
/**
 * Obtenir les notifications de l'utilisateur connecté
 */
export declare function obtenirMesNotifications(req: AuthRequest, res: Response): Promise<Response>;
/**
 * Compter les notifications non lues
 */
export declare function compterNonLues(req: AuthRequest, res: Response): Promise<Response>;
/**
 * Marquer une notification comme lue
 */
export declare function marquerCommeLue(req: AuthRequest, res: Response): Promise<Response>;
/**
 * Marquer toutes les notifications comme lues
 */
export declare function marquerToutesCommeLues(req: AuthRequest, res: Response): Promise<Response>;
/**
 * Supprimer une notification
 */
export declare function supprimerNotification(req: AuthRequest, res: Response): Promise<Response>;
//# sourceMappingURL=NotificationsController.d.ts.map