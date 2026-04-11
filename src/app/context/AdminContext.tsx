import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ADMIN_CREDENTIALS, normalizeEmail, STORAGE_KEYS } from '../lib/authConfig';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: 'active' | 'hidden';
  orderCount?: number;
  revenue?: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'rejected';
  timestamp: string;
  deliveryAddress: string;
  paymentMethod: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  joinDate: string;
  notes?: string;
}

interface DeliveryArea {
  id: string;
  name: string;
  minOrder: number;
  deliveryCharge: number;
  isActive: boolean;
}

interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  activeDeliveries: number;
  newCustomers: number;
}

interface AdminContextType {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  deliveryAreas: DeliveryArea[];
  dashboardStats: DashboardStats;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addCustomerNote: (customerId: string, note: string) => void;
  updateDeliveryArea: (id: string, updates: Partial<DeliveryArea>) => void;
  addDeliveryArea: (area: Omit<DeliveryArea, 'id'>) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken',
    price: 450,
    category: 'Main Dishes',
    image: 'https://images.unsplash.com/photo-1563379091339-03b847f511e0',
    status: 'active',
    orderCount: 145,
    revenue: 65250,
  },
  {
    id: '2',
    name: 'Beef Nihari',
    description: 'Slow-cooked beef in rich spicy gravy',
    price: 550,
    category: 'Main Dishes',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975',
    status: 'active',
    orderCount: 98,
    revenue: 53900,
  },
  {
    id: '3',
    name: 'Gulab Jamun',
    description: 'Sweet milk-solid dumplings in sugar syrup',
    price: 180,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564121-6d2ea0a4c41d',
    status: 'active',
    orderCount: 87,
    revenue: 15660,
  },
];

const mockOrders: Order[] = [
  {
    id: 'ORD-2026-1001',
    customerId: 'C001',
    customerName: 'Fatima Ahmed',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 450 },
      { name: 'Raita', quantity: 1, price: 80 },
    ],
    total: 980,
    status: 'pending',
    timestamp: new Date().toISOString(),
    deliveryAddress: 'House 45, Street 12, Johar Town, Lahore',
    paymentMethod: 'Cash on Delivery',
  },
  {
    id: 'ORD-2026-1002',
    customerId: 'C002',
    customerName: 'Ali Hassan',
    items: [
      { name: 'Beef Nihari', quantity: 1, price: 550 },
      { name: 'Naan', quantity: 4, price: 30 },
    ],
    total: 670,
    status: 'preparing',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    deliveryAddress: 'Flat 203, DHA Phase 5, Lahore',
    paymentMethod: 'Credit Card',
  },
];

const mockCustomers: Customer[] = [
  {
    id: 'C001',
    name: 'Fatima Ahmed',
    email: 'fatima.ahmed@example.com',
    phone: '+92 300 1234567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    totalOrders: 12,
    joinDate: '2025-01-15',
  },
  {
    id: 'C002',
    name: 'Ali Hassan',
    email: 'ali.hassan@example.com',
    phone: '+92 321 9876543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    totalOrders: 8,
    joinDate: '2025-02-20',
  },
];

const mockDeliveryAreas: DeliveryArea[] = [
  { id: '1', name: 'Johar Town', minOrder: 500, deliveryCharge: 100, isActive: true },
  { id: '2', name: 'DHA Phase 5', minOrder: 700, deliveryCharge: 150, isActive: true },
  { id: '3', name: 'Gulberg', minOrder: 600, deliveryCharge: 120, isActive: true },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(mockDeliveryAreas);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const dashboardStats: DashboardStats = {
    ordersToday: orders.filter(o => {
      const orderDate = new Date(o.timestamp);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).length,
    revenueToday: orders
      .filter(o => {
        const orderDate = new Date(o.timestamp);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString() && o.status !== 'rejected';
      })
      .reduce((sum, o) => sum + o.total, 0),
    activeDeliveries: orders.filter(o => o.status === 'out-for-delivery').length,
    newCustomers: customers.filter(c => {
      const joinDate = new Date(c.joinDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return joinDate >= weekAgo;
    }).length,
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: `P${Date.now()}`,
      orderCount: 0,
      revenue: 0,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => (o.id === orderId ? { ...o, status } : o)));
  };

  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers(customers.map(c => (c.id === customerId ? { ...c, notes: note } : c)));
  };

  const updateDeliveryArea = (id: string, updates: Partial<DeliveryArea>) => {
    setDeliveryAreas(deliveryAreas.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addDeliveryArea = (area: Omit<DeliveryArea, 'id'>) => {
    const newArea = { ...area, id: `DA${Date.now()}` };
    setDeliveryAreas([...deliveryAreas, newArea]);
  };

  const loginAdmin = (email: string, password: string): boolean => {
    if (
      normalizeEmail(email) === normalizeEmail(ADMIN_CREDENTIALS.email) &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        customers,
        deliveryAreas,
        dashboardStats,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        addCustomerNote,
        updateDeliveryArea,
        addDeliveryArea,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
