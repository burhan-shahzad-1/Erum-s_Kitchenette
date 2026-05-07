import { IOrderRepository } from '../../../domain/ports/repositories/IOrderRepository';
import { ICartRepository } from '../../../domain/ports/repositories/ICartRepository';
import { Order } from '../../../domain/entities/Order';
import { AppError } from '../../../shared/AppError';

export interface OrderItemInput {
  foodItemId: string;
  title: string;
  price: number;
  quantity: number;
}

interface PlaceOrderInput {
  userId: string;
  deliveryAddress: string;
  notes?: string;
  /** Items sent directly from the frontend cart. If provided, server cart is skipped. */
  items?: OrderItemInput[];
}

export class PlaceOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(input: PlaceOrderInput): Promise<Order> {
    let orderItems: OrderItemInput[];
    let totalAmount: number;

    if (input.items && input.items.length > 0) {
      // Use items sent directly from the frontend (localStorage cart)
      orderItems = input.items;
      totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    } else {
      // Fall back to server-side cart
      const cart = await this.cartRepository.findByUserId(input.userId);
      if (!cart || cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
      }
      orderItems = cart.items.map((item) => ({
        foodItemId: item.foodItemId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      totalAmount = cart.totalAmount;
    }

    const order = await this.orderRepository.create({
      userId: input.userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: input.deliveryAddress,
      notes: input.notes,
    });

    // Clear server cart regardless of which path was used
    await this.cartRepository.clear(input.userId);
    return order;
  }
}
