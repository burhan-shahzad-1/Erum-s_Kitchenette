import { IFoodItemRepository } from '../../../domain/ports/repositories/IFoodItemRepository';
import { FoodItem, UpdateFoodItemDTO } from '../../../domain/entities/FoodItem';
import { AppError } from '../../../shared/AppError';

interface UpdateInput {
  id: string;
  requesterId: string;
  requesterRole: string;
  data: UpdateFoodItemDTO;
}

export class UpdateFoodItemUseCase {
  constructor(private readonly foodItemRepository: IFoodItemRepository) {}

  async execute(input: UpdateInput): Promise<FoodItem> {
    const item = await this.foodItemRepository.findById(input.id);
    if (!item) throw new AppError('Food item not found', 404);

    if (
      input.requesterRole !== 'admin' &&
      item.ownerId !== input.requesterId
    ) {
      throw new AppError('Not authorised to update this item', 403);
    }

    const updated = await this.foodItemRepository.update(input.id, input.data);
    if (!updated) throw new AppError('Food item not found', 404);
    return updated;
  }
}
