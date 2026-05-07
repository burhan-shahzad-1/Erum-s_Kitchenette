import { Router } from 'express';
import { body } from 'express-validator';
import { DeliveryAreaController } from '../controllers/DeliveryAreaController';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();
const controller = new DeliveryAreaController();

const areaRules = [
  body('name').trim().notEmpty().withMessage('Area name is required'),
  body('minOrder').isFloat({ min: 0 }).withMessage('Minimum order must be a positive number'),
  body('deliveryCharge').isFloat({ min: 0 }).withMessage('Delivery charge must be a positive number'),
];

// Public — customers can read active delivery areas
router.get('/', controller.getActive);

// Admin-only CRUD
router.get('/all', authenticate, authorize('owner', 'admin'), controller.getAll);
router.post('/', authenticate, authorize('owner', 'admin'), areaRules, validate, controller.create);
router.put('/:id', authenticate, authorize('owner', 'admin'), controller.update);
router.delete('/:id', authenticate, authorize('owner', 'admin'), controller.remove);

export default router;
