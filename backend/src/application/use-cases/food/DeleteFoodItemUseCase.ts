import { IFoodItemRepository } from '../../../domain/ports/repositories/IFoodItemRepository';
import { AppError } from '../../../shared/AppError';

interface DeleteInput {
  id: string;
  requesterId: string;
  requesterRole: string;
}

export class DeleteFoodItemUseCase {
  constructor(private readonly foodItemRepository: IFoodItemRepository) {}

  async execute(input: DeleteInput): Promise<void> {
    const item = await this.foodItemRepository.findById(input.id);
    if (!item) throw new AppError('Food item not found', 404);

    if (
      input.requesterRole !== 'admin' &&
      item.ownerId !== input.requesterId
    ) {
      throw new AppError('Not authorised to delete this item', 403);
    }

    await this.foodItemRepository.delete(input.id);
  }
}
