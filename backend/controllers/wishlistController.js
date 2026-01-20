const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// ✅ Get wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');

    if (!wishlist) {
      wishlist = { products: [] };
    }

    res.status(200).json({
      success: true,
      wishlist: wishlist.products || [],
    });
  } catch (error) {
    console.error('❌ Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
    });
  }
});

// ✅ Add to wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
    }

    // Check if product already in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();
    await wishlist.populate('products');

    console.log('✅ Item added to wishlist');

    res.status(200).json({
      success: true,
      wishlist: wishlist.products,
    });
  } catch (error) {
    console.error('❌ Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
    });
  }
});

// ✅ Remove from wishlist
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);

    await wishlist.save();
    await wishlist.populate('products');

    console.log('✅ Item removed from wishlist');

    res.status(200).json({
      success: true,
      wishlist: wishlist.products,
    });
  } catch (error) {
    console.error('❌ Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
    });
  }
});