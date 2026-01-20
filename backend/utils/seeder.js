const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const seedProducts = [
  {
    title: 'Wilson Evolution Basketball',
    description: 'Professional basketball with superior grip and durability',
    price: 49.99,
    category: 'Sports',
    image: 'https://au.wilson.com/cdn/shop/products/517ec795eeaa19d1526456cd1ff7fb0ae2fca3cf_19_0214_Evolution_Campaign_Toolkit_Alt_Images_Evo_2_FNL_1024x1024.jpg?v=1675723235',
    stock: 50,
    rating: { rate: 4.5, count: 120 }
  },
  {
    title: 'Nike Air Max 270',
    description: 'Comfortable and stylish running shoes',
    price: 129.99,
    category: 'Sports',
    image: 'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/aee6b5e9-a5ee-4bc3-8427-3095ade69faf/AIR+MAX+270.png',
    stock: 40,
    rating: { rate: 4.6, count: 220 }
  },
  {
    title: 'Adidas Ultraboost 22',
    description: 'High-performance athletic shoes',
    price: 189.99,
    category: 'Sports',
    image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRxsq-qInC-rcqROO9jlSXdPGa84azwd87x0gUXOq9J90ip1EWHTGxChZ_EkVLJSCjukTMqWBg4BVYN60P0f2KsTifToAhHVQdoK10sa9Ip4f0IlkDy3YjXjA',
    stock: 35,
    rating: { rate: 4.7, count: 150 }
  },
  {
    title: 'Yonex Carbonex Badminton Racket',
    description: 'Lightweight racket for professional play',
    price: 89.99,
    category: 'Sports',
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS6gj_zd5G8fIpZNgU1T-eN4KZWBOBgAih6yXNgP2Npi7eTF0kKTr7g8CTLi4UVG6amO3heZ3xmkY_gWSoBP5ysZX-JpIld4qt1a-dZZQAtPUqqIC_Y7CCpLso',
    stock: 25,
    rating: { rate: 4.4, count: 90 }
  },
  {
    title: 'Spalding NBA Street Basketball',
    description: 'Durable outdoor basketball',
    price: 34.99,
    category: 'Sports',
    image: 'https://m.media-amazon.com/images/I/812Vme+pC8L.jpg',
    stock: 60,
    rating: { rate: 4.3, count: 110 }
  },

  {
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    price: 399.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/31BXEEUVfFL._SY300_SX300_QL70_FMwebp_.jpg',
    stock: 30,
    rating: { rate: 4.7, count: 180 }
  },
  {
    title: 'Apple iPhone 15 Pro',
    description: 'Latest Apple smartphone with advanced features',
    price: 999.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/81SigpJN1KL._SX679_.jpg',
    stock: 20,
    rating: { rate: 4.9, count: 500 }
  },
  {
    title: 'MacBook Pro 16-inch M3',
    description: 'Powerful laptop for professionals and creators',
    price: 2499.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/31u-F873NQL._SY300_SX300_QL70_FMwebp_.jpg',
    stock: 10,
    rating: { rate: 4.8, count: 300 }
  },
  {
    title: 'Samsung 55-inch QLED 4K TV',
    description: '4K Ultra HD Smart Television',
    price: 799.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/416xyibjbJL._SX300_SY300_QL70_FMwebp_.jpg',
    stock: 8,
    rating: { rate: 4.6, count: 280 }
  },
  {
    title: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Powerful cordless vacuum with laser dust detection',
    price: 749.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/61bXGHeYuhL._SX679_.jpg',
    stock: 15,
    rating: { rate: 4.8, count: 250 }
  },

  {
    title: 'Apple Watch Series 9',
    description: 'Advanced health tracking smartwatch',
    price: 429.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/31Cud2WnszL._SY300_SX300_QL70_FMwebp_.jpg',
    stock: 25,
    rating: { rate: 4.7, count: 410 }
  },
  {
    title: 'Bose SoundLink Revolve+',
    description: 'Portable Bluetooth speaker with 360° sound',
    price: 329.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/41bLwWM8SdL._SY300_SX300_QL70_FMwebp_.jpg',
    stock: 18,
    rating: { rate: 4.6, count: 200 }
  },
  {
    title: 'Canon EOS R50 Mirrorless Camera',
    description: 'Compact mirrorless camera for creators',
    price: 679.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/41po0Y8FRnL._SX300_SY300_QL70_FMwebp_.jpg',
    stock: 12,
    rating: { rate: 4.5, count: 95 }
  },
  {
    title: 'Logitech MX Master 3S Mouse',
    description: 'Advanced wireless mouse for productivity',
    price: 99.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SX679_.jpg',
    stock: 45,
    rating: { rate: 4.8, count: 600 }
  },

  {
    title: 'Amazon Echo (5th Gen)',
    description: 'Smart speaker with Alexa',
    price: 99.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/71xoR4A6q-L._AC_SX679_.jpg',
    stock: 55,
    rating: { rate: 4.4, count: 900 }
  },
  {
    title: 'Kindle Paperwhite (11th Gen)',
    description: 'Waterproof e-reader with glare-free display',
    price: 149.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/41OLK5di8gL._SY300_SX300_QL70_FMwebp_.jpg',
    stock: 28,
    rating: { rate: 4.8, count: 1200 }
  },
  {
    title: 'Sony PlayStation 5',
    description: 'Next-gen gaming console',
    price: 499.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/619BkvKW35L._AC_SX679_.jpg',
    stock: 7,
    rating: { rate: 4.9, count: 1500 }
  },
  {
    title: 'Xbox Series X',
    description: 'Powerful gaming console with 4K gaming',
    price: 499.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/61JGKhqxHxL._AC_SX679_.jpg',
    stock: 9,
    rating: { rate: 4.8, count: 1300 }
  },
  {
    title: 'HP Pavilion Gaming Laptop',
    description: 'Gaming laptop with high performance graphics',
    price: 1099.99,
    category: 'Electronics',
    image: 'https://m.media-amazon.com/images/I/51DmOWr3rnL._SX522_.jpg',
    stock: 11,
    rating: { rate: 4.5, count: 320 }
  }
];

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️ Clearing old products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} products`);

    console.log('📝 Seeding new products...');
    const result = await Product.insertMany(seedProducts);
    console.log(`✅ Seeded ${result.length} products\n`);

    console.log('📦 Created Products:');
    result.forEach(p => {
      console.log(`   ✓ ${p.title}`);
      console.log(`     _id: ${p._id}`);
      console.log(`     Price: $${p.price}`);
      console.log(`     Category: ${p.category}\n`);
    });

    await mongoose.disconnect();
    console.log('✅ Done! Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();