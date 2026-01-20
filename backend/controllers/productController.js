const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// ✅ Get all products
exports.getProducts = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
    });
  }
});

// ✅ Get product by ID
exports.getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
    });
  }
});

// ✅ Create product
exports.createProduct = asyncHandler(async (req, res) => {
  try {
    const { title, price, description, image, category, stock } = req.body;

    // Validate required fields
    if (!title || !price || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const product = await Product.create({
      title,
      price,
      description,
      image,
      category,
      stock: stock || 0,
    });

    console.log('✅ Product created:', product.title);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
    });
  }
});

// ✅ Update product
exports.updateProduct = asyncHandler(async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    console.log('✅ Product updated:', product.title);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
    });
  }
});

// ✅ Delete product
exports.deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    console.log('✅ Product deleted:', product.title);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
    });
  }
});