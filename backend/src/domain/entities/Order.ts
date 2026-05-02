export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderItem {
  foodItemId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOrderDTO = Pick<
  Order,
  'userId' | 'items' | 'totalAmount' | 'deliveryAddress' | 'notes'
>;
