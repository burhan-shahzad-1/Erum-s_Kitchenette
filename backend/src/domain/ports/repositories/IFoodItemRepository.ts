import { FoodItem, CreateFoodItemDTO, UpdateFoodItemDTO } from '../../entities/FoodItem';

export interface FoodItemFilter {
  category?: string;
  search?: string;
  ownerId?: string;
  isAvailable?: boolean;
}

export interface IFoodItemRepository {
  create(data: CreateFoodItemDTO): Promise<FoodItem>;
  findById(id: string): Promise<FoodItem | null>;
  findAll(filter?: FoodItemFilter): Promise<FoodItem[]>;
  update(id: string, data: UpdateFoodItemDTO): Promise<FoodItem | null>;
  delete(id: string): Promise<boolean>;
}
