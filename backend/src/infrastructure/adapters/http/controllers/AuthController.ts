import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../../application/use-cases/auth/LoginUseCase';
import { GetMeUseCase } from '../../../../application/use-cases/auth/GetMeUseCase';
import { GetUsersUseCase } from '../../../../application/use-cases/auth/GetUsersUseCase';
import { ChangePasswordUseCase } from '../../../../application/use-cases/auth/ChangePasswordUseCase';
import { sendSuccess } from '../../../../shared/ApiResponse';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUseCase.execute(req.body);
      sendSuccess(res, result, 201, 'Registration successful');
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUseCase.execute(req.body);
      sendSuccess(res, result, 200, 'Login successful');
    } catch (err) {
      next(err);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.getMeUseCase.execute(req.user!.userId);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  };

  getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.getUsersUseCase.execute();
      sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      await this.changePasswordUseCase.execute(req.user!.userId, currentPassword, newPassword);
      sendSuccess(res, null, 200, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  };
}
