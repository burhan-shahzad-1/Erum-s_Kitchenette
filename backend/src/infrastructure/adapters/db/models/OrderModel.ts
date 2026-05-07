import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '../../../../domain/entities/Order';

export type OrderDocument = Omit<Order, 'id'> & Document;

const orderItemSchema = new Schema(
  {
    foodItemId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    deliveryAddress: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model<OrderDocument>('Order', orderSchema);
