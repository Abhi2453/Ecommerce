const Review = require('../models/Review');
const asyncHandler = require('../middleware/asyncHandler');

// ✅ Get all reviews
exports.getReviews = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.query;

    let query = {};
    if (productId) {
      query.productId = productId;
    }

    const reviews = await Review.find(query)
      .populate('userId', 'name email')
      .populate('productId', 'title');

    console.log('✅ Reviews retrieved:', reviews.length);

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('❌ Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
    });
  }
});

// ✅ Create review
exports.createReview = asyncHandler(async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product ID and rating',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      comment: comment || '',
    });

    await review.populate('userId', 'name email');
    await review.populate('productId', 'title');

    console.log('✅ Review created');

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('❌ Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
    });
  }
});

// ✅ Update review
exports.updateReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // ✅ Check ownership
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate('userId', 'name email').populate('productId', 'title');

    console.log('✅ Review updated');

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('❌ Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
    });
  }
});

// ✅ Delete review
exports.deleteReview = asyncHandler(async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // ✅ Check ownership
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    console.log('✅ Review deleted');

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
    });
  }
});