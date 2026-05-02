import {
  IFoodItemRepository,
  FoodItemFilter,
} from '../../../../domain/ports/repositories/IFoodItemRepository';
import {
  FoodItem,
  CreateFoodItemDTO,
  UpdateFoodItemDTO,
} from '../../../../domain/entities/FoodItem';
import { FoodItemModel } from '../models/FoodItemModel';

const toFoodItem = (doc: InstanceType<typeof FoodItemModel>): FoodItem => ({
  id: (doc._id as object).toString(),
  title: doc.title,
  description: doc.description,
  price: doc.price,
  category: doc.category,
  imageUrl: doc.imageUrl,
  isAvailable: doc.isAvailable,
  ownerId: doc.ownerId,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class MongoFoodItemRepository implements IFoodItemRepository {
  async create(data: CreateFoodItemDTO): Promise<FoodItem> {
    const doc = await FoodItemModel.create(data);
    return toFoodItem(doc);
  }

  async findById(id: string): Promise<FoodItem | null> {
    const doc = await FoodItemModel.findById(id);
    return doc ? toFoodItem(doc) : null;
  }

  async findAll(filter?: FoodItemFilter): Promise<FoodItem[]> {
    const query: Record<string, unknown> = {};

    if (filter?.category) query['category'] = filter.category;
    if (filter?.ownerId) query['ownerId'] = filter.ownerId;
    if (filter?.isAvailable !== undefined) query['isAvailable'] = filter.isAvailable;
    if (filter?.search) {
      query['$text'] = { $search: filter.search };
    }

    const docs = await FoodItemModel.find(query).sort({ createdAt: -1 });
    return docs.map(toFoodItem);
  }

  async update(id: string, data: UpdateFoodItemDTO): Promise<FoodItem | null> {
    const doc = await FoodItemModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? toFoodItem(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await FoodItemModel.findByIdAndDelete(id);
    return result !== null;
  }
}
