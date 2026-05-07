import { Router } from 'express';
import authRoutes from './auth.routes';
import foodRoutes from './food.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import deliveryRoutes from './delivery.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/food', foodRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/delivery-areas', deliveryRoutes);

export { router };
