require('dotenv').config({ path: './new-ngm-backend/.env' });
const mongoose = require('mongoose');
const Product = require('./models/productModel');

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://ngm-adaeze-shop.onrender.com'
  : 'http://localhost:5000';

async function updateImageUrls() {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);

    // Update products with relative URLs
    const relativeProducts = await Product.find({ image: { $regex: '^/uploads/' } });
    for (const product of relativeProducts) {
      product.image = baseUrl + product.image;
      await product.save();
      console.log('Updated relative product ' + product._id + ': ' + product.image);
    }

    // Update products with localhost URLs to production
    const localhostProducts = await Product.find({ image: { $regex: '^http://localhost:5000/uploads/' } });
    for (const product of localhostProducts) {
      product.image = product.image.replace('http://localhost:5000', baseUrl);
      await product.save();
      console.log('Updated localhost product ' + product._id + ': ' + product.image);
    }

    console.log('✅ Image URLs updated successfully.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error updating image URLs:', error);
  }
}

updateImageUrls();
