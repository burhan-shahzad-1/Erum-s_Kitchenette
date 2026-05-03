import { IReviewRepository } from '../../../domain/ports/repositories/IReviewRepository';
import { IFoodItemRepository } from '../../../domain/ports/repositories/IFoodItemRepository';
import { Review } from '../../../domain/entities/Review';
import { AppError } from '../../../shared/AppError';

interface CreateReviewInput {
  userId: string;
  foodItemId: string;
  rating: number;
  comment?: string;
}

export class CreateReviewUseCase {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly foodItemRepository: IFoodItemRepository,
  ) {}

  async execute(input: CreateReviewInput): Promise<Review> {
    const foodItem = await this.foodItemRepository.findById(input.foodItemId);
    if (!foodItem) throw new AppError('Food item not found', 404);

    const existing = await this.reviewRepository.findByUserAndFoodItem(
      input.userId,
      input.foodItemId,
    );
    if (existing) throw new AppError('You have already reviewed this item', 409);

    return this.reviewRepository.create(input);
  }
}
