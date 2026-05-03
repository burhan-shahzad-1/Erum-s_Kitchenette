import { IOrderRepository } from '../../../../domain/ports/repositories/IOrderRepository';
import { Order, CreateOrderDTO, OrderStatus } from '../../../../domain/entities/Order';
import { OrderModel } from '../models/OrderModel';

const toOrder = (doc: InstanceType<typeof OrderModel>): Order => ({
  id: (doc._id as object).toString(),
  userId: doc.userId,
  items: doc.items as Order['items'],
  totalAmount: doc.totalAmount,
  status: doc.status,
  paymentStatus: doc.paymentStatus,
  deliveryAddress: doc.deliveryAddress,
  notes: doc.notes,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoOrderRepository implements IOrderRepository {
  async create(data: CreateOrderDTO): Promise<Order> {
    const doc = await OrderModel.create(data);
    return toOrder(doc);
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await OrderModel.findById(id);
    return doc ? toOrder(doc) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(toOrder);
  }

  async findAll(): Promise<Order[]> {
    const docs = await OrderModel.find().sort({ createdAt: -1 });
    return docs.map(toOrder);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const doc = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return doc ? toOrder(doc) : null;
  }
}
