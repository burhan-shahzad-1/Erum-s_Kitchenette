import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { RegisterUseCase } from '../../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../../application/use-cases/auth/LoginUseCase';
import { GetMeUseCase } from '../../../../application/use-cases/auth/GetMeUseCase';
import { GetUsersUseCase } from '../../../../application/use-cases/auth/GetUsersUseCase';
import { ChangePasswordUseCase } from '../../../../application/use-cases/auth/ChangePasswordUseCase';
import { MongoUserRepository } from '../../db/repositories/MongoUserRepository';
import { JwtAuthService } from '../../../services/JwtAuthService';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

const userRepo = new MongoUserRepository();
const authService = new JwtAuthService();
const controller = new AuthController(
  new RegisterUseCase(userRepo, authService),
  new LoginUseCase(userRepo, authService),
  new GetMeUseCase(userRepo),
  new GetUsersUseCase(userRepo),
  new ChangePasswordUseCase(userRepo),
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

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

router.post('/register', registerRules, validate, controller.register);
router.post('/login', loginRules, validate, controller.login);
router.get('/me', authenticate, controller.getMe);
router.get('/users', authenticate, authorize('owner', 'admin'), controller.getUsers);
router.put('/change-password', authenticate, changePasswordRules, validate, controller.changePassword);

export default router;
