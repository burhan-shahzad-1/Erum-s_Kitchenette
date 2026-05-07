import { IUserRepository } from '../../../../domain/ports/repositories/IUserRepository';
import { User, CreateUserDTO } from '../../../../domain/entities/User';
import { UserModel } from '../models/UserModel';

const toUser = (doc: InstanceType<typeof UserModel>): User => ({
  id: (doc._id as object).toString(),
  name: doc.name,
  email: doc.email,
  password: doc.password,
  role: doc.role,
  phone: doc.phone,
  address: doc.address,
  createdAt: doc.createdAt,
});

export class MongoUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const doc = await UserModel.create(data);
    return toUser(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? toUser(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? toUser(doc) : null;
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find({ role: 'customer' }).sort({ createdAt: -1 });
    return docs.map(toUser);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { password: hashedPassword });
  }
}
