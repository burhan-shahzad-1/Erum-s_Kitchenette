export interface Review {
  id: string;
  userId: string;
  foodItemId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export type CreateReviewDTO = Omit<Review, 'id' | 'createdAt'>;
