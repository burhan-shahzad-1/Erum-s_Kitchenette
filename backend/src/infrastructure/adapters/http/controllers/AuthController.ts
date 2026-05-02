import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../../../application/use-cases/auth/RegisterUseCase';
import { LoginUseCase } from '../../../../application/use-cases/auth/LoginUseCase';
import { GetMeUseCase } from '../../../../application/use-cases/auth/GetMeUseCase';
import { sendSuccess } from '../../../../shared/ApiResponse';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
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
}
