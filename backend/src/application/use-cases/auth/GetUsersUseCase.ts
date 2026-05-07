import { IUserRepository } from '../../../domain/ports/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findAll();
    return users.map(({ password: _pw, ...rest }) => rest);
  }
}
