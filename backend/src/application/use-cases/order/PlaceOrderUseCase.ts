import { IOrderRepository } from '../../../domain/ports/repositories/IOrderRepository';
import { ICartRepository } from '../../../domain/ports/repositories/ICartRepository';
import { Order } from '../../../domain/entities/Order';
import { AppError } from '../../../shared/AppError';

interface PlaceOrderInput {
  userId: string;
  deliveryAddress: string;
  notes?: string;
}

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(input: PlaceOrderInput): Promise<Order> {
    const cart = await this.cartRepository.findByUserId(input.userId);
    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    const order = await this.orderRepository.create({
      userId: input.userId,
      items: cart.items.map((item) => ({
        foodItemId: item.foodItemId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: cart.totalAmount,
      deliveryAddress: input.deliveryAddress,
      notes: input.notes,
    });

    await this.cartRepository.clear(input.userId);
    return order;
  }
}
