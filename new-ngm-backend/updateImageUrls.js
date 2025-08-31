const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config();

const updateImageUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const baseUrl = 'https://ngm-adaeze-shop.onrender.com';

    // Update products with relative URLs
    const relativeProducts = await Product.find({ image: { $regex: '^/uploads/' } });
    for (const product of relativeProducts) {
      product.image = `${baseUrl}${product.image}`;
      await product.save();
      console.log(`Updated relative product ${product._id}: ${product.image}`);
    }

    // Update products with localhost URLs to production
    const localhostProducts = await Product.find({ image: { $regex: '^http://localhost:5000/uploads/' } });
    for (const product of localhostProducts) {
      product.image = product.image.replace('http://localhost:5000', baseUrl);
      await product.save();
      console.log(`Updated localhost product ${product._id}: ${product.image}`);
    }

    console.log(`✅ Updated ${relativeProducts.length + localhostProducts.length} products`);
  } catch (error) {
    console.error('❌ Error updating image URLs:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateImageUrls();
