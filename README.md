# 📚 README - Amazon Clone E-Commerce Application

## 🎯 Project Overview

A full-stack e-commerce application built with React and Node.js, featuring product browsing, shopping cart, wishlist, order management, and user authentication.

---

## 🛠 Tech Stack

### **Frontend**
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

### **Deployment**
- **Render** - Frontend (Static Site) & Backend (Web Service)

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation & Setup

### **1. Clone the Repository**

````bash
git clone <your-repo-url>
cd "Final ecommerce"
````

### **2. Backend Setup**

Navigate to the backend folder:

````bash
cd backend
````

**Install dependencies:**

````bash
npm install
````

**Create `.env` file** in the backend folder:

````dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ubgrvb7.mongodb.net/?appName=Cluster0
JWT_SECRET=my-ecommerce-secret-key-2024
NODE_ENV=development
SEED_DB=true
````

**Replace `<username>` and `<password>` with your MongoDB credentials.**

**Seed the database (optional):**

````bash
npm run seed
````

**Start the backend server:**

````bash
npm start
````

Server will run on `http://localhost:5000`

---

### **3. Frontend Setup**

In a new terminal, navigate to the frontend folder:

````bash
cd Ecommerce
````

**Install dependencies:**

````bash
npm install
````

**Create `.env` file** in the Ecommerce folder:

````dotenv
VITE_API_URL=http://localhost:5000
````

**Start the development server:**

````bash
npm run dev
````

Frontend will run on `http://localhost:5173`

---

## 📱 Available Scripts

### **Frontend Scripts**

````bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
````

### **Backend Scripts**

````bash
# Start server
npm start

# Development with auto-reload (requires nodemon)
npm run dev

# Seed database
npm run seed
````

---

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### **Products**
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get single product

### **Cart**
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add to cart (Protected)
- `DELETE /api/cart/:productId` - Remove from cart (Protected)
- `PUT /api/cart/:productId` - Update quantity (Protected)

### **Wishlist**
- `GET /api/wishlist` - Get user wishlist (Protected)
- `POST /api/wishlist` - Add to wishlist (Protected)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (Protected)

### **Orders**
- `GET /api/orders` - Get user orders (Protected)
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/:id` - Get order details (Protected)

---

## 🔐 Authentication

The app uses **JWT (JSON Web Tokens)** for authentication:

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Token sent with each protected API request in `Authorization` header

**Protected Routes:**
- `/cart`
- `/wishlist`
- `/checkout`
- `/orders`

---

## 🗄️ Database Models

### **User**
- Email, password, name, address

### **Product**
- Title, description, price, image, category, rating

### **Cart**
- User ID, product ID, quantity

### **Wishlist**
- User ID, product IDs array

### **Order**
- User ID, items, shipping address, payment method, status

---

## 🚢 Deployment to Render

### **Deploy Backend (Web Service)**

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **New** → **Web Service**
4. Connect GitHub repository
5. Set configurations:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   - `PORT=5000`
   - `MONGODB_URI=<your-uri>`
   - `JWT_SECRET=<your-secret>`
   - `NODE_ENV=production`
7. Deploy

### **Deploy Frontend (Static Site)**

1. Go to Render Dashboard
2. Click **New** → **Static Site**
3. Connect GitHub repository
4. Set configurations:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. Add Environment Variable:
   - `VITE_API_URL=https://your-backend-service.onrender.com`
6. Deploy

---

## 🔧 Environment Variables Reference

### **Backend (.env)**

````dotenv
PORT=5000                                          # Server port
MONGODB_URI=mongodb+srv://...                      # MongoDB connection string
JWT_SECRET=your-secret-key                         # JWT secret key
NODE_ENV=development|production                    # Environment mode
SEED_DB=true|false                                 # Auto-seed database on startup
````

### **Frontend (.env)**

````dotenv
VITE_API_URL=http://localhost:5000                 # Backend API URL (dev)
# For production:
VITE_API_URL=https://your-backend.onrender.com    # Render backend URL
````

---

## 📂 Project Structure

````
Final ecommerce/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── server.js         # Main server file
│   └── package.json
│
└── Ecommerce/
    ├── src/
    │   ├── api/          # API client (axios)
    │   ├── App.jsx       # Main component
    │   ├── main.jsx      # Entry point
    │   └── index.css     # Global styles
    ├── public/           # Static assets
    ├── .env              # Environment variables
    ├── vite.config.js    # Vite configuration
    ├── tailwind.config.js # Tailwind configuration
    └── package.json
````

---

## 🐛 Troubleshooting

### **Port Already in Use**
````bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
````

### **MongoDB Connection Error**
- Check MongoDB URI in `.env`
- Ensure MongoDB is running
- Verify network access in MongoDB Atlas

### **CORS Error**
- Check backend CORS configuration in `server.js`
- Ensure frontend URL is in allowed origins

### **Vite Build Issues**
````bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
````

---

## 📖 Features

✅ User authentication (Register/Login)  
✅ Browse products with pagination  
✅ Search products  
✅ Filter by category  
✅ Sort products (price, rating, popularity)  
✅ Add to cart  
✅ Add to wishlist  
✅ View cart with quantity management  
✅ Checkout with shipping address  
✅ Order placement  
✅ Order tracking  
✅ Responsive design  
✅ Tailwind CSS styling  

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoints documentation
3. Check browser console for errors
4. Check server logs for backend errors

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Happy Coding!

Built with ❤️ using React, Node.js,Express.js and MongoDB
