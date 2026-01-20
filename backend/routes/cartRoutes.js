const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// ✅ All routes require authentication
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.put('/:productId', protect, updateQuantity);
router.delete('/', protect, clearCart);

module.exports = router;