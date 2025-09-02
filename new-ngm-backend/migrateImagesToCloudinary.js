require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const cloudinary = require('./utils/cloudinary');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://ngm-adaeze-shop.onrender.com'
  : 'http://localhost:5000';

async function migrateImagesToCloudinary() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mrmichaelndubuisi:Adaezegift@cluster0.6ay5ink.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);

    // Find products with local image URLs
    const products = await Product.find({
      image: { $regex: '^' + baseUrl + '/uploads/' }
    });

    console.log(`Found ${products.length} products with local images to migrate.`);

    for (const product of products) {
      try {
        const imagePath = product.image.replace(baseUrl, '');
        const localPath = path.join(__dirname, imagePath);

        // Check if local file exists
        if (fs.existsSync(localPath)) {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'ngm-adaeze-shop',
          });

          // Update product image URL
          product.image = result.secure_url;
          await product.save();

          console.log(`✅ Migrated product ${product._id}: ${product.name} - ${result.secure_url}`);

          // Optionally delete local file
          // fs.unlinkSync(localPath);
        } else {
          console.warn(`⚠️ Local file not found for product ${product._id}: ${localPath}`);
        }
      } catch (err) {
        console.error(`❌ Failed to migrate product ${product._id}:`, err.message);
      }
    }

    console.log('✅ Image migration completed.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

migrateImagesToCloudinary();
