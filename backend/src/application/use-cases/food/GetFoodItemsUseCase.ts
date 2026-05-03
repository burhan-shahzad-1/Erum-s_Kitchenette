import {
  IFoodItemRepository,
  FoodItemFilter,
} from '../../../domain/ports/repositories/IFoodItemRepository';
import { FoodItem } from '../../../domain/entities/FoodItem';

export class GetFoodItemsUseCase {
  constructor(private readonly foodItemRepository: IFoodItemRepository) {}

  async execute(filter?: FoodItemFilter): Promise<FoodItem[]> {
    return this.foodItemRepository.findAll(filter);
  }
}
