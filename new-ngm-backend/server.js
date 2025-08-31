const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

dotenv.config();

const app = express();

// Middleware to handle raw body for webhook
app.use('/api/paystack/webhook', express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

// General middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/uploads/proofs', express.static(path.join(__dirname, '/uploads/proofs')));

// CORS setup: allow your actual frontend URL
const allowedOrigins = [
  'http://localhost:3000', // dev
  'https://ngm-adaeze-shop-he05eoge8-michaels-projects-2c53cb3e.vercel.app' // Vercel frontend
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

// Serve React frontend (build folder)
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Root test route (optional)
app.get('/api', (req, res) => {
  res.send('API is running...');
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
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
