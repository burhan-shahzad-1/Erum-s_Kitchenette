import { Router } from 'express';
import authRoutes from './auth.routes';
import foodRoutes from './food.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/food', foodRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export { router };
