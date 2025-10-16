import { Router } from 'express';
import { AuthController } from './AuthController.js';
import { ValidateRequest } from '../../middleware/ValidationMiddleware.js';
import { registerSchema, loginSchema } from './AuthValidation.js';
const router = Router();
const authController = new AuthController();
router.post('/inscription', ValidateRequest(registerSchema), authController.register.bind(authController));
router.post('/admin/creer-admin', ValidateRequest(registerSchema), authController.creerAdministrateur.bind(authController));
router.post('/login', ValidateRequest(loginSchema), authController.login.bind(authController));
export default router;
//# sourceMappingURL=AuthRoute.js.map