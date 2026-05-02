import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token is expired/invalid, clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
export const ordersApi = {
  place: (data: { deliveryAddress: string; notes?: string }) =>
    api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const reviewsApi = {
  getByFoodItem: (foodItemId: string) => api.get(`/food/${foodItemId}/reviews`),
  create: (foodItemId: string, data: { rating: number; comment?: string }) =>
    api.post(`/food/${foodItemId}/reviews`, data),
};

export default api;
