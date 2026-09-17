import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('trailhead_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Centralized so every call site doesn't need its own console.error --
    // this is the one place API failures get logged, which is what keeps
    // the browser console clean of scattered, duplicate error noise.
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    if (import.meta.env.DEV) {
      console.error(`[API] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, message);
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
