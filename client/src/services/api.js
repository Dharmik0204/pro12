const getAccessToken = () => localStorage.getItem('accessToken') || localStorage.getItem('token');
const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
  }
};
const clearAccessToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('token');
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://pro12-77gc.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
export { getAccessToken, setAccessToken, clearAccessToken };
