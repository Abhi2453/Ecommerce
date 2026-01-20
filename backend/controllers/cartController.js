const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// ✅ Get cart
exports.getCart = asyncHandler(async (req, res) => {
  try {
    console.log('🛒 Getting cart for user:', req.user.id);
    
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

    if (!cart) {
      console.log('ℹ️ Cart not found, returning empty');
      return res.status(200).json({
        success: true,
        cart: [],
      });
    }

    console.log('✅ Cart retrieved:', cart.items?.length || 0, 'items');

    res.status(200).json({
      success: true,
      cart: cart.items || [],
    });
  } catch (error) {
    console.error('❌ Get cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
    });
  }
});

// ✅ Add to cart
exports.addToCart = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    console.log('➕ Adding to cart - Product:', productId, 'Qty:', quantity);

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
      });
    }

    // ✅ Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.error('❌ Product not found:', productId);
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    console.log('✅ Product found:', product.title);

    // ✅ Find or create cart
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      console.log('📦 Creating new cart for user:', req.user.id);
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    console.log('📦 Current cart items:', cart.items.length);

    // ✅ Ensure items array exists
    if (!Array.isArray(cart.items)) {
      console.warn('⚠️ Items is not array, fixing...');
      cart.items = [];
    }

    // ✅ Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      console.log('📝 Item exists, updating quantity');
      cart.items[itemIndex].quantity += parseInt(quantity);
    } else {
      console.log('➕ Adding new item to cart');
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    console.log('✅ Item added to cart, total items:', cart.items.length);

    res.status(200).json({
      success: true,
      cart: cart.items,
    });
  } catch (error) {
    console.error('❌ Add to cart error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
    });
  }
});

// ✅ Remove from cart
// Alternative version with better type handling:

exports.removeFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    console.log('➖ Removing from cart');
    console.log('   productId:', productId, 'type:', typeof productId);
    console.log('   userId:', userId, 'type:', typeof userId);

    // ✅ Ensure productId is a string for comparison
    const productIdStr = productId.toString();

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    console.log('📦 Before: cart has', cart.items.length, 'items');

    // ✅ More robust filtering
    const newItems = [];
    let removed = false;

    for (let item of cart.items) {
      const itemId = item.productId.toString();
      
      if (itemId !== productIdStr) {
        // Keep this item
        newItems.push(item);
      } else {
        // Skip this item (remove it)
        console.log('🗑️ Removing item:', itemId);
        removed = true;
      }
    }

    if (!removed) {
      console.warn('⚠️ Product not found in cart:', productIdStr);
      return res.status(404).json({
        success: false,
        message: 'Product not in cart',
      });
    }

    cart.items = newItems;
    console.log('📦 After: cart has', cart.items.length, 'items');

    // ✅ Save and return
    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({
      success: true,
      cart: cart.items,
    });
  } catch (error) {
    console.error('❌ Remove cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
    });
  }
});

// ...rest of code...

// ✅ Update quantity
exports.updateQuantity = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    console.log('📝 Updating quantity - Product:', productId, 'Qty:', quantity);

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    item.quantity = parseInt(quantity);

    await cart.save();
    await cart.populate('items.productId');

    console.log('✅ Quantity updated');

    res.status(200).json({
      success: true,
      cart: cart.items,
    });
  } catch (error) {
    console.error('❌ Update quantity error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating quantity',
    });
  }
});

// ✅ Clear cart
exports.clearCart = asyncHandler(async (req, res) => {
  try {
    console.log('🗑️ Clearing cart');

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    console.log('✅ Cart cleared');

    res.status(200).json({
      success: true,
      cart: [],
    });
  } catch (error) {
    console.error('❌ Clear cart error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
    });
  }
});