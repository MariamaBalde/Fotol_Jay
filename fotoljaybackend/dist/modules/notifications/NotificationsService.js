import { NotificationsRepository } from './NotificationsRepository.js';
export var TypeNotification;
(function (TypeNotification) {
    TypeNotification["EXPIRATION_J2"] = "EXPIRATION_J2";
    TypeNotification["EXPIRATION_J0"] = "EXPIRATION_J0";
    TypeNotification["PRODUIT_EXPIRE"] = "PRODUIT_EXPIRE";
    TypeNotification["PRODUIT_APPROUVE"] = "PRODUIT_APPROUVE";
    TypeNotification["PRODUIT_REFUSE"] = "PRODUIT_REFUSE";
    TypeNotification["CONTACT_RECU"] = "CONTACT_RECU";
    TypeNotification["NOUVEAU_MESSAGE"] = "NOUVEAU_MESSAGE";
    TypeNotification["VIP_EXPIRE"] = "VIP_EXPIRE";
    TypeNotification["VIP_BIENTOT_EXPIRE"] = "VIP_BIENTOT_EXPIRE";
})(TypeNotification || (TypeNotification = {}));
export class NotificationsService {
    repository;
    constructor() {
        this.repository = new NotificationsRepository();
    }
    /**
     * Créer une notification
     */
    async creerNotification(donnees) {
        return await this.repository.creer(donnees);
    }
    /**
     * Obtenir les notifications d'un utilisateur
     */
    async obtenirNotificationsUtilisateur(utilisateurId, options = {}) {
        return await this.repository.obtenirParUtilisateur(utilisateurId, options);
    }
    /**
     * Marquer une notification comme lue
     */
    async marquerCommeLue(id, utilisateurId) {
        const notification = await this.repository.obtenirParId(id);
        if (!notification) {
            throw new Error('Notification non trouvée');
        }
        if (notification.utilisateurId !== utilisateurId) {
            throw new Error('Vous n\'êtes pas autorisé à modifier cette notification');
        }
        return await this.repository.marquerCommeLue(id);
    }
    /**
     * Marquer toutes les notifications comme lues
     */
    async marquerToutesCommeLues(utilisateurId) {
        return await this.repository.marquerToutesCommeLues(utilisateurId);
    }
    /**
     * Supprimer une notification
     */
    async supprimerNotification(id, utilisateurId) {
        const notification = await this.repository.obtenirParId(id);
        if (!notification) {
            throw new Error('Notification non trouvée');
        }
        if (notification.utilisateurId !== utilisateurId) {
            throw new Error('Vous n\'êtes pas autorisé à supprimer cette notification');
        }
        return await this.repository.supprimer(id);
    }
    /**
     * Compter les notifications non lues
     */
    async compterNonLues(utilisateurId) {
        const count = await this.repository.compterNonLues(utilisateurId);
        return { nonLues: count };
    }
    // ========== NOTIFICATIONS SPÉCIFIQUES ==========
    /**
     * Notification : Produit expire dans 2 jours
     */
    async notifierExpirationJ2(utilisateurId, produitTitre, produitId) {
        return await this.creerNotification({
            type: TypeNotification.EXPIRATION_J2,
            titre: 'Votre annonce expire bientôt',
            message: `Votre produit "${produitTitre}" expire dans 2 jours. Pensez à le republier si vous souhaitez le garder en ligne.`,
            utilisateurId,
        });
    }
    /**
     * Notification : Produit expire aujourd'hui
     */
    async notifierExpirationJ0(utilisateurId, produitTitre, produitId) {
        return await this.creerNotification({
            type: TypeNotification.EXPIRATION_J0,
            titre: '⚠️ Dernière chance !',
            message: `Votre produit "${produitTitre}" expire aujourd'hui. Republiez-le maintenant pour éviter sa suppression.`,
            utilisateurId,
        });
    }
    /**
     * Notification : Produit expiré et supprimé
     */
    async notifierProduitExpire(utilisateurId, produitTitre) {
        return await this.creerNotification({
            type: TypeNotification.PRODUIT_EXPIRE,
            titre: 'Produit expiré',
            message: `Votre produit "${produitTitre}" a été supprimé car il a dépassé les 7 jours. Vous pouvez créer une nouvelle annonce.`,
            utilisateurId,
        });
    }
    /**
     * Notification : Produit approuvé par modérateur
     */
    async notifierProduitApprouve(utilisateurId, produitTitre, produitId) {
        return await this.creerNotification({
            type: TypeNotification.PRODUIT_APPROUVE,
            titre: '✅ Produit validé !',
            message: `Félicitations ! Votre produit "${produitTitre}" a été approuvé et est maintenant visible par tous.`,
            utilisateurId,
        });
    }
    /**
     * Notification : Produit refusé par modérateur
     */
    async notifierProduitRefuse(utilisateurId, produitTitre, raisonRefus) {
        return await this.creerNotification({
            type: TypeNotification.PRODUIT_REFUSE,
            titre: '❌ Produit refusé',
            message: `Votre produit "${produitTitre}" a été refusé. Raison : ${raisonRefus}. Vous pouvez le modifier et le soumettre à nouveau.`,
            utilisateurId,
        });
    }
    /**
     * Notification : Un acheteur a contacté le vendeur
     */
    async notifierContactRecu(utilisateurId, produitTitre, produitId) {
        return await this.creerNotification({
            type: TypeNotification.CONTACT_RECU,
            titre: '📞 Nouveau contact',
            message: `Un acheteur est intéressé par votre produit "${produitTitre}". Il a consulté vos coordonnées.`,
            utilisateurId,
        });
    }
    /**
     * Notification : VIP bientôt expiré (3 jours avant)
     */
    async notifierVIPBientotExpire(utilisateurId, joursRestants) {
        return await this.creerNotification({
            type: TypeNotification.VIP_BIENTOT_EXPIRE,
            titre: '⭐ Votre statut VIP expire bientôt',
            message: `Votre abonnement VIP expire dans ${joursRestants} jour(s). Renouvelez-le pour continuer à profiter de la visibilité prioritaire.`,
            utilisateurId,
        });
    }
    /**
     * Notification : VIP expiré
     */
    async notifierVIPExpire(utilisateurId) {
        return await this.creerNotification({
            type: TypeNotification.VIP_EXPIRE,
            titre: '⭐ Statut VIP expiré',
            message: `Votre abonnement VIP a expiré. Renouvelez-le pour retrouver la visibilité prioritaire et les avantages exclusifs.`,
            utilisateurId,
        });
    }
    /**
     * Nettoyer les anciennes notifications (cron job)
     */
    async nettoyerAnciennesNotifications() {
        return await this.repository.supprimerAnciennes();
    }
}
//# sourceMappingURL=NotificationsService.js.map