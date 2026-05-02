import { ICartRepository } from '../../../domain/ports/repositories/ICartRepository';
import { IFoodItemRepository } from '../../../domain/ports/repositories/IFoodItemRepository';
import { Cart, CartItem } from '../../../domain/entities/Cart';
import { AppError } from '../../../shared/AppError';

interface AddToCartInput {
  userId: string;
  foodItemId: string;
  quantity: number;
}

export class AddToCartUseCase {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly foodItemRepository: IFoodItemRepository,
  ) {}

  async execute(input: AddToCartInput): Promise<Cart> {
    const foodItem = await this.foodItemRepository.findById(input.foodItemId);
    if (!foodItem) throw new AppError('Food item not found', 404);
    if (!foodItem.isAvailable) throw new AppError('Food item is not available', 400);

    const cart = await this.cartRepository.findByUserId(input.userId);
    const existingItems: CartItem[] = cart?.items ?? [];

    const existingIndex = existingItems.findIndex(
      (i) => i.foodItemId === input.foodItemId,
    );

    let updatedItems: CartItem[];
    if (existingIndex >= 0) {
      updatedItems = existingItems.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + input.quantity }
          : item,
      );
    } else {
      updatedItems = [
        ...existingItems,
        {
          foodItemId: foodItem.id,
          title: foodItem.title,
          price: foodItem.price,
          quantity: input.quantity,
        },
      ];
    }

    return this.cartRepository.upsert(input.userId, updatedItems);
  }
}
