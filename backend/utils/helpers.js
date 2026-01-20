/**
 * Generate unique order number
 * Format: ORD-TIMESTAMP-RANDOM
 * @returns {String} Order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Calculate pagination metadata
 * @param {Number} totalItems - Total number of items
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMetadata = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Format currency to INR
 * @param {Number} amount - Amount to format
 * @returns {String} Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculate discount percentage
 * @param {Number} originalPrice - Original price
 * @param {Number} discountPrice - Discounted price
 * @returns {Number} Discount percentage
 */
const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

/**
 * Sanitize search query
 * @param {String} query - Search query
 * @returns {String} Sanitized query
 */
const sanitizeSearchQuery = (query) => {
  if (!query) return '';
  return query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Generate slug from string
 * @param {String} text - Text to convert to slug
 * @returns {String} Slug
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} True if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} True if valid
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate random alphanumeric string
 * @param {Number} length - Length of string
 * @returns {String} Random string
 */
const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substr(2, length).toUpperCase();
};

/**
 * Calculate estimated delivery date
 * @param {Number} days - Number of days for delivery
 * @returns {Date} Estimated delivery date
 */
const calculateDeliveryDate = (days = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @returns {String} Formatted date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate order summary
 * @param {Array} items - Order items
 * @returns {Object} Order summary
 */
const calculateOrderSummary = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

module.exports = {
  generateOrderNumber,
  getPaginationMetadata,
  formatCurrency,
  calculateDiscountPercentage,
  sanitizeSearchQuery,
  generateSlug,
  isValidEmail,
  isValidPhone,
  generateRandomString,
  calculateDeliveryDate,
  formatDate,
  calculateOrderSummary
};