import { Request, Response, NextFunction } from 'express';
import { CreateFoodItemUseCase } from '../../../../application/use-cases/food/CreateFoodItemUseCase';
import { GetFoodItemsUseCase } from '../../../../application/use-cases/food/GetFoodItemsUseCase';
import { GetFoodItemByIdUseCase } from '../../../../application/use-cases/food/GetFoodItemByIdUseCase';
import { UpdateFoodItemUseCase } from '../../../../application/use-cases/food/UpdateFoodItemUseCase';
import { DeleteFoodItemUseCase } from '../../../../application/use-cases/food/DeleteFoodItemUseCase';
import { sendSuccess } from '../../../../shared/ApiResponse';

export class FoodController {
  constructor(
    private readonly createFoodItem: CreateFoodItemUseCase,
    private readonly getFoodItems: GetFoodItemsUseCase,
    private readonly getFoodItemById: GetFoodItemByIdUseCase,
    private readonly updateFoodItem: UpdateFoodItemUseCase,
    private readonly deleteFoodItem: DeleteFoodItemUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.createFoodItem.execute({
        ...req.body,
        ownerId: req.user!.userId,
      });
      sendSuccess(res, item, 201, 'Food item created');
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = req.query['category'] as string | undefined;
      const search = req.query['search'] as string | undefined;
      const ownerId = req.query['ownerId'] as string | undefined;
      const items = await this.getFoodItems.execute({ category, search, ownerId, isAvailable: true });
      sendSuccess(res, items);
    } catch (err) {
      next(err);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.getFoodItemById.execute(String(req.params.id));
      sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const item = await this.updateFoodItem.execute({
        id: String(req.params.id),
        requesterId: req.user!.userId,
        requesterRole: req.user!.role,
        data: req.body,
      });
      sendSuccess(res, item, 200, 'Food item updated');
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.deleteFoodItem.execute({
        id: String(req.params.id),
        requesterId: req.user!.userId,
        requesterRole: req.user!.role,
      });
      sendSuccess(res, null, 200, 'Food item deleted');
    } catch (err) {
      next(err);
    }
  };
}
