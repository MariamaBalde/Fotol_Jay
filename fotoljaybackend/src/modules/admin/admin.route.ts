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

// Routes de tarification VIP
router.get('/vip-pricing', adminController.getVipPricing.bind(adminController));
router.post('/vip-pricing', adminController.createVipPricing.bind(adminController));
router.put('/vip-pricing/:id', adminController.updateVipPricing.bind(adminController));

// Routes des codes promo VIP
router.get('/vip-promo-codes', adminController.getVipPromoCodes.bind(adminController));
router.post('/vip-promo-codes', adminController.createVipPromoCode.bind(adminController));
router.put('/vip-promo-codes/:id', adminController.updateVipPromoCode.bind(adminController));

// Routes des abonnements VIP
router.get('/vip-subscriptions', adminController.getVipSubscriptions.bind(adminController));
router.post('/vip-subscriptions', adminController.createVipSubscription.bind(adminController));
router.put('/vip-subscriptions/:subscriptionId/extend', adminController.extendVipSubscription.bind(adminController));
router.put('/vip-subscriptions/:subscriptionId/refund', adminController.refundVipSubscription.bind(adminController));

// Routes des analytics VIP
router.get('/vip-analytics', adminController.getVipAnalytics.bind(adminController));

// Routes d'export
router.get('/export/:type', adminController.exportReports.bind(adminController));

// Routes de gestion des utilisateurs
router.get('/users', adminController.getUsers.bind(adminController));
router.patch('/users/:id/status', adminController.updateUserStatus.bind(adminController));

// Routes de modération
router.get('/moderation/pending', adminController.getPendingProducts.bind(adminController));
router.post('/moderation/:productId', adminController.moderateProduct.bind(adminController));

export default router;