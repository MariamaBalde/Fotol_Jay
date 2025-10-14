import { type DonneesNotification } from './NotificationsRepository.js';
export declare enum TypeNotification {
    EXPIRATION_J2 = "EXPIRATION_J2",
    EXPIRATION_J0 = "EXPIRATION_J0",
    PRODUIT_EXPIRE = "PRODUIT_EXPIRE",
    PRODUIT_APPROUVE = "PRODUIT_APPROUVE",
    PRODUIT_REFUSE = "PRODUIT_REFUSE",
    CONTACT_RECU = "CONTACT_RECU",
    NOUVEAU_MESSAGE = "NOUVEAU_MESSAGE",
    VIP_EXPIRE = "VIP_EXPIRE",
    VIP_BIENTOT_EXPIRE = "VIP_BIENTOT_EXPIRE"
}
export declare class NotificationsService {
    private repository;
    constructor();
    /**
     * Créer une notification
     */
    creerNotification(donnees: DonneesNotification): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Obtenir les notifications d'un utilisateur
     */
    obtenirNotificationsUtilisateur(utilisateurId: string, options?: {
        seulement_non_lues?: boolean;
        limite?: number;
        page?: number;
    }): Promise<{
        notifications: {
            id: string;
            dateCreation: Date;
            titre: string;
            utilisateurId: string;
            type: string;
            message: string;
            estLu: boolean;
        }[];
        pagination: {
            page: number;
            limite: number;
            total: number;
            totalPages: number;
        };
        nonLues: number;
    }>;
    /**
     * Marquer une notification comme lue
     */
    marquerCommeLue(id: string, utilisateurId: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Marquer toutes les notifications comme lues
     */
    marquerToutesCommeLues(utilisateurId: string): Promise<{
        count: number;
    }>;
    /**
     * Supprimer une notification
     */
    supprimerNotification(id: string, utilisateurId: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Compter les notifications non lues
     */
    compterNonLues(utilisateurId: string): Promise<{
        nonLues: number;
    }>;
    /**
     * Notification : Produit expire dans 2 jours
     */
    notifierExpirationJ2(utilisateurId: string, produitTitre: string, produitId: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Notification : Produit expire aujourd'hui
     */
    notifierExpirationJ0(utilisateurId: string, produitTitre: string, produitId: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Notification : Produit expiré et supprimé
     */
    notifierProduitExpire(utilisateurId: string, produitTitre: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Notification : Produit approuvé par modérateur
     */
    notifierProduitApprouve(utilisateurId: string, produitTitre: string, produitId: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Notification : Produit refusé par modérateur
     */
    notifierProduitRefuse(utilisateurId: string, produitTitre: string, raisonRefus: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Notification : Un acheteur a contacté le vendeur
     */
    notifierContactRecu(utilisateurId: string, produitTitre: string, produitId: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Notification : VIP bientôt expiré (3 jours avant)
     */
    notifierVIPBientotExpire(utilisateurId: string, joursRestants: number): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Notification : VIP expiré
     */
    notifierVIPExpire(utilisateurId: string): Promise<{
        id: string;
        dateCreation: Date;
        titre: string;
        utilisateurId: string;
        type: string;
        message: string;
        estLu: boolean;
    }>;
    /**
     * Nettoyer les anciennes notifications (cron job)
     */
    nettoyerAnciennesNotifications(): Promise<{
        count: number;
    }>;
}
//# sourceMappingURL=NotificationsService.d.ts.map