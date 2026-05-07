import mongoose, { Schema, Document } from 'mongoose';

export interface DeliveryAreaDocument extends Document {
  name: string;
  minOrder: number;
  deliveryCharge: number;
  isActive: boolean;
}

const deliveryAreaSchema = new Schema<DeliveryAreaDocument>(
  {
    name: { type: String, required: true, trim: true },
    minOrder: { type: Number, required: true, min: 0, default: 0 },
    deliveryCharge: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const DeliveryAreaModel = mongoose.model<DeliveryAreaDocument>(
  'DeliveryArea',
  deliveryAreaSchema,
);
