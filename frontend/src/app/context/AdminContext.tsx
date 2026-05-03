import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ADMIN_CREDENTIALS, normalizeEmail, STORAGE_KEYS } from '../lib/authConfig';
import { authApi, foodApi, ordersApi } from '../lib/api';

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
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addCustomerNote: (customerId: string, note: string) => void;
  updateDeliveryArea: (id: string, updates: Partial<DeliveryArea>) => void;
  addDeliveryArea: (area: Omit<DeliveryArea, 'id'>) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'token';
const ADMIN_USER_KEY = 'admin_user';

const CATEGORY_LABELS: Record<string, string> = {
  main: 'Main Dishes',
  snack: 'Snacks',
  dessert: 'Desserts',
  beverage: 'Beverages',
  appetizer: 'Appetizers',
  other: 'Other',
};

const CATEGORY_TO_BACKEND: Record<string, string> = {
  'Main Dishes': 'main',
  'Main Course': 'main',
  Snacks: 'snack',
  Desserts: 'dessert',
  Beverages: 'beverage',
  Appetizers: 'appetizer',
  Other: 'other',
};

const STATUS_FROM_BACKEND: Record<string, Order['status']> = {
  pending: 'pending',
  confirmed: 'preparing',
  preparing: 'preparing',
  ready: 'ready',
  delivered: 'delivered',
  cancelled: 'rejected',
};

const STATUS_TO_BACKEND: Record<string, string> = {
  pending: 'pending',
  preparing: 'preparing',
  ready: 'ready',
  'out-for-delivery': 'ready',
  delivered: 'delivered',
  rejected: 'cancelled',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiProduct(item: any): Product {
  return {
    id: item.id,
    name: item.title,
    description: item.description,
    price: item.price,
    category: CATEGORY_LABELS[item.category] ?? item.category,
    image: item.imageUrl ?? '',
    status: item.isAvailable ? 'active' : 'hidden',
    orderCount: 0,
    revenue: 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiOrder(item: any): Order {
  return {
    id: item.id,
    customerId: item.userId,
    customerName: `Customer (${String(item.userId).slice(-4)})`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: item.items.map((i: any) => ({
      name: i.title,
      quantity: i.quantity,
      price: i.price,
    })),
    total: item.totalAmount,
    status: STATUS_FROM_BACKEND[item.status] ?? 'pending',
    timestamp: item.createdAt,
    deliveryAddress: item.deliveryAddress,
    paymentMethod: 'Cash on Delivery',
  };
}

const mockDeliveryAreas: DeliveryArea[] = [
  { id: '1', name: 'Johar Town', minOrder: 500, deliveryCharge: 100, isActive: true },
  { id: '2', name: 'DHA Phase 5', minOrder: 700, deliveryCharge: 150, isActive: true },
  { id: '3', name: 'Gulberg', minOrder: 600, deliveryCharge: 120, isActive: true },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(mockDeliveryAreas);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);

  useEffect(() => {
    const flag = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    const stored = localStorage.getItem(ADMIN_USER_KEY);
    if (flag === 'true' && stored) {
      const u = JSON.parse(stored) as { id: string };
      setAdminUserId(u.id);
      setIsAdminAuthenticated(true);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await foodApi.getAll();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProducts((res.data.data as any[]).map(mapApiProduct));
    } catch {
      /* keep empty */
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await ordersApi.getAll();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped = (res.data.data as any[]).map(mapApiOrder);
      setOrders(mapped);

      // Derive unique customers from orders
      const seen = new Set<string>();
      const derived: Customer[] = [];
      for (const o of mapped) {
        if (!seen.has(o.customerId)) {
          seen.add(o.customerId);
          derived.push({
            id: o.customerId,
            name: o.customerName,
            email: '',
            phone: '',
            totalOrders: mapped.filter((x) => x.customerId === o.customerId).length,
            joinDate: o.timestamp,
          });
        }
      }
      setCustomers(derived);
    } catch {
      /* keep empty */
    }
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchProducts();
      fetchOrders();
    }
  }, [isAdminAuthenticated, fetchProducts, fetchOrders]);

  const dashboardStats: DashboardStats = {
    ordersToday: orders.filter((o) => {
      return new Date(o.timestamp).toDateString() === new Date().toDateString();
    }).length,
    revenueToday: orders
      .filter(
        (o) =>
          new Date(o.timestamp).toDateString() === new Date().toDateString() &&
          o.status !== 'rejected',
      )
      .reduce((sum, o) => sum + o.total, 0),
    activeDeliveries: orders.filter((o) => o.status === 'out-for-delivery').length,
    newCustomers: customers.filter((c) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.joinDate) >= weekAgo;
    }).length,
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const backendCategory = CATEGORY_TO_BACKEND[product.category] ?? 'other';
    const res = await foodApi.create({
      title: product.name,
      description: product.description,
      price: product.price,
      category: backendCategory,
      imageUrl: product.image || undefined,
      isAvailable: product.status === 'active',
      ownerId: adminUserId ?? '',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setProducts((prev) => [...prev, mapApiProduct((res.data as any).data)]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload['title'] = updates.name;
    if (updates.description !== undefined) payload['description'] = updates.description;
    if (updates.price !== undefined) payload['price'] = updates.price;
    if (updates.image !== undefined) payload['imageUrl'] = updates.image;
    if (updates.status !== undefined) payload['isAvailable'] = updates.status === 'active';
    if (updates.category !== undefined)
      payload['category'] = CATEGORY_TO_BACKEND[updates.category] ?? 'other';

    await foodApi.update(id, payload);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deleteProduct = async (id: string) => {
    await foodApi.remove(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const backendStatus = STATUS_TO_BACKEND[status] ?? status;
    await ordersApi.updateStatus(orderId, backendStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  };

  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes: note } : c)),
    );
  };

  const updateDeliveryArea = (id: string, updates: Partial<DeliveryArea>) => {
    setDeliveryAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addDeliveryArea = (area: Omit<DeliveryArea, 'id'>) => {
    setDeliveryAreas((prev) => [...prev, { ...area, id: `DA${Date.now()}` }]);
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    // Try real backend login first
    try {
      const res = await authApi.login({ email, password });
      const { token, user } = res.data.data as { token: string; user: { id: string; role: string } };
      if (user.role === 'owner' || user.role === 'admin') {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
        setAdminUserId(user.id);
        setIsAdminAuthenticated(true);
        return true;
      }
    } catch {
      // Backend login failed — fall back to hardcoded credentials
    }

    // Hardcoded fallback (works without backend user)
    if (
      normalizeEmail(email) === normalizeEmail(ADMIN_CREDENTIALS.email) &&
      password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      setIsAdminAuthenticated(true);
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUserId(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
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
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
