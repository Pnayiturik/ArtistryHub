import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

// List of endpoints that don't require authentication
const publicEndpoints = [
  '/api/token/',
  '/api/token/refresh/'
];

// Add interceptor to automatically add token to requests
api.interceptors.request.use((config) => {
  // Don't add auth header for public endpoints
  if (publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
    return config;
  }
  
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.post('/api/token/refresh/', {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 