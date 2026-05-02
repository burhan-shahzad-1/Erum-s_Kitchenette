import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { IAuthService } from '../../../domain/ports/services/IAuthService';
import { PublicUser } from '../../../domain/entities/User';
import { AppError } from '../../../shared/AppError';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  token: string;
  user: PublicUser;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await this.authService.comparePassword(
      input.password,
      user.password,
    );
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    const token = this.authService.generateToken(user.id, user.role);
    const { password: _, ...publicUser } = user;
    return { token, user: publicUser };
  }
}
