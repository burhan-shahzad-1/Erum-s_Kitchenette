import { Request, Response, NextFunction } from 'express';
import { PlaceOrderUseCase } from '../../../../application/use-cases/order/PlaceOrderUseCase';
import { GetOrdersUseCase } from '../../../../application/use-cases/order/GetOrdersUseCase';
import { GetOrderByIdUseCase } from '../../../../application/use-cases/order/GetOrderByIdUseCase';
import { UpdateOrderStatusUseCase } from '../../../../application/use-cases/order/UpdateOrderStatusUseCase';
import { OrderStatus } from '../../../../domain/entities/Order';
import { sendSuccess } from '../../../../shared/ApiResponse';

export class OrderController {
  constructor(
    private readonly placeOrderUseCase: PlaceOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  placeOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.placeOrderUseCase.execute({
        userId: req.user!.userId,
        deliveryAddress: req.body.deliveryAddress,
        notes: req.body.notes,
        items: req.body.items,
      });
      sendSuccess(res, order, 201, 'Order placed successfully');
    } catch (err) {
      next(err);
    }
  };

  getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.getOrdersUseCase.execute({
        userId: req.user!.userId,
        role: req.user!.role,
      });
      sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  };

  getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.getOrderByIdUseCase.execute({
        orderId: String(req.params.id),
        requesterId: req.user!.userId,
        requesterRole: req.user!.role,
      });
      sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.updateOrderStatusUseCase.execute({
        orderId: String(req.params.id),
        status: req.body.status as OrderStatus,
        requesterRole: req.user!.role,
      });
      sendSuccess(res, order, 200, 'Order status updated');
    } catch (err) {
      next(err);
    }
  };
}
