import { IOrderRepository } from '../../../domain/ports/repositories/IOrderRepository';
import { Order } from '../../../domain/entities/Order';

interface GetOrdersInput {
  userId: string;
  role: string;
}

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: GetOrdersInput): Promise<Order[]> {
    if (input.role === 'owner' || input.role === 'admin') {
      return this.orderRepository.findAll();
    }
    return this.orderRepository.findByUserId(input.userId);
  }
}
