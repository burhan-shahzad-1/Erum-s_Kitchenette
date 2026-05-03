import { IReviewRepository } from '../../../domain/ports/repositories/IReviewRepository';
import { Review } from '../../../domain/entities/Review';

export class GetReviewsUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(foodItemId: string): Promise<Review[]> {
    return this.reviewRepository.findByFoodItemId(foodItemId);
  }
}
