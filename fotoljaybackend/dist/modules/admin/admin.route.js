import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { AuthMiddleware } from '../../middleware/AuthMiddleware.js';
const router = Router();
const adminController = new AdminController();
// Middleware pour vérifier les rôles admin
const checkAdminRole = (req, res, next) => {
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
// Routes de gestion des utilisateurs
router.get('/users', adminController.getUsers.bind(adminController));
router.patch('/users/:id/status', adminController.updateUserStatus.bind(adminController));
// Routes de modération
router.get('/moderation/pending', adminController.getPendingProducts.bind(adminController));
router.post('/moderation/:productId', adminController.moderateProduct.bind(adminController));
export default router;
//# sourceMappingURL=admin.route.js.map