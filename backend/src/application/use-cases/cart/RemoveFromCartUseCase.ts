import { ICartRepository } from '../../../domain/ports/repositories/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';
import { AppError } from '../../../shared/AppError';

export class RemoveFromCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string, foodItemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) throw new AppError('Cart is empty', 404);

    const updatedItems = cart.items.filter(
      (item) => item.foodItemId !== foodItemId,
    );
    return this.cartRepository.upsert(userId, updatedItems);
  }
}
