import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleAddToCart = (product) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    onAddToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  return (
    <div className="card group hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 rounded-t-xl">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="skeleton w-full h-48"></div>
          </div>
        )}
        
        <img
          src={imageError ? '/api/placeholder/300/300' : product.image}
          alt={`${product.name} by ${product.brand}`}
          className={`w-full h-48 object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={() => navigate(`/products/${product._id}`)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') navigate(`/products/${product._id}`);
          }}
          tabIndex={0}
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => navigate(`/products/${product._id}`)}
            className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
          >
            Quick View
          </button>
        </div>

        {/* Brand Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-lg">
          {product.brand}
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg animate-fade-in z-10">
            ✅ Added to cart!
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors duration-200"
          onClick={() => navigate(`/products/${product._id}`)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') navigate(`/products/${product._id}`);
          }}
          tabIndex={0}
        >
          {product.name}
        </h3>

        <p className="text-2xl font-bold text-blue-600 mb-4">
          {formatPrice(product.price)}
        </p>

        {/* Rating (Placeholder) */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">(24 reviews)</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => handleAddToCart(product)}
          className="btn-primary w-full mt-auto py-3 text-sm font-semibold flex items-center justify-center gap-2"
          disabled={showToast}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {showToast ? 'Added!' : 'Add to Cart'}
        </button>

        {/* Additional Features */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            In Stock
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Free Shipping
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
