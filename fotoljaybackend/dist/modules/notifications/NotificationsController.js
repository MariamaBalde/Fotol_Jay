import { NotificationsService } from './NotificationsService.js';
const serviceNotifications = new NotificationsService();
/**
 * Obtenir les notifications de l'utilisateur connecté
 */
export async function obtenirMesNotifications(req, res) {
    try {
        const utilisateurId = req.user.userId;
        const seulement_non_lues = req.query.seulement_non_lues === 'true';
        const page = req.query.page ? Number(req.query.page) : 1;
        const limite = req.query.limite ? Number(req.query.limite) : 20;
        const resultat = await serviceNotifications.obtenirNotificationsUtilisateur(utilisateurId, { seulement_non_lues, page, limite });
        return res.status(200).json(resultat);
    }
    catch (erreur) {
        return res.status(400).json({ erreur: erreur.message });
    }
}
/**
 * Compter les notifications non lues
 */
export async function compterNonLues(req, res) {
    try {
        const utilisateurId = req.user.userId;
        const resultat = await serviceNotifications.compterNonLues(utilisateurId);
        return res.status(200).json(resultat);
    }
    catch (erreur) {
        return res.status(400).json({ erreur: erreur.message });
    }
}
/**
 * Marquer une notification comme lue
 */
export async function marquerCommeLue(req, res) {
    try {
        const { id } = req.params;
        const utilisateurId = req.user.userId;
        const notification = await serviceNotifications.marquerCommeLue(id, utilisateurId);
        return res.status(200).json({
            message: 'Notification marquée comme lue',
            notification,
        });
    }
    catch (erreur) {
        return res.status(400).json({ erreur: erreur.message });
    }
}
/**
 * Marquer toutes les notifications comme lues
 */
export async function marquerToutesCommeLues(req, res) {
    try {
        const utilisateurId = req.user.userId;
        const resultat = await serviceNotifications.marquerToutesCommeLues(utilisateurId);
        return res.status(200).json({
            message: 'Toutes les notifications ont été marquées comme lues',
            count: resultat.count,
        });
    }
    catch (erreur) {
        return res.status(400).json({ erreur: erreur.message });
    }
}
/**
 * Supprimer une notification
 */
export async function supprimerNotification(req, res) {
    try {
        const { id } = req.params;
        const utilisateurId = req.user.userId;
        await serviceNotifications.supprimerNotification(id, utilisateurId);
        return res.status(200).json({ message: 'Notification supprimée' });
    }
    catch (erreur) {
        return res.status(400).json({ erreur: erreur.message });
    }
}
//# sourceMappingURL=NotificationsController.js.map