import { Request, Response, NextFunction } from 'express';
import { DeliveryAreaModel } from '../../db/models/DeliveryAreaModel';
import { sendSuccess } from '../../../../shared/ApiResponse';
import { AppError } from '../../../../shared/AppError';

export class DeliveryAreaController {
  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const areas = await DeliveryAreaModel.find().sort({ createdAt: 1 });
      sendSuccess(res, areas.map(this.toDTO));
    } catch (err) { next(err); }
  };

  getActive = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const areas = await DeliveryAreaModel.find({ isActive: true }).sort({ createdAt: 1 });
      sendSuccess(res, areas.map(this.toDTO));
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const area = await DeliveryAreaModel.create(req.body);
      sendSuccess(res, this.toDTO(area), 201, 'Delivery area created');
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const area = await DeliveryAreaModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );
      if (!area) throw new AppError('Delivery area not found', 404);
      sendSuccess(res, this.toDTO(area));
    } catch (err) { next(err); }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const area = await DeliveryAreaModel.findByIdAndDelete(req.params.id);
      if (!area) throw new AppError('Delivery area not found', 404);
      sendSuccess(res, null, 200, 'Delivery area deleted');
    } catch (err) { next(err); }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDTO(doc: any) {
    return {
      id: doc._id.toString(),
      name: doc.name,
      minOrder: doc.minOrder,
      deliveryCharge: doc.deliveryCharge,
      isActive: doc.isActive,
    };
  }
}
