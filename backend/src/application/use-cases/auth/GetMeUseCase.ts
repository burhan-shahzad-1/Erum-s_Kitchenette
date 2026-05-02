import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { PublicUser } from '../../../domain/entities/User';
import { AppError } from '../../../shared/AppError';

export class GetMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<PublicUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const { password: _, ...publicUser } = user;
    return publicUser;
  }
}
