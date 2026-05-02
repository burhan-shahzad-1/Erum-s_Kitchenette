import { ICartRepository } from '../../../domain/ports/repositories/ICartRepository';

export class ClearCartUseCase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: string): Promise<void> {
    await this.cartRepository.clear(userId);
  }
}
