import { Router } from 'express';
import * as controleurNotifications from './NotificationsController.js';
import { AuthMiddleware } from '../../middleware/AuthMiddleware.js';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(AuthMiddleware);

// Obtenir mes notifications
router.get('/', controleurNotifications.obtenirMesNotifications);

// Compter les notifications non lues
router.get('/non-lues/count', controleurNotifications.compterNonLues);

// Marquer une notification comme lue
router.patch('/:id/lue', controleurNotifications.marquerCommeLue);

// Marquer toutes les notifications comme lues
router.patch('/toutes/lues', controleurNotifications.marquerToutesCommeLues);

// Supprimer une notification
router.delete('/:id', controleurNotifications.supprimerNotification);

export default router;