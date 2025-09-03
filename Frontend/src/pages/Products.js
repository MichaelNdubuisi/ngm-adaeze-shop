import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ProductList from '../components/ProductList';
import { useCart } from '../contexts/CartContext';
import API_BASE_URL from '../api'; // ✅ Import the API base URL

const Products = () => {
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['clothes', 'shoes', 'shorts', 'electronics', 'other'];
  const [selectedCategory, setSelectedCategory] = useState('clothes');

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        let productsData = [];
        if (data.success && data.data && Array.isArray(data.data.products)) {
          productsData = data.data.products;
        } else if (Array.isArray(data)) {
          productsData = data;
        } else if (data && Array.isArray(data.products)) {
          productsData = data.products;
        }
        // Fix relative image URLs by prepending base URL if needed
        const fixedProducts = productsData.map((product) => {
          if (product.image && product.image.startsWith('/uploads')) {
            return {
              ...product,
              image: `${API_BASE_URL}${product.image}`,
            };
          }
          return product;
        });
        setProducts(fixedProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'An error occurred');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <Helmet>
        <title>All Products | NGM & Luxury Shop</title>
        <meta name="description" content="Browse all luxury products at NGM & Luxury Shop. Shop premium clothes, shoes, electronics, and more at affordable prices." />
        <meta name="keywords" content="luxury products, shop, ecommerce, clothes, shoes, electronics, online store, NGM luxury" />
        <meta property="og:title" content="All Products | NGM & Luxury Shop" />
        <meta property="og:description" content="Browse all luxury products at NGM & Luxury Shop." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ngm-adaeze-shop.vercel.app/products" />
        <meta property="og:image" content="https://ngm-adaeze-shop.vercel.app/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container mx-auto py-6 sm:py-8 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Our Products</h2>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border font-semibold capitalize transition-colors duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Category Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-4 capitalize border-b pb-1 border-gray-200">
            {selectedCategory}
          </h3>

          <ProductList
            products={products.filter(
              (p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase()
            )}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </>
  );
};

export default Products;
