import { ICartRepository } from '../../../../domain/ports/repositories/ICartRepository';
import { Cart, CartItem } from '../../../../domain/entities/Cart';
import { CartModel } from '../models/CartModel';

const computeTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const toCart = (doc: InstanceType<typeof CartModel>): Cart => ({
  id: (doc._id as object).toString(),
  userId: doc.userId,
  items: doc.items as CartItem[],
  totalAmount: doc.totalAmount,
  updatedAt: doc.updatedAt,
});

export class MongoCartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    const doc = await CartModel.findOne({ userId });
    return doc ? toCart(doc) : null;
  }

  async upsert(userId: string, items: CartItem[]): Promise<Cart> {
    const totalAmount = computeTotal(items);
    const doc = await CartModel.findOneAndUpdate(
      { userId },
      { items, totalAmount },
      { new: true, upsert: true },
    );
    return toCart(doc!);
  }

  async clear(userId: string): Promise<void> {
    await CartModel.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0 },
    );
  }
}
