import { Router } from 'express';
import { UserController } from './UserController.js';
import { AuthMiddleware } from '../../middleware/AuthMiddleware.js';
import { RoleMiddleware } from '../../middleware/RoleMiddleware.js';
import { ValidateRequest } from '../../middleware/ValidationMiddleware.js';
import { registerSchema } from '../Auth/AuthValidation.js';

const router = Router();
const userController = new UserController();

router.get('/', 
    AuthMiddleware,
    RoleMiddleware("ADMINISTRATEUR"), 
    userController.getAllUsers.bind(userController)
);

router.get('/:id', 
    AuthMiddleware,
    userController.getUserById.bind(userController)
);

router.put('/:id',
    AuthMiddleware,
    userController.updateUser.bind(userController)
);

router.delete('/:id',
    AuthMiddleware,
    RoleMiddleware("ADMINISTRATEUR"),
    userController.deleteUser.bind(userController)
);

router.post('/',
    AuthMiddleware,
    RoleMiddleware("ADMINISTRATEUR"),
    ValidateRequest(registerSchema),
    userController.createUser.bind(userController)
);

export default router;