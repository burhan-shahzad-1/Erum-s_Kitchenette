import { IOrderRepository } from '../../../domain/ports/repositories/IOrderRepository';
import { Order } from '../../../domain/entities/Order';
import { AppError } from '../../../shared/AppError';

interface GetOrderByIdInput {
  orderId: string;
  requesterId: string;
  requesterRole: string;
}

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: GetOrderByIdInput): Promise<Order> {
    const order = await this.orderRepository.findById(input.orderId);
    if (!order) throw new AppError('Order not found', 404);

    if (
      input.requesterRole === 'customer' &&
      order.userId !== input.requesterId
    ) {
      throw new AppError('Not authorised to view this order', 403);
    }

    return order;
  }
}
