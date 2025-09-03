import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import AdminProofs from './pages/AdminProofs';
import AdminLogin from './pages/AdminLogin';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proofs"
            element={
              <ProtectedRoute>
                <AdminProofs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
