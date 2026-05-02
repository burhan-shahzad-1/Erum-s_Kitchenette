import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { IAuthService } from '../../../domain/ports/services/IAuthService';
import { PublicUser, UserRole } from '../../../domain/entities/User';
import { AppError } from '../../../shared/AppError';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  address?: string;
}

interface RegisterOutput {
  token: string;
  user: PublicUser;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError('Email already in use', 409);

    const hashedPassword = await this.authService.hashPassword(input.password);
    const user = await this.userRepository.create({
      ...input,
      password: hashedPassword,
      role: input.role ?? 'customer',
    });

    const token = this.authService.generateToken(user.id, user.role);
    const { password: _, ...publicUser } = user;
    return { token, user: publicUser };
  }
}
