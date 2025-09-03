import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import ProofUploadForm from './ProofUploadForm';
import API_BASE_URL from '../api';

const Checkout = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || "");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 5.99;
  const tax = total * 0.08;
  const grandTotal = total + shippingCost + tax;

  const validateShippingForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep(2);
    }
  };

  const handleBackToShipping = () => {
    setStep(1);
  };

  const handleOrderComplete = () => {
    setIsProcessing(true);
    const token = localStorage.getItem('token');
    
    fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({
        items: cart.items,
        name,
        email,
        address,
        city,
        postalCode,
        phone,
        total: grandTotal
      })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.message || 'Order failed');
        setSuccess(true);
        dispatch({ type: 'CLEAR_CART' });
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      })
      .catch(err => {
        setErrors({ payment: err.message || 'Order processing failed' });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  if (cart.items.length === 0 && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart before proceeding to checkout.</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase! Your order has been successfully placed.
                  You will be redirected to your orders page shortly.
                </p>
                <div className="animate-pulse-gentle">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    required
                    placeholder="Street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                    rows={3}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={`input-field ${errors.postalCode ? 'border-red-500' : ''}`}
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Payment</h3>
                  <button
                    onClick={handleBackToShipping}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Back to shipping
                  </button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    <strong>Bank Transfer Payment:</strong> Please transfer the total amount to the account below and upload your payment proof.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium text-gray-900">GIFT ONYINYECHI EZE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium text-gray-900">8114592027</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium text-gray-900">Opay</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-gray-900">₦{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload Payment Proof</h4>
                  <ProofUploadForm
                    defaultName={name}
                    defaultEmail={email}
                    productId={null}
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleOrderComplete}
                      className="btn-primary"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Complete Order'}
                    </button>
                  </div>
                </div>

                {errors.payment && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700 text-sm">{errors.payment}</p>
                  </div>
                )}

                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>🔒 SSL Secured • PCI Compliant • 256-bit Encryption</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₦{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₦{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">₦{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">₦{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">₦{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-6 mb-3">
                <span className="text-2xl">🔒</span>
                <span className="text-2xl">🛡️</span>
                <span className="text-2xl">💳</span>
              </div>
              <p className="text-xs text-gray-600 text-center">
                Your payment is secure and encrypted. We never store your credit card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
