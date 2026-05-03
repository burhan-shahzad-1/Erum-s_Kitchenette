export type UserRole = 'customer' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export type CreateUserDTO = Omit<User, 'id' | 'createdAt'>;
export type PublicUser = Omit<User, 'password'>;
