import { Router } from 'express';
import { body } from 'express-validator';
import { OrderController } from '../controllers/OrderController';
import { PlaceOrderUseCase } from '../../../../application/use-cases/order/PlaceOrderUseCase';
import { GetOrdersUseCase } from '../../../../application/use-cases/order/GetOrdersUseCase';
import { GetOrderByIdUseCase } from '../../../../application/use-cases/order/GetOrderByIdUseCase';
import { UpdateOrderStatusUseCase } from '../../../../application/use-cases/order/UpdateOrderStatusUseCase';
import { MongoOrderRepository } from '../../db/repositories/MongoOrderRepository';
import { MongoCartRepository } from '../../db/repositories/MongoCartRepository';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

const orderRepo = new MongoOrderRepository();
const cartRepo = new MongoCartRepository();

const controller = new OrderController(
  new PlaceOrderUseCase(orderRepo, cartRepo),
  new GetOrdersUseCase(orderRepo),
  new GetOrderByIdUseCase(orderRepo),
  new UpdateOrderStatusUseCase(orderRepo),
);

const placeOrderRules = [
  body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
  body('notes').optional().trim(),
  body('items').optional().isArray().withMessage('Items must be an array'),
  body('items.*.foodItemId').optional().notEmpty().withMessage('Each item must have a foodItemId'),
  body('items.*.title').optional().notEmpty().withMessage('Each item must have a title'),
  body('items.*.price').optional().isFloat({ min: 0 }).withMessage('Each item price must be a positive number'),
  body('items.*.quantity').optional().isInt({ min: 1 }).withMessage('Each item quantity must be at least 1'),
];

const updateStatusRules = [
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
];

router.use(authenticate);

router.post('/', placeOrderRules, validate, controller.placeOrder);
router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.patch('/:id/status', updateStatusRules, validate, controller.updateStatus);

export default router;
