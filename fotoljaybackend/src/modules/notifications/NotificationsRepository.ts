import prisma from '../../config/database.js';
import type { Notification } from '@prisma/client';

export interface DonneesNotification {
  type: string;
  titre: string;
  message: string;
  utilisateurId: string;
}

export class NotificationsRepository {
  /**
   * Créer une nouvelle notification
   */
  async creer(donnees: DonneesNotification): Promise<Notification> {
    return await prisma.notification.create({
      data: donnees,
    });
  }

  /**
   * Créer plusieurs notifications en une seule fois
   */
  async creerPlusieurs(notifications: DonneesNotification[]): Promise<{ count: number }> {
    return await prisma.notification.createMany({
      data: notifications,
    });
  }

  /**
   * Obtenir les notifications d'un utilisateur
   */
  async obtenirParUtilisateur(
    utilisateurId: string,
    options: {
      seulement_non_lues?: boolean;
      limite?: number;
      page?: number;
    } = {}
  ) {
    const { seulement_non_lues = false, limite = 20, page = 1 } = options;
    const skip = (page - 1) * limite;

    const where: any = { utilisateurId };
    if (seulement_non_lues) {
      where.estLu = false;
    }

    const [notifications, total, nonLues] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { dateCreation: 'desc' },
        take: limite,
        skip,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { utilisateurId, estLu: false },
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limite,
        total,
        totalPages: Math.ceil(total / limite),
      },
      nonLues,
    };
  }

  /**
   * Obtenir une notification par ID
   */
  async obtenirParId(id: string): Promise<Notification | null> {
    return await prisma.notification.findUnique({
      where: { id },
    });
  }

  /**
   * Marquer une notification comme lue
   */
  async marquerCommeLue(id: string): Promise<Notification> {
    return await prisma.notification.update({
      where: { id },
      data: { estLu: true },
    });
  }

  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  async marquerToutesCommeLues(utilisateurId: string): Promise<{ count: number }> {
    return await prisma.notification.updateMany({
      where: {
        utilisateurId,
        estLu: false,
      },
      data: { estLu: true },
    });
  }

  /**
   * Supprimer une notification
   */
  async supprimer(id: string): Promise<Notification> {
    return await prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * Supprimer toutes les notifications d'un utilisateur
   */
  async supprimerToutesParUtilisateur(utilisateurId: string): Promise<{ count: number }> {
    return await prisma.notification.deleteMany({
      where: { utilisateurId },
    });
  }

  /**
   * Compter les notifications non lues d'un utilisateur
   */
  async compterNonLues(utilisateurId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        utilisateurId,
        estLu: false,
      },
    });
  }

  /**
   * Supprimer les anciennes notifications (plus de 30 jours)
   */
  async supprimerAnciennes(): Promise<{ count: number }> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 30);

    return await prisma.notification.deleteMany({
      where: {
        dateCreation: { lt: dateLimit },
        estLu: true,
      },
    });
  }
}