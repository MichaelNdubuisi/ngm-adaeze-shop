require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const paystackWebhook = require('./routes/paystackWebhook'); // Webhook
const paymentProofRoutes = require('./routes/paymentProofRoutes');
const app = express();

// Middleware to handle raw body for webhook
app.use(
  '/api/paystack/webhook',
  express.json({ verify: (req, res, buf) => { req.rawBody = buf; } })
);

// General middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());

// ✅ Serve uploaded images statically (works in dev & production)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS setup
const allowedOrigins = [
  'http://localhost:3000', // dev
  'https://ngm-adaeze-shop.vercel.app', // Vercel frontend
  'https://ngm-adaeze-shop-he05eoge8-michaels-projects-2c53cb3e.vercel.app', // Old Vercel URL
  'https://ngm-adaeze-shop-nz0zxmywk-michaels-projects-2c53cb3e.vercel.app' // New Vercel URL
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // server-to-server requests
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'CORS policy: this origin is not allowed';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/paystack/webhook', paystackWebhook);
app.use('/api/payment-proofs', paymentProofRoutes);

// ✅ Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/build', 'index.html'));
  });
}

// Root test route
app.get('/api', (req, res) => {
  res.send('API is running...');
});

// Placeholder image route
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  // Simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">No Image</text>
    </svg>
  `;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// MongoDB connection & server startup
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mrmichaelndubuisi:Adaezegift@cluster0.6ay5ink.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
