const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// ✅ Public routes - NO authentication needed
router.get('/', getProducts);
router.get('/:id', getProductById);

// ✅ Admin routes - User must be logged in AND be admin
router.post('/', protect, adminAuth, createProduct);
router.put('/:id', protect, adminAuth, updateProduct);
router.delete('/:id', protect, adminAuth, deleteProduct);

module.exports = router;