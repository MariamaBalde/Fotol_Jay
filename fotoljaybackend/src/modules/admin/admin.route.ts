import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { AuthMiddleware } from '../../middleware/AuthMiddleware.js';

const router = Router();
const adminController = new AdminController();

// Middleware pour vérifier les rôles admin
const checkAdminRole = (req: any, res: any, next: any) => {
  const user = req.user;
  if (!user || !['ADMINISTRATEUR', 'MODERATEUR'].includes(user.role)) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  next();
};

// Appliquer les middlewares globaux pour toutes les routes admin
router.use(AuthMiddleware);
router.use(checkAdminRole);

// Routes du dashboard
router.get('/dashboard', adminController.getDashboardStats.bind(adminController));

// Routes des signalements
router.get('/reports', adminController.getReports.bind(adminController));
router.put('/reports/:reportId', adminController.processReport.bind(adminController));

// Routes des modérateurs
router.get('/moderators', adminController.getModerators.bind(adminController));
router.post('/moderators', adminController.createModerator.bind(adminController));
router.put('/users/:userId/role', adminController.updateUserRole.bind(adminController));
router.put('/moderators/:userId/status', adminController.updateModeratorStatus.bind(adminController));
router.put('/moderators/:userId', adminController.updateModerator.bind(adminController));
router.delete('/moderators/:userId', adminController.deleteModerator.bind(adminController));
router.get('/moderators/:moderatorId/history', adminController.getModeratorHistory.bind(adminController));
router.get('/moderators/ranking', adminController.getModeratorRanking.bind(adminController));
router.post('/moderators/:moderatorId/feedback', adminController.submitModeratorFeedback.bind(adminController));

// Routes des paramètres VIP
router.get('/vip-settings', adminController.getVipSettings.bind(adminController));
router.put('/vip-settings/:key', adminController.updateVipSetting.bind(adminController));

// Routes d'export
router.get('/export/:type', adminController.exportReports.bind(adminController));

// Routes de gestion des utilisateurs
router.get('/users', adminController.getUsers.bind(adminController));
router.patch('/users/:id/status', adminController.updateUserStatus.bind(adminController));

// Routes de modération
router.get('/moderation/pending', adminController.getPendingProducts.bind(adminController));
router.post('/moderation/:productId', adminController.moderateProduct.bind(adminController));

export default router;