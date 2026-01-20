import axios from 'axios';

// ✅ Use Vite's import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Request with token');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized - token expired or invalid');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const api = {
  // ✅ Get user profile
  getProfile: async () => {
    try {
      console.log('👤 Getting user profile');
      const response = await axiosInstance.get('/users/profile');
      console.log('✅ Profile retrieved:', response.data.user?.email);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting profile:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      console.log('🔐 Logging in...');
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('✅ Login successful');
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('💾 Token saved to localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Register
  register: async (userData) => {
    try {
      console.log('📝 Registering...');
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('✅ Registration successful');
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('💾 Token saved to localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Register error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get cart
  getCart: async () => {
    try {
      console.log('🛒 Getting cart...');
      const response = await axiosInstance.get('/cart');
      console.log('✅ Cart retrieved:', response.data.cart?.length, 'items');
      return response.data;
    } catch (error) {
      console.error('❌ Get cart error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Add to cart
  addToCart: async (item) => {
    try {
      console.log('➕ Adding to cart:', item);
      const response = await axiosInstance.post('/cart', item);
      console.log('✅ Item added to cart');
      return response.data;
    } catch (error) {
      console.error('❌ Add to cart error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    try {
      console.log('➖ Removing from cart:', productId);
      const response = await axiosInstance.delete(`/cart/${productId}`);
      console.log('✅ Item removed from cart');
      return response.data;
    } catch (error) {
      console.error('❌ Remove from cart error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Update quantity
  updateQuantity: async (productId, data) => {
    try {
      console.log('📝 Updating quantity:', productId, data);
      const response = await axiosInstance.put(`/cart/${productId}`, data);
      console.log('✅ Quantity updated');
      return response.data;
    } catch (error) {
      console.error('❌ Update quantity error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get wishlist
  getWishlist: async () => {
    try {
      console.log('❤️ Getting wishlist...');
      const response = await axiosInstance.get('/wishlist');
      console.log('✅ Wishlist retrieved:', response.data.wishlist?.length, 'items');
      return response.data;
    } catch (error) {
      console.error('❌ Get wishlist error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Add to wishlist
  addToWishlist: async (item) => {
    try {
      console.log('➕ Adding to wishlist:', item);
      const response = await axiosInstance.post('/wishlist', item);
      console.log('✅ Item added to wishlist');
      return response.data;
    } catch (error) {
      console.error('❌ Add to wishlist error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    try {
      console.log('➖ Removing from wishlist:', productId);
      const response = await axiosInstance.delete(`/wishlist/${productId}`);
      console.log('✅ Item removed from wishlist');
      return response.data;
    } catch (error) {
      console.error('❌ Remove from wishlist error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get products
  getProducts: async (page = 1, limit = 10) => {
    try {
      console.log('📦 Getting products...');
      const response = await axiosInstance.get(`/products?page=${page}&limit=${limit}`);
      console.log('✅ Products retrieved:', response.data.products?.length);
      return response.data;
    } catch (error) {
      console.error('❌ Get products error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      console.log('📦 Getting product:', productId);
      const response = await axiosInstance.get(`/products/${productId}`);
      console.log('✅ Product retrieved');
      return response.data;
    } catch (error) {
      console.error('❌ Get product error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Create order
  createOrder: async (orderData) => {
    try {
      console.log('📋 Creating order...');
      const response = await axiosInstance.post('/orders', orderData);
      console.log('✅ Order created');
      return response.data;
    } catch (error) {
      console.error('❌ Create order error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get orders
  getOrders: async () => {
    try {
      console.log('📦 Getting orders...');
      const response = await axiosInstance.get('/orders');
      console.log('✅ Orders retrieved:', response.data.orders?.length);
      return response.data;
    } catch (error) {
      console.error('❌ Get orders error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      console.log('📦 Getting order:', orderId);
      const response = await axiosInstance.get(`/orders/${orderId}`);
      console.log('✅ Order retrieved');
      return response.data;
    } catch (error) {
      console.error('❌ Get order error:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },
};

// ✅ Export both api and axiosInstance
export default api;
export { axiosInstance };