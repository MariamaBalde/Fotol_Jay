import prisma from '../../config/database.js';
export class NotificationsRepository {
    /**
     * Créer une nouvelle notification
     */
    async creer(donnees) {
        return await prisma.notification.create({
            data: donnees,
        });
    }
    /**
     * Créer plusieurs notifications en une seule fois
     */
    async creerPlusieurs(notifications) {
        return await prisma.notification.createMany({
            data: notifications,
        });
    }
    /**
     * Obtenir les notifications d'un utilisateur
     */
    async obtenirParUtilisateur(utilisateurId, options = {}) {
        const { seulement_non_lues = false, limite = 20, page = 1 } = options;
        const skip = (page - 1) * limite;
        const where = { utilisateurId };
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
    async obtenirParId(id) {
        return await prisma.notification.findUnique({
            where: { id },
        });
    }
    /**
     * Marquer une notification comme lue
     */
    async marquerCommeLue(id) {
        return await prisma.notification.update({
            where: { id },
            data: { estLu: true },
        });
    }
    /**
     * Marquer toutes les notifications d'un utilisateur comme lues
     */
    async marquerToutesCommeLues(utilisateurId) {
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
    async supprimer(id) {
        return await prisma.notification.delete({
            where: { id },
        });
    }
    /**
     * Supprimer toutes les notifications d'un utilisateur
     */
    async supprimerToutesParUtilisateur(utilisateurId) {
        return await prisma.notification.deleteMany({
            where: { utilisateurId },
        });
    }
    /**
     * Compter les notifications non lues d'un utilisateur
     */
    async compterNonLues(utilisateurId) {
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
    async supprimerAnciennes() {
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
//# sourceMappingURL=NotificationsRepository.js.map