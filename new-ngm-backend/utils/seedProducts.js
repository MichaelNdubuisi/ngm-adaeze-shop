const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/productModel');

dotenv.config({ path: '../.env' });

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://ngm-adaeze-shop.onrender.com'
  : 'http://localhost:5000';

const products = [
  {
    name: 'Elegant Shirt',
    category: 'clothes',
    image: `${baseUrl}/uploads/1752247606434-infinix.jpg`,
    price: 29.99,
    description: 'A stylish and comfortable shirt for all occasions.',
    countInStock: 100,
  },
  {
    name: 'Running Shoes',
    category: 'shoes',
    image: `${baseUrl}/uploads/1752247836911-infinix.jpg`,
    price: 59.99,
    description: 'Lightweight running shoes for daily workouts.',
    countInStock: 50,
  },
  {
    name: 'Smartphone X',
    category: 'electronics',
    image: `${baseUrl}/uploads/1752248159707-infinix.jpg`,
    price: 499.99,
    description: 'Latest smartphone with advanced features.',
    countInStock: 30,
  },
  {
    name: 'Casual Shorts',
    category: 'shorts',
    image: `${baseUrl}/uploads/1752248795465-cloth.jpg`,
    price: 19.99,
    description: 'Comfortable shorts for casual wear.',
    countInStock: 75,
  },
  {
    name: 'Luxury Watch',
    category: 'other',
    image: `${baseUrl}/uploads/1752365124581-Iphone 16.jpg`,
    price: 199.99,
    description: 'Elegant watch to complement your style.',
    countInStock: 20,
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products removed');

    // Insert sample products
    await Product.insertMany(products);
    console.log('Sample products inserted');

    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
