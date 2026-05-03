import { Cart, CartItem } from '../../entities/Cart';

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  upsert(userId: string, items: CartItem[]): Promise<Cart>;
  clear(userId: string): Promise<void>;
}
