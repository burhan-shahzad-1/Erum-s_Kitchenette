import { Review, CreateReviewDTO } from '../../entities/Review';

export interface IReviewRepository {
  create(data: CreateReviewDTO): Promise<Review>;
  findByFoodItemId(foodItemId: string): Promise<Review[]>;
  findByUserId(userId: string): Promise<Review[]>;
  findByUserAndFoodItem(userId: string, foodItemId: string): Promise<Review | null>;
}
