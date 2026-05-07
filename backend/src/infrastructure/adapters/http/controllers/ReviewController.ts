import { Request, Response, NextFunction } from 'express';
import { CreateReviewUseCase } from '../../../../application/use-cases/review/CreateReviewUseCase';
import { GetReviewsUseCase } from '../../../../application/use-cases/review/GetReviewsUseCase';
import { IUserRepository } from '../../../../domain/ports/repositories/IUserRepository';
import { sendSuccess } from '../../../../shared/ApiResponse';

export class ReviewController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getReviewsUseCase: GetReviewsUseCase,
    private readonly userRepository: IUserRepository,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await this.createReviewUseCase.execute({
        userId: req.user!.userId,
        foodItemId: String(req.params.foodItemId),
        rating: req.body.rating,
        comment: req.body.comment,
      });
      sendSuccess(res, review, 201, 'Review submitted');
    } catch (err) {
      next(err);
    }
  };

  getByFoodItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reviews = await this.getReviewsUseCase.execute(String(req.params.foodItemId));

      // Enrich each review with the reviewer's name
      const enriched = await Promise.all(
        reviews.map(async (r) => {
          const user = await this.userRepository.findById(r.userId).catch(() => null);
          return { ...r, userName: user?.name ?? null };
        }),
      );

      sendSuccess(res, enriched);
    } catch (err) {
      next(err);
    }
  };
}
