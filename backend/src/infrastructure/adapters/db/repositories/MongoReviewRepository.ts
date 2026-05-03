import { IReviewRepository } from '../../../../domain/ports/repositories/IReviewRepository';
import { Review, CreateReviewDTO } from '../../../../domain/entities/Review';
import { ReviewModel } from '../models/ReviewModel';

const toReview = (doc: InstanceType<typeof ReviewModel>): Review => ({
  id: (doc._id as object).toString(),
  userId: doc.userId,
  foodItemId: doc.foodItemId,
  rating: doc.rating,
  comment: doc.comment,
  createdAt: doc.createdAt,
});

export class MongoReviewRepository implements IReviewRepository {
  async create(data: CreateReviewDTO): Promise<Review> {
    const doc = await ReviewModel.create(data);
    return toReview(doc);
  }

  async findByFoodItemId(foodItemId: string): Promise<Review[]> {
    const docs = await ReviewModel.find({ foodItemId }).sort({ createdAt: -1 });
    return docs.map(toReview);
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const docs = await ReviewModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(toReview);
  }

  async findByUserAndFoodItem(
    userId: string,
    foodItemId: string,
  ): Promise<Review | null> {
    const doc = await ReviewModel.findOne({ userId, foodItemId });
    return doc ? toReview(doc) : null;
  }
}
