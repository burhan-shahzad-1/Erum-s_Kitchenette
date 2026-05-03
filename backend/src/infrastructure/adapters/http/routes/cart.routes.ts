import { Router } from 'express';
import { body } from 'express-validator';
import { CartController } from '../controllers/CartController';
import { GetCartUseCase } from '../../../../application/use-cases/cart/GetCartUseCase';
import { AddToCartUseCase } from '../../../../application/use-cases/cart/AddToCartUseCase';
import { RemoveFromCartUseCase } from '../../../../application/use-cases/cart/RemoveFromCartUseCase';
import { ClearCartUseCase } from '../../../../application/use-cases/cart/ClearCartUseCase';
import { MongoCartRepository } from '../../db/repositories/MongoCartRepository';
import { MongoFoodItemRepository } from '../../db/repositories/MongoFoodItemRepository';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

const cartRepo = new MongoCartRepository();
const foodRepo = new MongoFoodItemRepository();

const controller = new CartController(
  new GetCartUseCase(cartRepo),
  new AddToCartUseCase(cartRepo, foodRepo),
  new RemoveFromCartUseCase(cartRepo),
  new ClearCartUseCase(cartRepo),
);

const addItemRules = [
  body('foodItemId').notEmpty().withMessage('foodItemId is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

router.use(authenticate, authorize('customer'));

router.get('/', controller.getCart);
router.post('/items', addItemRules, validate, controller.addItem);
router.delete('/items/:foodItemId', controller.removeItem);
router.delete('/', controller.clearCart);

export default router;
