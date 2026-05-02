import { IFoodItemRepository } from '../../../domain/ports/repositories/IFoodItemRepository';
import { FoodItem, CreateFoodItemDTO } from '../../../domain/entities/FoodItem';

export class CreateFoodItemUseCase {
  constructor(private readonly foodItemRepository: IFoodItemRepository) {}

  async execute(data: CreateFoodItemDTO): Promise<FoodItem> {
    return this.foodItemRepository.create(data);
  }
}
