export interface CartItem {
  foodItemId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: Date;
}
