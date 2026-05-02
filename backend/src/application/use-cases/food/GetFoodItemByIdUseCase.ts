import { IFoodItemRepository } from '../../../domain/ports/repositories/IFoodItemRepository';
import { FoodItem } from '../../../domain/entities/FoodItem';
import { AppError } from '../../../shared/AppError';

export class GetFoodItemByIdUseCase {
  constructor(private readonly foodItemRepository: IFoodItemRepository) {}

  async execute(id: string): Promise<FoodItem> {
    const item = await this.foodItemRepository.findById(id);
    if (!item) throw new AppError('Food item not found', 404);
    return item;
  }
}
