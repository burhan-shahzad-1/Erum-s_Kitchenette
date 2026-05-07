import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { AppError } from '../../../shared/AppError';

export class ChangePasswordUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashed);
  }
}
