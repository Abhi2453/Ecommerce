const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrder, 
  deleteOrder 
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// ✅ User routes
router.get('/', protect, getOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);

// ✅ Admin routes
router.put('/:id', protect, adminAuth, updateOrder);
router.delete('/:id', protect, adminAuth, deleteOrder);

module.exports = router;