import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, ShoppingCart, Heart, Menu, User, Star, Plus, Minus, Trash2, MapPin, CreditCard, Package, LogOut, Eye, EyeOff, House, ChevronLeft, ChevronRight } from 'lucide-react';
import api from './api/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const AppContext = createContext();
// Context for global state

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load user data on mount
 useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('🔐 Checking token on mount:', !!token);
        
        if (!token) {
          console.log('❌ No token found');
          setUser(null);
          setCart([]);
          setWishlist([]);
          setLoading(false);
          return;
        }

        console.log('✅ Token found, attempting to load profile...');
        setLoading(true);
        
        try {
          const profileResponse = await api.getProfile();
          console.log('✅ Profile response:', profileResponse);
          
          if (profileResponse.success && profileResponse.user) {
            console.log('✅ User authenticated:', profileResponse.user.email);
            setUser(profileResponse.user);
            
            // ✅ Load cart
            try {
              const cartData = await api.getCart();
              console.log('🛒 Cart loaded:', cartData.cart?.length || 0, 'items');
              setCart(cartData.cart || []);
            } catch (cartError) {
              console.error('⚠️ Cart error (non-fatal):', cartError);
              setCart([]);
            }

            // ✅ Load wishlist
            try {
              const wishlistData = await api.getWishlist();
              console.log('❤️ Wishlist loaded:', wishlistData.wishlist?.length || 0, 'items');
              setWishlist(wishlistData.wishlist || []);
            } catch (wishlistError) {
              console.error('⚠️ Wishlist error (non-fatal):', wishlistError);
              setWishlist([]);
            }
          } else {
            console.warn('⚠️ Invalid profile response');
            localStorage.removeItem('token');
            setUser(null);
            setCart([]);
            setWishlist([]);
          }
        } catch (profileError) {
          console.error('❌ Profile fetch error:', profileError);
          
          // ✅ Clear token only if unauthorized
          if (profileError.status === 401 || profileError.toString().includes('401')) {
            console.log('🔄 Clearing invalid token');
            localStorage.removeItem('token');
          }
          
          setUser(null);
          setCart([]);
          setWishlist([]);
        }
      } catch (error) {
        console.error('❌ Unexpected error in loadUserData:', error);
        setUser(null);
        setCart([]);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);


  // ✅ Add refreshCart function
  const refreshCart = async () => {
    try {

       if (!user) {
        console.warn('⚠️ Cannot refresh cart - user not logged in');
        setCart([]);
        return;
      }

      console.log('🔄 Refreshing cart...');
      const cartData = await api.getCart();
      const cartItems = cartData.cart || [];
      setCart(cartItems);
      console.log('✅ Cart refreshed:', cartItems.length, 'items');
    } catch (error) {
      console.error('❌ Error refreshing cart:', error);
      setCart([]);
    }
  };

  // ✅ Add refreshWishlist function
  const refreshWishlist = async () => {
    try {

      if (!user) {
        console.warn('⚠️ Cannot refresh wishlist - user not logged in');
        setWishlist([]);
        return;
      }

      console.log('🔄 Refreshing wishlist...');
      const wishlistData = await api.getWishlist();
      const wishlistItems = wishlistData.wishlist || [];
      setWishlist(wishlistItems);
      console.log('✅ Wishlist refreshed:', wishlistItems.length, 'items');
    } catch (error) {
      console.error('❌ Error refreshing wishlist:', error);
      setWishlist([]);
    }
  };

  // ✅ Add to cart
  const addToCart = async (productId, quantity = 1) => {

    if (!user) {
        alert('Please login to add items to cart');
        return;
      }
      

    try {
      console.log('🛒 Adding to cart - productId:', productId, 'qty:', quantity);
      const response = await api.addToCart({ productId, quantity });
      
      const newCart = response.cart || [];
      setCart(newCart);
      console.log('✅ Cart updated:', newCart.length, 'items');
      return response;
    } catch (error) {
      console.error('❌ Add to cart error:', error);
      throw error;
    }
  };

  // ✅ Remove from cart
  const removeFromCart = async (productId) => {

     if (!user) {
        console.warn('⚠️ Cannot remove from cart - user not logged in');
        return;
      }

    try {
      console.log('🗑️ Removing from cart - productId:', productId);
      const response = await api.removeFromCart(productId);
      
      const newCart = response.cart || [];
      setCart(newCart);
      console.log('✅ Cart updated:', newCart.length, 'items');
      return response;
    } catch (error) {
      console.error('❌ Remove from cart error:', error);
      throw error;
    }
  };

  // ✅ Update quantity
  const updateQty = async (productId, quantity) => {
    try {

      if (!user) {
        console.warn('⚠️ Cannot update quantity - user not logged in');
        return;
      }

      if (quantity < 1) {
        return removeFromCart(productId);
      }

      console.log('📝 Updating qty - productId:', productId, 'qty:', quantity);
      const response = await api.updateQuantity(productId, { quantity });
      
      const newCart = response.cart || [];
      setCart(newCart);
      console.log('✅ Cart updated:', newCart.length, 'items');
      return response;
    } catch (error) {
      console.error('❌ Update quantity error:', error);
      throw error;
    }
  };

  // ✅ Toggle wishlist
  const toggleWishlist = async (product) => {
    try {

      if (!user) {
        alert('Please login to add items to wishlist');
        return;
      }

      const productId = product._id || product.id;
      console.log('❤️ Toggle wishlist - productId:', productId);

      const isInWish = wishlist.some(p => (p._id || p.id) === productId);

      if (isInWish) {
        const response = await api.removeFromWishlist(productId);
        const newWishlist = response.wishlist || [];
        setWishlist(newWishlist);
        console.log('✅ Removed from wishlist');
        return response;
      } else {
        const response = await api.addToWishlist({ productId });
        const newWishlist = response.wishlist || [];
        setWishlist(newWishlist);
        console.log('✅ Added to wishlist');
        return response;
      }
    } catch (error) {
      console.error('❌ Toggle wishlist error:', error);
      throw error;
    }
  };

  // ✅ Check if in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(p => (p._id || p.id) === productId);
  };

  // ✅ Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const quantity = item.quantity || 1;
    return total + (item.price * quantity);
  }, 0);

  // ✅ Get cart count for header
  const cartCount = cart.length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        setCart,
        wishlist,
        setWishlist,
        addToCart,
        removeFromCart,
        updateQty,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        loading,
        refreshCart,      // ✅ Add this
        refreshWishlist,  // ✅ Add this
      }}
    >
      {children}
    </AppContext.Provider>
  );
};


const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Login/Signup Page
// Replace the AuthPage component with this:

const AuthPage = ({ onNavigate, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser, setCart, setWishlist } = useApp();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Submitting auth form:', isLogin ? 'LOGIN' : 'REGISTER');
      
      const response = isLogin
        ? await api.login({
            email: formData.email,
            password: formData.password,
          })
        : await api.register(formData);

      console.log('✅ Auth response:', response);

      if (response.success && response.token) {
        console.log('💾 Saving token to localStorage');
        localStorage.setItem('token', response.token);

        // ✅ Update user state
        setUser(response.user);
        console.log('✅ User set:', response.user.email);

        // ✅ Load cart and wishlist after login
        try {
          console.log('🛒 Loading cart after login...');
          const cartData = await api.getCart();
          console.log('✅ Cart loaded:', cartData.cart);
          setCart(cartData.cart || []);
        } catch (cartError) {
          console.error('⚠️ Cart load error (non-fatal):', cartError);
          setCart([]);
        }

        try {
          console.log('❤️ Loading wishlist after login...');
          const wishlistData = await api.getWishlist();
          console.log('✅ Wishlist loaded:', wishlistData.wishlist);
          setWishlist(wishlistData.wishlist || []);
        } catch (wishlistError) {
          console.error('⚠️ Wishlist load error (non-fatal):', wishlistError);
          setWishlist([]);
        }

      

        console.log('✅ Auth successful, calling onLoginSuccess');
        onLoginSuccess(response.user);
        onNavigate('home');
      } else {
        setError(response.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('❌ Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-12 px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-pulse"></div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img 
            src='https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' 
            alt="Amazon Logo" 
            className="h-12 w-auto object-contain mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => onNavigate('home')}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to your account to continue shopping' 
                : 'Create an account to get started'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
              <div className="flex gap-3">
                <span className="text-red-600 font-semibold text-lg">⚠️</span>
                <div>
                  <p className="text-red-800 font-semibold">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field - Only for Register */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder-gray-400"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                isLogin ? '🔐 Sign In' : '📝 Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Toggle Login/Register */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-orange-600 font-bold py-3 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all border-2 border-orange-200 hover:border-orange-300"
            >
              {isLogin ? 'Create Account' : 'Sign In Instead'}
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-lg">✓</span>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-lg">✓</span>
                <span>Easy returns and exchanges</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-lg">✓</span>
                <span>24/7 customer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            ← Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
// Account Menu Dropdown
const AccountMenu = ({ user, onNavigate, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    api.token = null;
    onLogout();
    setIsOpen(false);
    onNavigate('auth');
  };

  if (!user) {
    return (
      <button
        onClick={() => onNavigate('auth')}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 font-semibold"
      >
        <User size={20} />
        <span className="hidden md:inline">Login</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-orange-200 transition-all duration-200 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden md:inline text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
          {user.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-4 border-b border-gray-200">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                onNavigate('orders');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
            >
              <ShoppingCart size={18} className="text-orange-500" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => {
                onNavigate('wishlist');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
            >
              <Heart size={18} className="text-orange-500" />
              <span>Wishlist</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
            >
              <User size={18} className="text-orange-500" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
            >
              <MapPin size={18} className="text-orange-500" />
              <span>Addresses</span>
            </button>
          </div>

          <div className="border-t border-gray-200 p-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-sm text-red-600 font-semibold rounded"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Header Component
const Header = ({ onNavigate, currentPage, user, onLogout }) => {
  const { cartCount, wishlist } = useApp();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products for search:', error);
      }
    };
    loadProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleProductClick = (productId) => {
    console.log('Clicking product with ID:', productId);
    setSearch('');
    setShowSearchResults(false);
    onNavigate('product-detail', productId);
  };

  return (
    <header className="bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 text-white sticky top-0 z-50 shadow-lg rounded-b-lg">
      <div className="px-6 py-4">
        <div className="flex px-5 items-center justify-between gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            title="Go to Home"
          >
            <img 
              src='https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' 
              alt="Amazon Logo" 
              className="h-10 w-auto object-contain"
            />
          </button>
          
          <div className="flex-1 max-w-2xl">
            <div className="relative group bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              
              <input
                type="text"
                placeholder="Search products, brands, and more..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => search && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="w-full font-roboto pl-12 pr-4 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-orange-400 transition-all shadow-md hover:shadow-lg"
                spellCheck={false}
             />

              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white text-gray-900 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50 border border-gray-200">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 sticky top-0">
                    <p className="text-sm font-semibold text-gray-600">
                      {searchResults.length} results found
                    </p>
                  </div>

                  {searchResults.slice(0, 8).map((product, index) => (
                    <div key={product.id || product._id}>
                      {index > 0 && <div className="border-t border-gray-100" />}
                      <div
                        onClick={() => handleProductClick(product.id || product._id)}
                        className="px-4 py-4 hover:bg-orange-50 cursor-pointer transition-colors duration-150 group/item"
                      >
                        <div className="flex gap-4 items-start">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden group-hover/item:shadow-md transition-shadow">
                            <img 
                              src={product.image} 
                              alt={product.title} 
                              className="w-full h-full object-contain p-2" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover/item:text-orange-600 transition-colors">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-lg font-bold text-orange-500">${product.price}</span>
                              {product.rating && (
                                <div className="flex items-center gap-1">
                                  <Star size={14} fill="#fbbf24" className="text-yellow-400" />
                                  <span className="text-xs text-gray-600">{product.rating?.rate || product.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {searchResults.length > 8 && (
                    <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white sticky bottom-0">
                      <button
                        onClick={() => {
                          onNavigate('home');
                          setShowSearchResults(false);
                        }}
                        className="w-full px-4 py-3 text-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        View all {searchResults.length} results →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {showSearchResults && searchResults.length === 0 && search.trim() && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white text-gray-900 rounded-xl shadow-2xl z-50 border border-gray-200 p-8 text-center">
                  <Search size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600 font-semibold">No products found</p>
                  <p className="text-sm text-gray-500 mt-1">Try searching with different keywords</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* Home button */}
            <button
              onClick={() => onNavigate('home')}
              className={`relative p-3 rounded-full transition-all duration-200 group ${
               currentPage === 'home' 
                  ? 'bg-orange-200 text-orange-600' 
                  : 'hover:bg-orange-200'
              }`}
               title="Home"
              >
                <House size={24} className="text-red-500 group-hover:scale-110 transition-all" />
              </button>

            <button 
              onClick={() => onNavigate('wishlist')}
              className={`relative p-3 rounded-full transition-all duration-200 group ${
               currentPage === 'wishlist' 
                  ? 'bg-orange-200 text-orange-600' 
                  : 'hover:bg-orange-200'
              }`}
              title="Wishlist"
            >
              <Heart size={24} fill="#f70000" className="text-red-500 group-hover:scale-110 transition-transform" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {wishlist.length}
                </span>
              )}
            </button>
             

            <button 
              onClick={() => onNavigate('cart')}
              className={`relative p-3 rounded-full transition-all duration-200 group ${
               currentPage === 'cart' 
                  ? 'bg-orange-200 text-orange-600' 
                  : 'hover:bg-orange-200'
              }`}
              title="Cart"
            >
              <ShoppingCart size={24} className="text-red-500 group-hover:scale-110 transition-all" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* order button */}
            <button
              onClick={() => onNavigate('orders')}
              className={`relative p-3 rounded-full transition-all duration-200 group ${
               currentPage === 'orders' 
                  ? 'bg-orange-200 text-orange-600' 
                  : 'hover:bg-orange-200'
              }`}
               title="My Orders"
              >
                <Package size={24} className="text-red-500 group-hover:scale-110 transition-all" />
              </button>

            <AccountMenu user={user} onNavigate={onNavigate} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};

// Product Card Component
// Product Card Component
const ProductCard = ({ product, onNavigate }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const productId = product._id || product.id;

  // ✅ FIX: Pass only productId, not the entire product object
const handleAddToCart = async () => {
    try {
      await addToCart(productId, 1);
      alert('✅ Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <div onClick={() => onNavigate('product-detail', productId)} 
        className="bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-100 rounded-lg shadow-md p-4 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out flex flex-col">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onNavigate('product-detail', productId)}
        />
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <Heart
            size={20}
            fill={isInWishlist(productId) ? "#f97316" : "none"}
            className={isInWishlist(productId) ? "text-orange-500" : "text-gray-600"}
          />
        </button>
      </div>
      
      <h3 
        onClick={() => onNavigate('product-detail', productId)}
        className="font-semibold text-sm mb-2 line-clamp-2 h-10 cursor-pointer hover:text-orange-500"
      >
        {product.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              fill={i < Math.floor(product.rating?.rate || product.rating || 4) ? "#fbbf24" : "none"}
              className="text-yellow-400"
              size={14}
            />
          ))}
        </div>
        <span className="text-xs text-gray-600">({product.rating?.count || 0})</span>
      </div>
      
      <div className="mb-3">
        <span className="text-2xl font-bold">${product.price}</span>
        <p className="text-xs text-gray-600 mt-1">{product.category}</p>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
};

// ✅ Orders Page Component
const OrdersPage = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log('📦 Loading orders...');
        setLoading(true);
        setError('');
        
        const response = await api.getOrders();
        console.log('Orders response:', response);
        
        const ordersData = response.orders || [];
        setOrders(ordersData);
        console.log('✅ Orders loaded:', ordersData.length);
      } catch (err) {
        console.error('❌ Error loading orders:', err);
        const errorMsg = err.message || 'Failed to load orders';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (selectedOrder) {
    return (
      <div>
        <div className="max-w-7xl mx-auto p-4">

        
        <button
          onClick={() => setSelectedOrder(null)}
          className="text-orange-500 font-bold hover:underline mb-6 flex items-center gap-2"
        >
          ← Back to Orders
        </button>
       
        <OrderDetailPage order={selectedOrder} onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">My Orders</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
          <p className="text-red-800 font-semibold">⚠️ Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center py-16">
        <Package size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <p className="text-gray-600 mb-6">Start shopping to place your first order</p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        onClick={() => onNavigate('home')}
        className="text-orange-500 font-bold hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Products
      </button>

      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      <div className="space-y-4">
        {orders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            onViewDetails={setSelectedOrder}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};

// ✅ Order Card Component
const OrderCard = ({ order, onViewDetails, onNavigate }) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    processing: 'bg-blue-100 text-blue-800 border-blue-300',
    shipped: 'bg-purple-100 text-purple-800 border-purple-300',
    delivered: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusIcon = {
    pending: '⏳',
    processing: '📦',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌',
  };

  const status = order.status || 'pending';
  const itemCount = order.items?.length || 0;

  return (
    <div className="w-200 h-75 scale-100 bg-white px-4 p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="font-semibold text-lg">{order._id?.slice(-8) || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Order Date</p>
          <p className="font-semibold">{orderDate}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="font-semibold text-lg text-orange-600">${(order.totalAmount || 0).toFixed(2)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <div className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold mt-1 ${statusColor[status]}`}>
            {statusIcon[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>

      <div className="mb-4 pb-4">
        <p className="text-sm text-gray-600 mb-2">{itemCount} item(s)</p>
        <div className="flex flex-wrap gap-2">
          {order.items?.slice(0, 3).map((item, idx) => (
            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {item.title?.substring(0, 20)}... x{item.quantity}
            </span>
          ))}
          {itemCount > 3 && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">+{itemCount - 3} more</span>
          )}
        </div>
      </div>

      <div className="flex justify gap-2 scale-100 md:scale-100">
      <button
        onClick={() => onViewDetails(order)}
        className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600"
      >
        View Details
          </button> 
      

        {status === 'delivered' && (
          <button
            className="gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors text-sm"
          >
            Write Review
          </button>
        )}
      </div>
    </div>
  );
};

// ✅ Order Detail Modal Component

const OrderDetailPage = ({ order, onNavigate }) => {
  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = statusSteps.indexOf(order.status || 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-200 text-white p-8 rounded-3xl shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white/90 to-white/50 bg-clip-text text-transparent mb-1">
                Order #{order._id?.slice(-8) || 'N/A'}
              </h1>
              <p className="text-orange-100 font-medium">
                Order placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentStatusIndex === statusSteps.length - 1 
                  ? 'bg-green-500/20 text-green-200 border-green-500/30' 
                  : 'bg-white/20 text-white border-white/30'
              } border`}>
                {statusSteps[currentStatusIndex]}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Status & Items */}
          <div className="space-y-8">
            {/* Status Timeline */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Order Status
              </h3>
              <div className="relative">
                <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm"
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between">
                  {statusSteps.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg transition-all ${
                          idx <= currentStatusIndex
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/50'
                            : 'bg-white text-gray-500 shadow-gray-200 border-2 border-gray-200'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <p className="text-xs mt-3 font-semibold capitalize text-gray-700 min-w-[70px] text-center">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="group hover:shadow-lg transition-all bg-white/50 rounded-xl p-5 border border-orange-100 hover:border-orange-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 line-clamp-1 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                      </div>
                      <div className="text-right font-bold text-xl text-orange-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Address & Summary */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-xl border border-blue-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Shipping Address
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-800">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                <p className="font-medium">{order.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 shadow-xl border border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span className="font-semibold">${(order.totalAmount * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${(order.totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      ${order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Payment Method</h4>
                  <p className="text-sm capitalize bg-gray-100 px-4 py-2 rounded-lg inline-block">
                    {order.paymentMethod === 'cod' ? '💰 Cash on Delivery' : '💳 Credit/Debit Card'}
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all">
                    Track Order
                  </button>
                  <button className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
};





// ✅ Order Status Component (standalone - can be used anywhere)
const OrderStatus = ({ status = 'pending' }) => {
  const statusConfig = {
    pending: {
      icon: '⏳',
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description: 'Order received and processing'
    },
    processing: {
      icon: '📦',
      label: 'Processing',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Preparing your order'
    },
    shipped: {
      icon: '🚚',
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'On the way to you'
    },
    delivered: {
      icon: '✅',
      label: 'Delivered',
      color: 'bg-green-100 text-green-800 border-green-300',
      description: 'Order delivered successfully'
    },
    cancelled: {
      icon: '❌',
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800 border-red-300',
      description: 'Order has been cancelled'
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`inline-block px-4 py-2 rounded-lg border font-semibold ${config.color}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <span>{config.label}</span>
      </div>
      <p className="text-xs opacity-75 mt-1">{config.description}</p>
    </div>
  );
};

// Home Page
const HomePage = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  //  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });
  const PRODUCTS_PER_PAGE = 10;

 useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading products for page:', currentPage);
        
        const data = await api.getProducts(currentPage, PRODUCTS_PER_PAGE);
        
        console.log('📦 Response data:', {
          productsCount: data.products?.length,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          pagination: data.pagination,
        });
        
        const productList = data.products || [];
        setProducts(productList);
        
        // ✅ Filter products
        let filtered = selectedCategory === 'All' 
          ? productList 
          : productList.filter(p => p.category === selectedCategory);
        
        setFilteredProducts(filtered);
        
        console.log('📊 Filtered products:', {
          count: filtered.length,
          category: selectedCategory,
        });

        // ✅ Set pagination from response
        const totalPages = data.pagination?.totalPages || data.totalPages || 0;
        const totalProducts = filtered?.length || 0;
        
        console.log('✅ Setting pagination:', {
          totalPages,
          totalProducts,
          currentPage,
        });

        setPagination({
          currentPage: currentPage,
          totalPages: totalPages,
          totalProducts: totalProducts,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
        });

        const uniqueCategories = [...new Set(productList.map(p => p.category))];
        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        console.error('❌ Failed to load products:', error);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNext: false,
          hasPrev: false,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    let filtered = selectedCategory === 'All' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    switch(sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating?.rate || b.rating || 0) - (a.rating?.rate || a.rating || 0));
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  const handleCategoryChange = (category) => {
    console.log('📂 Changing category to:', category);
    setSelectedCategory(category);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      console.log('◀️ Going to previous page');
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      console.log('▶️ Going to next page');
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum) => {
    console.log('🔢 Clicking page:', pageNum);
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-gradient-to-r from-orange-200 via-orange-300 to-orange-300 text-white p-8 rounded-lg mb-8">
        <h2
  className="text-4xl font-google-sans-flex-sansflex mb-4 inline-block
             bg-gray-800
             bg-clip-text text-transparent"
>
  Welcome to Amazon
</h2>

        <div className="w-88 h-0.5 mt-3 bg-orange-400 mb-1"></div>
        <p className="text-xl font-Oswald text-gray-800">Discover amazing deals on top products</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-orange-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          <span className="text-gray-500 text-lg ml-3">({filteredProducts.length} items)</span>
        </h2>

        <div className="flex items-center gap-3">
          <label className="text-gray-700 font-semibold">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-orange-200 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option className="bg-orange-50" value="featured">Featured</option>
            <option className="bg-orange-50" value="price-low">Price: Low to High</option>
            <option className="bg-orange-50" value="price-high">Price: High to Low</option>
            <option className="bg-orange-50" value="rating">Top Rated</option>
            <option className="bg-orange-50" value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No products found in this category</p>
        </div>
      ) : (
         <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id || product._id} product={product} onNavigate={onNavigate}/>
            ))}
          </div>

          {/* ✅ ADD PAGINATION CONTROLS HERE */}
          {pagination.totalPages > 1 && (
            <>
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages || 0 }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`px-3 py-2 rounded font-medium transition ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next →
                </button>
              </div>

              <div className="mt-4 text-center text-gray-600">
                <p>
                  Page <span className="font-bold text-orange-500">{currentPage}</span> of{' '}
                  <span className="font-bold text-orange-500">{pagination.totalPages || 0}</span> •{' '}
                  <span className="font-bold text-orange-500">{pagination.totalProducts || 0}</span> {selectedCategory === 'All' ? 'products total' : `${selectedCategory} products`}
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

// Cart Page
const CartPage = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQty, cartTotal } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center py-16">
        <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => onNavigate('home')}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        onClick={() => onNavigate('home')}
        className="text-orange-500 font-bold hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Products
      </button>

      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        <div className="lg:col-span-2 ">
          {cart.map(item => {
            const productId = item.productId?._id || item.productId || item.id || item._id;
            const itemTitle = item.productId?.title || item.title || 'Unknown Product';
            const itemImage = item.productId?.image || item.image;
            const itemPrice = item.price;
            const itemQuantity = item.quantity || 1;

            console.log('Rendering cart item:', { productId, itemTitle, itemQuantity });
            return (
              <div key={productId} className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-4 rounded-lg shadow mb-4 flex gap-4">
                <img src={itemImage} alt={itemTitle} className="w-24 h-24 object-contain" onClick={() => onNavigate('product-detail', productId)} />
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{itemTitle}</h3>
                  <p className="text-green-600 text-sm mb-2">In Stock</p>
                  <p className="text-xl font-bold mb-2">${itemPrice}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border rounded">
                      <button
                        onClick={() => updateQty(productId, (itemQuantity || 1) - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4">{itemQuantity}</span>
                      <button
                        onClick={() => updateQty(productId, (itemQuantity || 1) + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(productId)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-24 bg-gradient-to-br from-orange-50 via-white to-amber-50 border border-orange-200">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0)} items)</span>
                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wishlist Page
const WishlistPage = ({ onNavigate }) => {
  const { wishlist, removeFromWishlist } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center py-16">
        <Heart size={64} className="mx-auto  mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
       <button
          onClick={() => onNavigate('home')}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        onClick={() => onNavigate('home')}
        className="text-orange-500 font-bold hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Products
      </button>

      <h2 className="text-3xl font-bold mb-6">My Wishlist ({wishlist.length})</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist
        .filter(product => product && product._id) // Filter out any null/undefined products
        .map(product => (
          <ProductCard key={product.id || product._id} product={product} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};

// Product Detail Page
const ProductDetailPage = ({ productId, onNavigate }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('Loading product with ID:', productId);
        setLoading(true);
        const data = await api.getProductById(productId);
        const productData = data.product || data;
        console.log('Loaded product:', productData);
        setProduct(productData);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center py-16">
        <p className="text-xl text-red-600 mb-4">Product not found</p>
        <p className="text-gray-600 mb-4">Product ID: {productId}</p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

const handleAddToCart = () => {
  // ✅ FIX: Pass productId, not the entire product object
  const id = product._id || product.id;
  for (let i = 0; i < quantity; i++) {
    addToCart(id, 1);
  }
  alert(`Added ${quantity} item(s) to cart`);
};

  const avgRating = product.rating?.rate || product.rating || 0;
  const productIDForWishlist = product._id || product.id;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button
        onClick={() => onNavigate('home')}
        className="text-orange-500 hover:underline mb-6 flex items-center gap-2"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex items-center justify-center bg-gray-50 rounded">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-contain p-4"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.floor(avgRating) ? "#fbbf24" : "none"}
                  className="text-yellow-400"
                />
              ))}
            </div>
            <span className="text-gray-600">({product.rating?.count || 0} reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-orange-500">${product.price}</span>
            <p className="text-gray-600 mt-2 text-lg">{product.category}</p>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100"
              >
                <Minus size={20} />
              </button>
              <span className="px-6 text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="p-3 border rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Heart
                size={24}
                fill={isInWishlist(productIDForWishlist) ? "#f97316" : "none"}
                className={isInWishlist(productIDForWishlist) ? "text-orange-500" : "text-gray-600"}
              />
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="text-green-700 font-semibold">✓ Free Shipping on orders over $50</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div className="space-y-3 text-gray-700">
          <p><span className="font-semibold">Category:</span> {product.category}</p>
          <p><span className="font-semibold">Price:</span> ${product.price}</p>
          <p><span className="font-semibold">Rating:</span> {avgRating}/5 ({product.rating?.count || 0} reviews)</p>
          <p><span className="font-semibold">Description:</span> {product.description}</p>
        </div>
      </div>
    </div>
  );
};

// Checkout Page
const CheckoutPage = ({ onNavigate }) => {
  const { cart, cartTotal, setCart } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  // ✅ FIX: Correct validation for cart items
  const validateCart = async () => {
    try {
      console.log('🔍 Validating cart items...');
      console.log('Cart items:', cart);

      for (const item of cart) {
        // ✅ Get productId correctly from cart item structure
        const productId = item.productId?._id || item.productId || item._id || item.id;
        
        console.log('Validating product:', productId, 'item structure:', item);
        
        if (!productId) {
          throw new Error(`Invalid product ID in cart`);
        }
        
        // ✅ Verify product exists in backend
        try {
          const response = await api.getProductById(productId);
          console.log('✅ Product validated:', productId, 'response:', response);
          
          if (!response.product) {
            throw new Error(`Product ${item.title || 'Unknown'} is no longer available`);
          }
        } catch (productError) {
          console.error('❌ Product validation failed:', productId, productError);
          throw new Error(`Product validation failed: ${productError.message}`);
        }
      }
      
      console.log('✅ All products validated successfully');
      return true;
    } catch (err) {
      console.error('❌ Cart validation error:', err);
      setError('Cart validation failed: ' + err.message);
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('📋 Starting order placement...');

      // ✅ Validate cart before placing order
      const isValid = await validateCart();
      if (!isValid) {
        console.error('❌ Cart validation failed');
        setLoading(false);
        return;
      }

      // ✅ Build order data with correct product IDs
      const orderData = {
        items: cart.map(item => {
          // ✅ Extract productId from cart item structure
          const productId = item.productId?._id || item.productId || item._id || item.id;
          
          console.log('📦 Order item - productId:', productId, 'item:', item);
          
          return {
            productId: productId.toString(),
            title: item.title || item.productId?.title,
            quantity: item.quantity || 1,
            price: item.price
          };
        }),
        shippingAddress: address,
        paymentMethod: paymentMethod,
        totalAmount: cartTotal
      };

      console.log('🛒 Placing order with data:', orderData);

      const response = await api.createOrder(orderData);
      
      console.log('✅ Order response:', response);
      
      if (response.success) {
        alert('✅ Order placed successfully!\nOrder ID: ' + (response.order?._id || response.order?.id || 'N/A'));
        setCart([]);
        localStorage.removeItem('cart');
        const orderId = response.order?._id || response.order?.id || 'N/A';
        alert(`✅ Order placed successfully!\n\nOrder ID: ${orderId}\n\nThank you for your purchase!`);
        
        // ✅ Redirect to orders page
        setTimeout(() => {
          onNavigate('orders');
        }, 500);
      } else {
        const errorMsg = response.message || 'Unknown error occurred';
        setError('Failed to place order: ' + errorMsg);
        console.error('❌ Order creation failed:', errorMsg);
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setError('Failed to place order: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center py-16">
        <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => onNavigate('home')}
          className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      
      {/* ✅ Display error if any */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
          <div className="flex gap-3">
            <span className="text-red-600 font-semibold text-lg">⚠️</span>
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex-1 h-2 rounded ${s <= step ? 'bg-orange-500' : 'bg-gray-300'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin size={24} className='text-orange-500' />
            Shipping Address
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({...address, street: e.target.value})}
              className="text-gray-900 border-2 border-orange-200 p-3 rounded-lg col-span-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              className="text-gray-900 border-2 border-orange-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})}
              className="text-gray-900 border-2 border-orange-200 p-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={address.zipCode}
              onChange={(e) => setAddress({...address, zipCode: e.target.value})}
              className="text-gray-900 border-2 border-orange-200 p-3 rounded-lg col-span-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
          
          <button
            onClick={() => setStep(2)}
            disabled={!address.street || !address.city || !address.state || !address.zipCode}
            className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard size={24} fill="white"className='text-blue-500' />
            Payment Method
          </h3>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-gray-50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <CreditCard size={20} fill='white' className='text-blue-500' />
              <span>Credit/Debit Card</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-gray-50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <Package size={20} fill="#E6BD7A" className='text-[#825E24]' />
              <span>Cash on Delivery</span>
            </label>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
  <div className="max-w-4xl mx-auto">
    <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white p-8 rounded-3xl shadow-2xl mb-8">
      <h3 className="text-3xl font-bold flex items-center gap-3">
        <div className="w-3 h-3 bg-white rounded-full" />
        Review Your Order
      </h3>
      <p className="text-orange-100 mt-2">Please verify all details before placing your order</p>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: Items & Address */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Shipping Address Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-xl border border-blue-100">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Shipping Address
          </h4>
          <div className="space-y-3 text-gray-700">
            <p className="text-lg font-semibold text-gray-900">{address.street}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              Estimated delivery: 3-5 business days
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            ✎ Edit Address
          </button>
        </div>

        {/* Payment Method Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border border-purple-100">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            Payment Method
          </h4>
          <div className="bg-white/70 rounded-xl p-4 border-2 border-purple-200">
            {paymentMethod === 'card' ? (
              <div className="flex items-center gap-3">
                <CreditCard size={24} className="text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600">Secure payment</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Package size={24} className="text-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when you receive</p>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm"
          >
            ✎ Change Payment
          </button>
        </div>

        {/* Order Items Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            Order Items ({cart.length})
          </h4>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {cart.map((item, idx) => {
              const itemTitle = item.title || item.productId?.title || 'Unknown Product';
              const itemId = item.productId?._id || item.productId || item._id || item.id;
              const quantity = item.quantity || 1;
              const itemImage = item.productId?.image || item.image;
              
              return (
                <div key={itemId} className="group hover:shadow-lg transition-all bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 hover:border-orange-200">
                  <div className="flex gap-4 items-start">
                    {itemImage && (
                      <img 
                        src={itemImage} 
                        alt={itemTitle}
                        className="w-16 h-16 object-contain rounded-lg bg-white p-1"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-2">{itemTitle}</p>
                      <p className="text-sm text-gray-600 mt-1">Qty: {quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">${item.price}</p>
                      <p className="text-sm text-gray-600">Subtotal: ${(item.price * quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  {idx < cart.length - 1 && <div className="border-t border-orange-200 mt-3" />}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('cart')}
            className="mt-6 text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-2"
          >
            ← Edit Cart
          </button>
        </div>

      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 shadow-xl border border-orange-200">
          <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            Order Summary
          </h4>

          <div className="space-y-4 mb-6 pb-6 border-b-2 border-orange-200">
            <div className="flex justify-between text-gray-700">
              <span className="text-sm">Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="text-sm flex items-center gap-1">
                <Package size={14} />
                Shipping
              </span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="text-sm">Tax (Estimated)</span>
              <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-baseline">
              <span className="text-white font-semibold">Total</span>
              <span className="text-2xl font-extrabold text-white">
                ${(cartTotal * 1.1).toFixed(2)}
              </span>
            </div>
            <p className="text-orange-100 text-xs mt-2">Including estimated tax</p>
          </div>

          {/* Trust Badges */}
          <div className="space-y-3 mb-6 pb-6 border-b border-orange-200">
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="text-xs text-gray-700">Secure checkout</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="text-xs text-gray-700">30-day returns</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span className="text-xs text-gray-700">24/7 support</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-xl hover:from-orange-600 hover:to-amber-600 font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>✓ Place Order</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>

            <button
              onClick={() => setStep(2)}
              disabled={loading}
              className="w-full border-2 border-orange-300 text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 font-semibold transition-all"
            >
              ← Back
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// Main App Component
function AppContent() {
  const [currentPage, setCurrentPage] = useState(()=> {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage || 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState(()=> {
    const savedProductId = localStorage.getItem('selectedProductId');
    return savedProductId || null;
  });

  const [showOrderModal, setShowOrderModal] = useState(null);
  const { user, setUser, setCart, setWishlist } = useApp();


  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedProductId) {
      localStorage.setItem('selectedProductId', selectedProductId);
    }
  }, [selectedProductId]);

  const handleNavigate = (page, productId) => {
    console.log('Navigating to:', page, 'with productId:', productId);
    
    if (page === 'orders' && !user) {
      console.warn('⚠️ Cannot navigate to orders - user not logged in');
      alert('Please login to view your orders');
      setCurrentPage('auth');
      return;
    }

    if (page === 'product-detail' && productId) {
      setSelectedProductId(productId);
      setCurrentPage(page);
    }else{
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setUser(null);
    setCart([]); // ✅ Clear cart
    setWishlist([]); // ✅ Clear wishlist
    handleNavigate('auth');
 
  localStorage.removeItem('currentPage');
  localStorage.removeItem('selectedProductId');
  
  handleNavigate('auth');

  };
  return (
    <div className="flex flex-col min-h-screen ">
      
      <Header 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
      {currentPage === 'auth' && <AuthPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
      {currentPage === 'wishlist' && <WishlistPage onNavigate={handleNavigate} />}
      {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
      {currentPage === 'orders' && <OrdersPage onNavigate={handleNavigate} />}
      {currentPage === 'product-detail' && <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />}
      
      </main>


      <footer className="flex-shrink-0 bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 Amazon Clone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Export with Provider Wrapper
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
