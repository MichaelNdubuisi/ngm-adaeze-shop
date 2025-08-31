import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [sizeError, setSizeError] = React.useState('');

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/products/${id}`)
      .then(res => res.json().then(responseData => ({ ok: res.ok, responseData })))
      .then(({ ok, responseData }) => {
        if (!ok) throw new Error(responseData.message || 'Product not found');
        // The backend wraps the actual product data in a 'data' property
        if (responseData.success && responseData.data) {
          setProduct(responseData.data);
        } else {
          throw new Error('Invalid product data format');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Product not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <>
      <Helmet>
        <title>Product Details | Your E-commerce Store</title>
        <meta name="description" content="View product details, images, and pricing at Your E-commerce Store. Shop now for the best deals on quality products." />
        <meta name="keywords" content="product, details, ecommerce, shop, buy, online store" />
        <meta property="og:title" content="Product Details | Your E-commerce Store" />
        <meta property="og:description" content="View product details, images, and pricing at Your E-commerce Store." />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://yourdomain.com/products/${id}`} />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="container mx-auto py-6 sm:py-12 flex flex-col md:flex-row gap-6 sm:gap-8 px-2 sm:px-0">
        <img src={product.image} alt={product.name} className="w-full md:w-1/2 h-64 sm:h-96 object-cover rounded-lg shadow-md mb-4 md:mb-0" />
        <div className="flex-1">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">{product.name}</h1>
          <p className="text-base sm:text-lg mb-1 sm:mb-2">Brand: <span className="font-semibold">{product.brand}</span></p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">₦{product.price}</p>
          <p className="mb-4 sm:mb-6 text-gray-700 text-sm sm:text-base">{product.description}</p>
          {/* Size dropdown for clothes/shoes */}
          {(product.category === 'clothes' || product.category === 'shoes') && (
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1 text-gray-700">Size</label>
            <select
              className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
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
        <button
          onClick={() => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
              navigate('/login');
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
          }}
          className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
        >
          Add to Cart
        </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
