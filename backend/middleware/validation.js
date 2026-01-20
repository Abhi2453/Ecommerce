const { AppError } = require('./errorHandler');

// Validate registration data
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password', 400));
  }

  if (name.length < 2) {
    return next(new AppError('Name must be at least 2 characters', 400));
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  next();
};

// Validate product data
const validateProduct = (req, res, next) => {
  const { title, description, price, category } = req.body;

  if (!title || !description || !price || !category) {
    return next(new AppError('Please provide title, description, price and category', 400));
  }

  if (price < 0) {
    return next(new AppError('Price cannot be negative', 400));
  }

  next();
};

// Validate order data
const validateOrder = (req, res, next) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError('Order must contain at least one item', 400));
  }

  if (!shippingAddress) {
    return next(new AppError('Shipping address is required', 400));
  }

  const { street, city, state, zipCode, country } = shippingAddress;
  if (!street || !city || !state || !zipCode || !country) {
    return next(new AppError('Complete shipping address is required', 400));
  }

  if (!paymentMethod) {
    return next(new AppError('Payment method is required', 400));
  }

  const validPaymentMethods = ['card', 'cod', 'paypal', 'upi'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return next(new AppError('Invalid payment method', 400));
  }

  next();
};

// Validate review data
const validateReview = (req, res, next) => {
  const { rating } = req.body;

  if (!rating) {
    return next(new AppError('Rating is required', 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5', 400));
  }

  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new AppError('Invalid ID format', 400));
    }
    
    next();
  };
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || page < 1)) {
    return next(new AppError('Invalid page number', 400));
  }

  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return next(new AppError('Limit must be between 1 and 100', 400));
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateReview,
  validateObjectId,
  validatePagination
};