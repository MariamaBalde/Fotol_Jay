import type { Notification } from '@prisma/client';
export interface DonneesNotification {
    type: string;
    titre: string;
    message: string;
    utilisateurId: string;
}
export declare class NotificationsRepository {
    /**
     * Créer une nouvelle notification
     */
    creer(donnees: DonneesNotification): Promise<Notification>;
    /**
     * Créer plusieurs notifications en une seule fois
     */
    creerPlusieurs(notifications: DonneesNotification[]): Promise<{
        count: number;
    }>;
    /**
     * Obtenir les notifications d'un utilisateur
     */
    obtenirParUtilisateur(utilisateurId: string, options?: {
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
     * Obtenir une notification par ID
     */
    obtenirParId(id: string): Promise<Notification | null>;
    /**
     * Marquer une notification comme lue
     */
    marquerCommeLue(id: string): Promise<Notification>;
    /**
     * Marquer toutes les notifications d'un utilisateur comme lues
     */
    marquerToutesCommeLues(utilisateurId: string): Promise<{
        count: number;
    }>;
    /**
     * Supprimer une notification
     */
    supprimer(id: string): Promise<Notification>;
    /**
     * Supprimer toutes les notifications d'un utilisateur
     */
    supprimerToutesParUtilisateur(utilisateurId: string): Promise<{
        count: number;
    }>;
    /**
     * Compter les notifications non lues d'un utilisateur
     */
    compterNonLues(utilisateurId: string): Promise<number>;
    /**
     * Supprimer les anciennes notifications (plus de 30 jours)
     */
    supprimerAnciennes(): Promise<{
        count: number;
    }>;
}
//# sourceMappingURL=NotificationsRepository.d.ts.map