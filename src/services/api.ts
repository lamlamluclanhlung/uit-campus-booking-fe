import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Facilities API
export const facilitiesAPI = {
  getAll: () => api.get('/facilities'),
  getById: (id: string) => api.get(`/facilities/${id}`),
  getSlots: (id: string, date?: string) =>
    api.get(`/facilities/${id}/slots`, { params: { date } }),
};

// Bookings API
export const bookingsAPI = {
  create: (data: { facilityId: string; slotId: string; purpose?: string }) =>
    api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/me'),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
};

// Admin API
export const adminAPI = {
  getPendingBookings: () => api.get('/admin/bookings/pending'),
  approveBooking: (id: string) => api.put(`/admin/bookings/${id}/approve`),
  rejectBooking: (id: string) => api.put(`/admin/bookings/${id}/reject`),
  checkinByQR: (qrToken: string) => api.post('/checkins/qr', { qrToken }),
  getSummary: () => api.get('/reports/summary'),
};

export default api;
