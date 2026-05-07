import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || 'https://erum-s-kitchenette.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token is expired/invalid, clear storage and redirect to login.
// Skip this for auth endpoints themselves — a 401 on /auth/login just means
// wrong credentials, not an expired session, so let the form handle it.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string; phone?: string; address?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

// ── Food Items ────────────────────────────────────────────────────────────────
export const foodApi = {
  getAll: (params?: { category?: string; search?: string }) =>
    api.get('/food', { params }),
  getOne: (id: string) => api.get(`/food/${id}`),
  create: (data: FormData | object) => api.post('/food', data),
  update: (id: string, data: object) => api.put(`/food/${id}`, data),
  remove: (id: string) => api.delete(`/food/${id}`),
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (foodItemId: string, quantity = 1) =>
    api.post('/cart/items', { foodItemId, quantity }),
  removeItem: (foodItemId: string) => api.delete(`/cart/items/${foodItemId}`),
  clear: () => api.delete('/cart'),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export interface OrderItemPayload {
  foodItemId: string;
  title: string;
  price: number;
  quantity: number;
}

export const ordersApi = {
  place: (data: { deliveryAddress: string; notes?: string; items: OrderItemPayload[] }) =>
    api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// ── Users (admin) ─────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () => api.get('/auth/users'),
};

// ── Delivery Areas ────────────────────────────────────────────────────────────
export const deliveryAreasApi = {
  getActive: () => api.get('/delivery-areas'),
  getAll: () => api.get('/delivery-areas/all'),
  create: (data: { name: string; minOrder: number; deliveryCharge: number; isActive: boolean }) =>
    api.post('/delivery-areas', data),
  update: (id: string, data: Partial<{ name: string; minOrder: number; deliveryCharge: number; isActive: boolean }>) =>
    api.put(`/delivery-areas/${id}`, data),
  remove: (id: string) => api.delete(`/delivery-areas/${id}`),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsApi = {
  getByFoodItem: (foodItemId: string) => api.get(`/food/${foodItemId}/reviews`),
  create: (foodItemId: string, data: { rating: number; comment?: string }) =>
    api.post(`/food/${foodItemId}/reviews`, data),
};

export default api;
