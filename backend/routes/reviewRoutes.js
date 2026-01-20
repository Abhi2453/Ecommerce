const express = require('express');
const router = express.Router();
const { 
  getReviews, 
  createReview, 
  updateReview, 
  deleteReview 
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// ✅ Public route
router.get('/', getReviews);

// ✅ Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;