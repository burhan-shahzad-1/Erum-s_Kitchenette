import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../lib/authConfig';
import { authApi, foodApi, ordersApi, usersApi, deliveryAreasApi } from '../lib/api';

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
  items: { foodItemId: string; name: string; quantity: number; price: number }[];
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

export interface DeliverySettings {
  defaultDeliveryTime: number;
  freeDeliveryEnabled: boolean;
  freeDeliveryThreshold: number;
  maxDeliveryRadius: number;
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
  deliverySettings: DeliverySettings;
  saveDeliverySettings: (s: DeliverySettings) => void;
  dashboardStats: DashboardStats;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  addCustomerNote: (customerId: string, note: string) => void;
  updateDeliveryArea: (id: string, updates: Partial<DeliveryArea>) => Promise<void>;
  addDeliveryArea: (area: Omit<DeliveryArea, 'id'>) => Promise<void>;
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
  'out-for-delivery': 'out-for-delivery',
  delivered: 'delivered',
  cancelled: 'rejected',
};

const STATUS_TO_BACKEND: Record<string, string> = {
  pending: 'pending',
  preparing: 'preparing',
  ready: 'ready',
  'out-for-delivery': 'out-for-delivery',
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
      foodItemId: i.foodItemId,
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

const DELIVERY_SETTINGS_KEY = 'kitchenette_delivery_settings';

const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  defaultDeliveryTime: 30,
  freeDeliveryEnabled: false,
  freeDeliveryThreshold: 1000,
  maxDeliveryRadius: 10,
};

function loadDeliverySettings(): DeliverySettings {
  try {
    const raw = localStorage.getItem(DELIVERY_SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as DeliverySettings) : DEFAULT_DELIVERY_SETTINGS;
  } catch {
    return DEFAULT_DELIVERY_SETTINGS;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(loadDeliverySettings);

  const saveDeliverySettings = (s: DeliverySettings) => {
    localStorage.setItem(DELIVERY_SETTINGS_KEY, JSON.stringify(s));
    setDeliverySettings(s);
  };
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
      const mapped = (res.data.data as any[])
        .map(mapApiOrder)
        .sort((a: Order, b: Order) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setOrders(mapped);
    } catch {
      /* keep empty */
    }
  }, []);

  const fetchDeliveryAreas = useCallback(async () => {
    try {
      const res = await deliveryAreasApi.getAll();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDeliveryAreas((res.data.data as any[]).map((a) => ({
        id: a.id, name: a.name, minOrder: a.minOrder,
        deliveryCharge: a.deliveryCharge, isActive: a.isActive,
      })));
    } catch { /* keep empty */ }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await usersApi.getAll();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const users = res.data.data as any[];
      setCustomers(
        users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email ?? '',
          phone: u.phone ?? '',
          totalOrders: 0,
          joinDate: u.createdAt ?? new Date().toISOString(),
        })),
      );
    } catch {
      /* keep empty */
    }
  }, []);

  // Once we have both orders and customers, compute totalOrders per customer
  useEffect(() => {
    if (customers.length > 0 && orders.length > 0) {
      const countMap = new Map<string, number>();
      orders.forEach((o) => countMap.set(o.customerId, (countMap.get(o.customerId) ?? 0) + 1));
      setCustomers((prev) =>
        prev.map((c) => ({ ...c, totalOrders: countMap.get(c.id) ?? 0 })),
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchProducts();
      fetchOrders();
      fetchCustomers();
      fetchDeliveryAreas();
    }
  }, [isAdminAuthenticated, fetchProducts, fetchOrders, fetchCustomers, fetchDeliveryAreas]);

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

  const updateDeliveryArea = async (id: string, updates: Partial<DeliveryArea>) => {
    await deliveryAreasApi.update(id, updates);
    setDeliveryAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addDeliveryArea = async (area: Omit<DeliveryArea, 'id'>) => {
    const res = await deliveryAreasApi.create(area);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = (res.data as any).data;
    setDeliveryAreas((prev) => [...prev, {
      id: created.id, name: created.name, minOrder: created.minOrder,
      deliveryCharge: created.deliveryCharge, isActive: created.isActive,
    }]);
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
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
      // Logged in but not an owner/admin role
      return false;
    } catch {
      return false;
    }
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
        deliverySettings,
        saveDeliverySettings,
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
