import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ecommerce-shop-2gfc.onrender.com/api', // Change to your backend URL
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 