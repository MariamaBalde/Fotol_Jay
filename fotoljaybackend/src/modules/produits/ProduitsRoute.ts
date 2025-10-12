import { Router } from 'express';
import { ProduitsController } from './ProduitsController.js';
import { AuthMiddleware } from '../../middleware/AuthMiddleware.js';
import { RoleMiddleware } from '../../middleware/RoleMiddleware.js';
import { ValidateRequest } from '../../middleware/ValidationMiddleware.js';
import {
  schemaCreationProduit,
  schemaModificationProduit,
  schemaModerationProduit,
} from './ProduitsValidation.js';

const router = Router();
const produitsController = new ProduitsController();

// Routes publiques
router.get('/', produitsController.listerProduits.bind(produitsController));
router.get('/:id', produitsController.obtenirProduit.bind(produitsController));

// Routes protégées (authentification requise)
router.use(AuthMiddleware);

router.post(
  '/',
  ValidateRequest(schemaCreationProduit),
  produitsController.creerProduit.bind(produitsController)
);

router.get('/mes-produits/liste', produitsController.obtenirMesProduits.bind(produitsController));

router.put(
  '/:id',
  ValidateRequest(schemaModificationProduit),
  produitsController.modifierProduit.bind(produitsController)
);

router.delete('/:id', produitsController.supprimerProduit.bind(produitsController));

router.post('/:id/contact', produitsController.enregistrerContact.bind(produitsController));

// Routes de modération (MODERATEUR ou ADMINISTRATEUR)
router.get(
  '/moderation/en-attente',
  RoleMiddleware('MODERATEUR', 'ADMINISTRATEUR'),
  produitsController.listerProduitsEnAttente.bind(produitsController)
);

router.patch(
  '/:id/moderation',
  RoleMiddleware('MODERATEUR', 'ADMINISTRATEUR'),
  ValidateRequest(schemaModerationProduit),
  produitsController.modererProduit.bind(produitsController)
);

export default router;