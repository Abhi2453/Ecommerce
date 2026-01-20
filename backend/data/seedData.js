const products = [
  {
    title: "Apple iPhone 15 Pro Max - 256GB",
    price: 1199.99,
    description: "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system. Features include Dynamic Island, always-on display, and ProMotion technology.",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1696446702183-cbd49ce7e00d?w=400&h=400&fit=crop"
    ],
    stock: 50,
    rating: { rate: 4.8, count: 2847 },
    specifications: {
      screen: "6.7 inch",
      storage: "256GB",
      ram: "8GB",
      battery: "4422 mAh"
    },
    tags: ["smartphone", "5G", "premium"],
    isActive: true
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    price: 399.99,
    description: "Industry-leading noise cancellation with exceptional sound quality. Features 30-hour battery life and premium comfort.",
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop"
    ],
    stock: 75,
    rating: { rate: 4.7, count: 1923 },
    specifications: {
      type: "Over-ear",
      connectivity: "Bluetooth 5.2",
      battery: "30 hours",
      noiseCancellation: "Yes"
    },
    tags: ["headphones", "noise-cancelling", "wireless"],
    isActive: true
  },
  {
    title: "Samsung 65\" 4K QLED Smart TV",
    price: 1299.99,
    description: "Stunning 4K display with Quantum Dot technology and smart features. Includes HDR10+ support and gaming mode.",
    category: "Electronics",
    subcategory: "Television",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop"
    ],
    stock: 30,
    rating: { rate: 4.6, count: 1456 },
    specifications: {
      screenSize: "65 inch",
      resolution: "4K UHD",
      smartTV: "Yes",
      hdr: "HDR10+"
    },
    tags: ["tv", "4k", "smart-tv"],
    isActive: true
  },
  {
    title: "MacBook Pro 16\" M3 Max",
    price: 2499.99,
    description: "Professional laptop with M3 Max chip, brilliant display, and all-day battery. Perfect for creative professionals.",
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
    ],
    stock: 25,
    rating: { rate: 4.9, count: 3201 },
    specifications: {
      processor: "M3 Max",
      ram: "36GB",
      storage: "1TB SSD",
      display: "16.2 inch Liquid Retina XDR"
    },
    tags: ["laptop", "professional", "mac"],
    isActive: true
  },
  {
    title: "Nike Air Max 270 Running Shoes",
    price: 149.99,
    description: "Comfortable running shoes with Max Air cushioning and breathable mesh. Perfect for daily training.",
    category: "Fashion",
    subcategory: "Footwear",
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
    ],
    stock: 120,
    rating: { rate: 4.5, count: 892 },
    specifications: {
      type: "Running Shoes",
      material: "Mesh",
      sizes: "US 7-13"
    },
    tags: ["shoes", "running", "sports"],
    isActive: true
  },
  {
    title: "Levi's Men's 501 Original Fit Jeans",
    price: 79.99,
    description: "Classic straight fit jeans with authentic style and durability. The original blue jean since 1873.",
    category: "Fashion",
    subcategory: "Clothing",
    brand: "Levi's",
    images: [
      "https://images.unsplash.com/photo-1542272454315-7f6fabf3b8f8?w=400&h=400&fit=crop"
    ],
    stock: 200,
    rating: { rate: 4.4, count: 1567 },
    specifications: {
      fit: "Straight",
      material: "100% Cotton Denim",
      sizes: "28-40 waist"
    },
    tags: ["jeans", "denim", "classic"],
    isActive: true
  },
  {
    title: "Ray-Ban Aviator Classic Sunglasses",
    price: 169.99,
    description: "Iconic aviator design with 100% UV protection. Timeless style that never goes out of fashion.",
    category: "Fashion",
    subcategory: "Accessories",
    brand: "Ray-Ban",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop"
    ],
    stock: 85,
    rating: { rate: 4.6, count: 2134 },
    specifications: {
      lensType: "Polarized",
      uvProtection: "100%",
      frameType: "Metal"
    },
    tags: ["sunglasses", "eyewear", "classic"],
    isActive: true
  },
  {
    title: "Women's Leather Jacket - Genuine Leather",
    price: 249.99,
    description: "Premium genuine leather jacket with classic biker style. Features asymmetric zipper and multiple pockets.",
    category: "Fashion",
    subcategory: "Outerwear",
    brand: "Premium Leather Co.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"
    ],
    stock: 45,
    rating: { rate: 4.7, count: 678 },
    specifications: {
      material: "Genuine Leather",
      lining: "Polyester",
      sizes: "XS-XXL"
    },
    tags: ["jacket", "leather", "women"],
    isActive: true
  },
  {
    title: "KitchenAid Stand Mixer - 5 Quart",
    price: 449.99,
    description: "Professional-grade stand mixer with 10 speeds and multiple attachments. Perfect for baking enthusiasts.",
    category: "Home & Kitchen",
    subcategory: "Kitchen Appliances",
    brand: "KitchenAid",
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop"
    ],
    stock: 40,
    rating: { rate: 4.8, count: 3421 },
    specifications: {
      capacity: "5 Quart",
      speeds: "10",
      power: "325 Watts",
      attachments: "Dough Hook, Whisk, Beater"
    },
    tags: ["mixer", "baking", "kitchen"],
    isActive: true
  },
  {
    title: "Dyson V15 Detect Cordless Vacuum",
    price: 649.99,
    description: "Powerful cordless vacuum with laser dust detection technology. 60 minutes of fade-free power.",
    category: "Home & Kitchen",
    subcategory: "Home Appliances",
    brand: "Dyson",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop"
    ],
    stock: 35,
    rating: { rate: 4.7, count: 2156 },
    specifications: {
      type: "Cordless Stick",
      runtime: "60 minutes",
      filtration: "HEPA",
      dustCapacity: "0.77L"
    },
    tags: ["vacuum", "cordless", "cleaning"],
    isActive: true
  },
  {
    title: "Nespresso Coffee Machine",
    price: 199.99,
    description: "Espresso maker with milk frother for perfect coffee at home. Compatible with Nespresso capsules.",
    category: "Home & Kitchen",
    subcategory: "Coffee Makers",
    brand: "Nespresso",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop"
    ],
    stock: 60,
    rating: { rate: 4.5, count: 1834 },
    specifications: {
      type: "Capsule",
      pressure: "19 bar",
      waterTank: "1L",
      milkFrother: "Yes"
    },
    tags: ["coffee", "espresso", "nespresso"],
    isActive: true
  },
  {
    title: "Instant Pot Duo 8-Quart Multi-Cooker",
    price: 119.99,
    description: "7-in-1 programmable pressure cooker for quick and easy meals. Replaces multiple kitchen appliances.",
    category: "Home & Kitchen",
    subcategory: "Kitchen Appliances",
    brand: "Instant Pot",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop"
    ],
    stock: 90,
    rating: { rate: 4.6, count: 5672 },
    specifications: {
      capacity: "8 Quart",
      functions: "Pressure Cook, Slow Cook, Rice, Yogurt, Steam, Sauté, Warm",
      programs: "13"
    },
    tags: ["pressure-cooker", "multi-cooker", "instant-pot"],
    isActive: true
  },
  {
    title: "Fitbit Charge 6 Fitness Tracker",
    price: 159.99,
    description: "Advanced fitness tracker with heart rate monitoring and GPS. Track your health 24/7.",
    category: "Sports & Outdoors",
    subcategory: "Fitness Trackers",
    brand: "Fitbit",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop"
    ],
    stock: 110,
    rating: { rate: 4.4, count: 2789 },
    specifications: {
      display: "AMOLED",
      battery: "7 days",
      waterResistant: "50m",
      gps: "Built-in"
    },
    tags: ["fitness", "tracker", "health"],
    isActive: true
  },
  {
    title: "Yoga Mat - Extra Thick 8mm",
    price: 39.99,
    description: "Non-slip yoga mat with carrying strap, perfect for all exercises. Eco-friendly TPE material.",
    category: "Sports & Outdoors",
    subcategory: "Yoga",
    brand: "YogaLife",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop"
    ],
    stock: 150,
    rating: { rate: 4.3, count: 1245 },
    specifications: {
      thickness: "8mm",
      material: "TPE",
      dimensions: "183cm x 61cm",
      carrying: "Strap included"
    },
    tags: ["yoga", "mat", "exercise"],
    isActive: true
  },
  {
    title: "Coleman 6-Person Camping Tent",
    price: 189.99,
    description: "Spacious tent with WeatherTec system for dry camping experience. Easy setup with color-coded poles.",
    category: "Sports & Outdoors",
    subcategory: "Camping",
    brand: "Coleman",
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop"
    ],
    stock: 55,
    rating: { rate: 4.5, count: 987 },
    specifications: {
      capacity: "6 Person",
      dimensions: "10ft x 9ft",
      height: "6ft",
      waterproof: "Yes"
    },
    tags: ["camping", "tent", "outdoor"],
    isActive: true
  },
  {
    title: "Wilson Evolution Basketball",
    price: 64.99,
    description: "Official size and weight basketball with superior grip. Used by professionals worldwide.",
    category: "Sports & Outdoors",
    subcategory: "Team Sports",
    brand: "Wilson",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop"
    ],
    stock: 80,
    rating: { rate: 4.7, count: 1456 },
    specifications: {
      size: "Official (29.5\")",
      material: "Composite Leather",
      use: "Indoor",
      grip: "Cushion Core Technology"
    },
    tags: ["basketball", "sports", "wilson"],
    isActive: true
  },
  {
    title: "The Psychology of Money - Book",
    price: 16.99,
    description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. A must-read for financial literacy.",
    category: "Books",
    subcategory: "Finance",
    brand: "Harriman House",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"
    ],
    stock: 200,
    rating: { rate: 4.8, count: 8934 },
    specifications: {
      author: "Morgan Housel",
      pages: "256",
      format: "Paperback",
      language: "English"
    },
    tags: ["book", "finance", "self-help"],
    isActive: true
  },
  {
    title: "Atomic Habits - Hardcover",
    price: 19.99,
    description: "An easy and proven way to build good habits and break bad ones by James Clear.",
    category: "Books",
    subcategory: "Self-Help",
    brand: "Avery",
    images: [
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop"
    ],
    stock: 180,
    rating: { rate: 4.9, count: 12456 },
    specifications: {
      author: "James Clear",
      pages: "320",
      format: "Hardcover",
      language: "English"
    },
    tags: ["book", "habits", "productivity"],
    isActive: true
  },
  {
    title: "LEGO Star Wars Millennium Falcon",
    price: 159.99,
    description: "Build the iconic starship with 1,351 pieces. Includes Han Solo, Chewbacca, and more minifigures.",
    category: "Toys & Games",
    subcategory: "Building Sets",
    brand: "LEGO",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop"
    ],
    stock: 70,
    rating: { rate: 4.9, count: 3421 },
    specifications: {
      pieces: "1351",
      ageRange: "9+",
      dimensions: "84cm length when built",
      minifigures: "7"
    },
    tags: ["lego", "star-wars", "building"],
    isActive: true
  },
  {
    title: "Nintendo Switch OLED Console",
    price: 349.99,
    description: "Gaming console with vibrant OLED screen and enhanced audio. Play at home or on the go.",
    category: "Toys & Games",
    subcategory: "Video Games",
    brand: "Nintendo",
    images: [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop"
    ],
    stock: 45,
    rating: { rate: 4.8, count: 5234 },
    specifications: {
      screen: "7 inch OLED",
      storage: "64GB",
      battery: "4.5-9 hours",
      connectivity: "WiFi, Bluetooth"
    },
    tags: ["nintendo", "gaming", "console"],
    isActive: true
  }
];

module.exports = products;