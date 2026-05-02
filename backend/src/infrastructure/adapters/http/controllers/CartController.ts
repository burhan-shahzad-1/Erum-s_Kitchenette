import { Request, Response, NextFunction } from 'express';
import { GetCartUseCase } from '../../../../application/use-cases/cart/GetCartUseCase';
import { AddToCartUseCase } from '../../../../application/use-cases/cart/AddToCartUseCase';
import { RemoveFromCartUseCase } from '../../../../application/use-cases/cart/RemoveFromCartUseCase';
import { ClearCartUseCase } from '../../../../application/use-cases/cart/ClearCartUseCase';
import { sendSuccess } from '../../../../shared/ApiResponse';

export class CartController {
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly addToCartUseCase: AddToCartUseCase,
    private readonly removeFromCartUseCase: RemoveFromCartUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
  ) {}

  getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.getCartUseCase.execute(req.user!.userId);
      sendSuccess(res, cart ?? { items: [], totalAmount: 0 });
    } catch (err) {
      next(err);
    }
  };

  addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.addToCartUseCase.execute({
        userId: req.user!.userId,
        foodItemId: req.body.foodItemId,
        quantity: req.body.quantity ?? 1,
      });
      sendSuccess(res, cart, 200, 'Item added to cart');
    } catch (err) {
      next(err);
    }
  };

  removeItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cart = await this.removeFromCartUseCase.execute(
        req.user!.userId,
        String(req.params.foodItemId),
      );
      sendSuccess(res, cart, 200, 'Item removed from cart');
    } catch (err) {
      next(err);
    }
  };

  clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.clearCartUseCase.execute(req.user!.userId);
      sendSuccess(res, null, 200, 'Cart cleared');
    } catch (err) {
      next(err);
    }
  };
}
