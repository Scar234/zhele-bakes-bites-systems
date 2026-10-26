import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor: attach admin JWT when present ─────────────────────
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('zhele_admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: unified error formatting ─────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Catalog API ──────────────────────────────────────────────────────────────
export const catalogApi = {
  getCategories: () => apiClient.get('/api/catalog/categories'),

  getProducts: (params = {}) => apiClient.get('/api/catalog/products', { params }),

  getProductById: (id) => apiClient.get(`/api/catalog/products/${id}`),

  // Admin-only
  seedDatabase: () => apiClient.post('/api/catalog/seed'),

  createProduct: (data) => apiClient.post('/api/catalog/products', data),

  updateProduct: (id, data) => apiClient.put(`/api/catalog/products/${id}`, data),

  deleteProduct: (id) => apiClient.delete(`/api/catalog/products/${id}`),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  createOrder: (payload) => apiClient.post('/api/orders', payload),

  // Admin-only (requires token)
  getOrders: (params = {}) => apiClient.get('/api/orders', { params }),

  // Public tracking
  getOrderById: (identifier) => apiClient.get(`/api/orders/${identifier}`),

  // Admin-only
  updateOrderStatus: (id, status, note) =>
    apiClient.patch(`/api/orders/${id}/status`, { status, note }),
};

// ─── Admin Auth API ───────────────────────────────────────────────────────────
export const adminApi = {
  login: (username, password) =>
    apiClient.post('/api/admin/login', { username, password }),

  verify: () => apiClient.get('/api/admin/verify'),
};

export default apiClient;
