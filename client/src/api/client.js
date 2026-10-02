import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const ADMIN_TOKEN_KEY = 'cctv_admin_token';
export const ADMIN_REFRESH_KEY = 'cctv_admin_refresh';
export const ADMIN_KEY_KEY = 'cctv_admin_key';
export const ADMIN_USER_KEY = 'cctv_admin_user';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 25000,
});

// Attach authorization headers automatically
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  const adminKey = localStorage.getItem(ADMIN_KEY_KEY);

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  if (adminKey) {
    config.headers['x-admin-key'] = adminKey;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Supabase access tokens expire (1 hour by default). When a request comes back
// 401 we refresh the session once, then replay the original request.
let refreshInFlight = null;

const refreshAdminToken = () => {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = localStorage.getItem(ADMIN_REFRESH_KEY);
  if (!refreshToken) return Promise.reject(new Error('No admin refresh token'));

  refreshInFlight = api
    .post('/auth/refresh', { refreshToken })
    .then(({ data }) => {
      if (!data?.token) throw new Error('Session refresh failed');
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      if (data.refreshToken) localStorage.setItem(ADMIN_REFRESH_KEY, data.refreshToken);
      if (data.user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
      return data.token;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_KEY);
  localStorage.removeItem(ADMIN_KEY_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = /\/auth\/(login|refresh)/.test(original?.url || '');

    if (status === 401 && original && !original._retried && !isAuthEndpoint && localStorage.getItem(ADMIN_REFRESH_KEY)) {
      original._retried = true;
      try {
        const token = await refreshAdminToken();
        original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
        return api(original);
      } catch {
        clearAdminSession();
      }
    }

    return Promise.reject(error);
  }
);

// Products API
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Offers API
export const getOffers = (params) => api.get('/offers', { params });
export const createOffer = (data) => api.post('/offers', data);
export const updateOffer = (id, data) => api.put(`/offers/${id}`, data);
export const deleteOffer = (id) => api.delete(`/offers/${id}`);

// Categories API (homepage grid + product filters)
export const getCategories = (params) => api.get('/categories', { params });
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Inquiries API
export const submitInquiry = (data) => api.post('/inquiries', data);
export const getInquiries = () => api.get('/inquiries');
export const updateInquiryStatus = (id, status) => api.patch(`/inquiries/${id}/status`, { status });

// Showroom Settings API
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

// Cloudinary Image Upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Admin Auth (Supabase Auth, verified server side)
export const adminLogin = (email, password) => api.post('/auth/login', { email, password });
export const adminLoginWithPasscode = (passcode, email) => api.post('/auth/login', { passcode, email });
export const refreshAdminSession = (refreshToken) => api.post('/auth/refresh', { refreshToken });
export const getAuthStatus = () => api.get('/auth/status');
