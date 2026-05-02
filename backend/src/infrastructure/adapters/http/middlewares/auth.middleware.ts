import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from '../../../services/JwtAuthService';
import { AppError } from '../../../../shared/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}

const authService = new JwtAuthService();

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (!payload) throw new AppError('Invalid or expired token', 401);

  req.user = payload;
  next();
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
    next();
  };
