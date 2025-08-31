import React from 'react';
import { useCart } from '../contexts/CartContext';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = React.useState('');
  const [sizeError, setSizeError] = React.useState('');

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      // You might want to handle login redirection here or show a message
      return;
    }

    if ((product.category === 'clothes' || product.category === 'shoes')) {
      if (!selectedSize) {
        setSizeError('Please select a size');
        return;
      }
      setSizeError('');
      dispatch({ type: 'ADD_TO_CART', product: { ...product, selectedSize } });
    } else {
      dispatch({ type: 'ADD_TO_CART', product });
    }
    
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
            <p className="text-2xl font-bold text-blue-600 mb-4">
              {formatPrice(product.price)}
            </p>

            <p className="text-gray-700 mb-6 text-sm">
              {product.description}
            </p>

            {/* Size selection for clothes/shoes */}
            {(product.category === 'clothes' || product.category === 'shoes') && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Size</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  required
                >
                  <option value="">Select size</option>
                  {(Array.isArray(product.sizes) ? product.sizes : []).map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {sizeError && <span className="text-xs text-red-500">{sizeError}</span>}
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mb-4"
            >
              Add to Cart
            </button>

            {/* Product Features */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Availability:</span>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Shipping:</span>
                <span className="font-semibold">Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
