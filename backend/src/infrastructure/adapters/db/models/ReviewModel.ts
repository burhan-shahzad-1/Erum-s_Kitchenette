import mongoose, { Schema, Document } from 'mongoose';
import { Review } from '../../../../domain/entities/Review';

export type ReviewDocument = Omit<Review, 'id'> & Document;

const reviewSchema = new Schema<ReviewDocument>(
  {
    userId: { type: String, required: true },
    foodItemId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

reviewSchema.index({ userId: 1, foodItemId: 1 }, { unique: true });

export const ReviewModel = mongoose.model<ReviewDocument>('Review', reviewSchema);
