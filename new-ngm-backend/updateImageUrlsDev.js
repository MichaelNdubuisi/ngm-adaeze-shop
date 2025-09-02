require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Product = require('./models/productModel');

const productionUrl = 'https://ngm-adaeze-shop.onrender.com';
const devUrl = 'http://localhost:5000';

async function updateImageUrlsForDev() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mrmichaelndubuisi:Adaezegift@cluster0.6ay5ink.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);

    // Find products with production image URLs
    const products = await Product.find({
      image: { $regex: '^' + productionUrl + '/uploads/' }
    });

    console.log(`Found ${products.length} products with production image URLs to update for dev.`);

    for (const product of products) {
      try {
        product.image = product.image.replace(productionUrl, devUrl);
        await product.save();
        console.log(`✅ Updated product ${product._id}: ${product.name}`);
      } catch (err) {
        console.error(`❌ Failed to update product ${product._id}:`, err.message);
      }
    }

    console.log('✅ Image URLs updated for development.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error during URL update:', error);
  }
}

updateImageUrlsForDev();
