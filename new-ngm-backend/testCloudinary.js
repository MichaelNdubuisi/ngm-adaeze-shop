require('dotenv').config({ path: __dirname + '/.env' });
const cloudinary = require('./utils/cloudinary');

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary configuration...');

    // Check if environment variables are set
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dbgygjads'; // Use hardcoded fallback
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Not set (using fallback)');
    console.log('API_KEY:', apiKey ? '✅ Set' : '❌ Not set');
    console.log('API_SECRET:', apiSecret ? '✅ Set' : '❌ Not set');

    if (!cloudName || !apiKey || !apiSecret) {
      console.log('\n❌ Cloudinary environment variables are not set!');
      console.log('\nTo set up Cloudinary:');
      console.log('1. Go to https://cloudinary.com/');
      console.log('2. Create a free account');
      console.log('3. Get your Cloud Name, API Key, and API Secret from the dashboard');
      console.log('4. Add these to your .env file:');
      console.log('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
      console.log('   CLOUDINARY_API_KEY=your_api_key');
      console.log('   CLOUDINARY_API_SECRET=your_api_secret');
      return;
    }

    // Test Cloudinary connection
    const result = await cloudinary.api.ping();
    console.log('\n✅ Cloudinary connection successful!');
    console.log('Cloud Name:', result.cloud_name);
    console.log('Status:', result.status);

  } catch (error) {
    console.error('\n❌ Cloudinary test failed:', error.message);
    console.log('\nPlease check your Cloudinary credentials and try again.');
  }
}

testCloudinary();
