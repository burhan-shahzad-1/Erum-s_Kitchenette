import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { RegisterUseCase } from '../../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../../application/use-cases/auth/LoginUseCase';
import { GetMeUseCase } from '../../../../application/use-cases/auth/GetMeUseCase';
import { MongoUserRepository } from '../../db/repositories/MongoUserRepository';
import { JwtAuthService } from '../../../services/JwtAuthService';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

const userRepo = new MongoUserRepository();
const authService = new JwtAuthService();
const controller = new AuthController(
  new RegisterUseCase(userRepo, authService),
  new LoginUseCase(userRepo, authService),
  new GetMeUseCase(userRepo),
);

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'owner']).withMessage('Role must be customer or owner'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerRules, validate, controller.register);
router.post('/login', loginRules, validate, controller.login);
router.get('/me', authenticate, controller.getMe);

export default router;
