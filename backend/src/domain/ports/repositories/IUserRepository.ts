import { User, CreateUserDTO } from '../../entities/User';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
