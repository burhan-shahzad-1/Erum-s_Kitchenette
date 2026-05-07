import { Router } from 'express';
import { body } from 'express-validator';
import { FoodController } from '../controllers/FoodController';
import { ReviewController } from '../controllers/ReviewController';
import { CreateFoodItemUseCase } from '../../../../application/use-cases/food/CreateFoodItemUseCase';
import { GetFoodItemsUseCase } from '../../../../application/use-cases/food/GetFoodItemsUseCase';
import { GetFoodItemByIdUseCase } from '../../../../application/use-cases/food/GetFoodItemByIdUseCase';
import { UpdateFoodItemUseCase } from '../../../../application/use-cases/food/UpdateFoodItemUseCase';
import { DeleteFoodItemUseCase } from '../../../../application/use-cases/food/DeleteFoodItemUseCase';
import { CreateReviewUseCase } from '../../../../application/use-cases/review/CreateReviewUseCase';
import { GetReviewsUseCase } from '../../../../application/use-cases/review/GetReviewsUseCase';
import { MongoFoodItemRepository } from '../../db/repositories/MongoFoodItemRepository';
import { MongoReviewRepository } from '../../db/repositories/MongoReviewRepository';
import { MongoUserRepository } from '../../db/repositories/MongoUserRepository';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

const foodRepo = new MongoFoodItemRepository();
const reviewRepo = new MongoReviewRepository();
const userRepo = new MongoUserRepository();

const foodController = new FoodController(
  new CreateFoodItemUseCase(foodRepo),
  new GetFoodItemsUseCase(foodRepo),
  new GetFoodItemByIdUseCase(foodRepo),
  new UpdateFoodItemUseCase(foodRepo),
  new DeleteFoodItemUseCase(foodRepo),
);

const reviewController = new ReviewController(
  new CreateReviewUseCase(reviewRepo, foodRepo),
  new GetReviewsUseCase(reviewRepo),
  userRepo,
);

const foodRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(['appetizer', 'main', 'dessert', 'beverage', 'snack', 'other'])
    .withMessage('Invalid category'),
];

const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
];

router.get('/', foodController.getAll);
router.get('/:id', foodController.getOne);
router.post('/', authenticate, authorize('owner', 'admin'), foodRules, validate, foodController.create);
router.put('/:id', authenticate, authorize('owner', 'admin'), foodController.update);
router.delete('/:id', authenticate, authorize('owner', 'admin'), foodController.delete);

router.get('/:foodItemId/reviews', reviewController.getByFoodItem);
router.post('/:foodItemId/reviews', authenticate, authorize('customer'), reviewRules, validate, reviewController.create);

export default router;
