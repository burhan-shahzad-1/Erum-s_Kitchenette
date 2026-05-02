export type FoodCategory =
  | 'appetizer'
  | 'main'
  | 'dessert'
  | 'beverage'
  | 'snack'
  | 'other';

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: FoodCategory;
  imageUrl?: string;
  isAvailable: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateFoodItemDTO = Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFoodItemDTO = Partial<
  Omit<FoodItem, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>
>;
