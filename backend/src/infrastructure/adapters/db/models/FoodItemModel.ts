import mongoose, { Schema, Document } from 'mongoose';
import { FoodItem } from '../../../../domain/entities/FoodItem';

export type FoodItemDocument = Omit<FoodItem, 'id'> & Document;

const foodItemSchema = new Schema<FoodItemDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['appetizer', 'main', 'dessert', 'beverage', 'snack', 'other'],
      required: true,
    },
    imageUrl: { type: String, trim: true },
    isAvailable: { type: Boolean, default: true },
    ownerId: { type: String, required: true },
  },
  { timestamps: true },
);

foodItemSchema.index({ title: 'text', description: 'text' });

export const FoodItemModel = mongoose.model<FoodItemDocument>(
  'FoodItem',
  foodItemSchema,
);
