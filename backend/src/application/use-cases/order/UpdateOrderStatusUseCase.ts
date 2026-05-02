import { IOrderRepository } from '../../../domain/ports/repositories/IOrderRepository';
import { Order, OrderStatus } from '../../../domain/entities/Order';
import { AppError } from '../../../shared/AppError';

interface UpdateStatusInput {
  orderId: string;
  status: OrderStatus;
  requesterRole: string;
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: UpdateStatusInput): Promise<Order> {
    if (input.requesterRole === 'customer') {
      throw new AppError('Not authorised to update order status', 403);
    }

    const order = await this.orderRepository.updateStatus(
      input.orderId,
      input.status,
    );
    if (!order) throw new AppError('Order not found', 404);
    return order;
  }
}
