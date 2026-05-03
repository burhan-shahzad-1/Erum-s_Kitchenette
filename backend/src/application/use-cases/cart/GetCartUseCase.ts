import { ICartRepository } from '../../../domain/ports/repositories/ICartRepository';
import { Cart } from '../../../domain/entities/Cart';

export class GetCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<Cart | null> {
    return this.cartRepository.findByUserId(userId);
  }
}
