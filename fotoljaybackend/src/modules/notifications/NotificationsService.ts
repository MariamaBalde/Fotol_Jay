import { NotificationsRepository, type DonneesNotification } from './NotificationsRepository.js';

export enum TypeNotification {
  EXPIRATION_J2 = 'EXPIRATION_J2',
  EXPIRATION_J0 = 'EXPIRATION_J0',
  PRODUIT_EXPIRE = 'PRODUIT_EXPIRE',
  PRODUIT_APPROUVE = 'PRODUIT_APPROUVE',
  PRODUIT_REFUSE = 'PRODUIT_REFUSE',
  CONTACT_RECU = 'CONTACT_RECU',
  NOUVEAU_MESSAGE = 'NOUVEAU_MESSAGE',
  VIP_EXPIRE = 'VIP_EXPIRE',
  VIP_BIENTOT_EXPIRE = 'VIP_BIENTOT_EXPIRE',
}

export class NotificationsService {
  private repository: NotificationsRepository;

  constructor() {
    this.repository = new NotificationsRepository();
  }

  /**
   * Créer une notification
   */
  async creerNotification(donnees: DonneesNotification) {
    return await this.repository.creer(donnees);
  }

  /**
   * Obtenir les notifications d'un utilisateur
   */
  async obtenirNotificationsUtilisateur(
    utilisateurId: string,
    options: {
      seulement_non_lues?: boolean;
      limite?: number;
      page?: number;
    } = {}
  ) {
    return await this.repository.obtenirParUtilisateur(utilisateurId, options);
  }

  /**
   * Marquer une notification comme lue
   */
  async marquerCommeLue(id: string, utilisateurId: string) {
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
  async marquerToutesCommeLues(utilisateurId: string) {
    return await this.repository.marquerToutesCommeLues(utilisateurId);
  }

  /**
   * Supprimer une notification
   */
  async supprimerNotification(id: string, utilisateurId: string) {
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
  async compterNonLues(utilisateurId: string) {
    const count = await this.repository.compterNonLues(utilisateurId);
    return { nonLues: count };
  }

  // ========== NOTIFICATIONS SPÉCIFIQUES ==========

  /**
   * Notification : Produit expire dans 2 jours
   */
  async notifierExpirationJ2(utilisateurId: string, produitTitre: string, produitId: string) {
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
  async notifierExpirationJ0(utilisateurId: string, produitTitre: string, produitId: string) {
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
  async notifierProduitExpire(utilisateurId: string, produitTitre: string) {
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
  async notifierProduitApprouve(utilisateurId: string, produitTitre: string, produitId: string) {
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
  async notifierProduitRefuse(
    utilisateurId: string,
    produitTitre: string,
    raisonRefus: string
  ) {
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
  async notifierContactRecu(utilisateurId: string, produitTitre: string, produitId: string) {
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
  async notifierVIPBientotExpire(utilisateurId: string, joursRestants: number) {
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
  async notifierVIPExpire(utilisateurId: string) {
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