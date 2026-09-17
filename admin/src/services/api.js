import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trailhead_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    if (import.meta.env.DEV) {
      console.error(`[Admin API] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, message);
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
