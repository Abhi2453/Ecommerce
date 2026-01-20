const Order = require('../models/Order');
const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/asyncHandler');

// ✅ Create order
exports.createOrder = asyncHandler(async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address and payment method',
      });
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending',
    });

    // ✅ Clear cart after order
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    console.log('✅ Order created:', order._id);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
    });
  }
});

// ✅ Get all orders (user's orders)
exports.getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.productId');

    console.log('✅ Orders retrieved:', orders.length);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
    });
  }
});

// ✅ Get single order by ID
exports.getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // ✅ Check if order belongs to user
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    console.log('✅ Order retrieved:', order._id);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('❌ Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
    });
  }
});

// ✅ Update order status (admin only)
exports.updateOrder = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order status',
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.productId');

    console.log('✅ Order updated:', order._id, 'Status:', status);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('❌ Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
    });
  }
});

// ✅ Delete order (admin only)
exports.deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    console.log('✅ Order deleted:', order._id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
    });
  }
});