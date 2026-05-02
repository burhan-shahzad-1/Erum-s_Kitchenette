import mongoose, { Schema, Document } from 'mongoose';
import { Cart } from '../../../../domain/entities/Cart';

export type CartDocument = Omit<Cart, 'id'> & Document;

const cartItemSchema = new Schema(
  {
    foodItemId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const cartSchema = new Schema<CartDocument>(
  {
    userId: { type: String, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: 'updatedAt' } },
);

export const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);
