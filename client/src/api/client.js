import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 25000,
});

// Attach authorization headers automatically
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('cctv_admin_token');
  const adminKey = localStorage.getItem('cctv_admin_key');

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

// Admin Auth
export const adminLogin = (passcode, email) => api.post('/auth/login', { passcode, email });
export const getAuthStatus = () => api.get('/auth/status');
