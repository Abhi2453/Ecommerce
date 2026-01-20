const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // ✅ Remove productId field - MongoDB automatically creates _id
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    rating: {
      rate: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    stock: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);