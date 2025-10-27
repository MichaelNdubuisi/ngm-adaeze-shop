import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { useCart } from '../contexts/CartContext';
import API_BASE_URL from '../api'; // ✅ Import the API base URL

const Products = () => {
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categories = ['clothes', 'shoes', 'shorts', 'electronics', 'other'];
  const categoryParam = searchParams.get('category') || 'clothes';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

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

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // Check if a specific category is selected
  const isCategorySelected = searchParams.has('category');

  return (
    <>
      <Helmet>
        <title>{isCategorySelected ? `${selectedCategory} Products | NGM & Luxury Shop` : 'All Products | NGM & Luxury Shop'}</title>
        <meta name="description" content={isCategorySelected ? `Browse ${selectedCategory} products at NGM & Luxury Shop.` : "Browse all luxury products at NGM & Luxury Shop. Shop premium clothes, shoes, electronics, and more at affordable prices."} />
        <meta name="keywords" content="luxury products, shop, ecommerce, clothes, shoes, electronics, online store, NGM luxury" />
        <meta property="og:title" content={isCategorySelected ? `${selectedCategory} Products | NGM & Luxury Shop` : 'All Products | NGM & Luxury Shop'} />
        <meta property="og:description" content={isCategorySelected ? `Browse ${selectedCategory} products at NGM & Luxury Shop.` : "Browse all luxury products at NGM & Luxury Shop."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ngm-adaeze-shop.vercel.app/products" />
        <meta property="og:image" content="https://ngm-adaeze-shop.vercel.app/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container mx-auto py-6 sm:py-8 px-2 sm:px-0">
        {!isCategorySelected && (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Our Products</h2>

            {/* Category Navigation */}
            <div className="mb-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-4">
                  Shop by Category
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Explore our premium collections, each crafted to bring luxury and style to your lifestyle
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {categories.map((cat, index) => {
                  const categoryIcons = {
                    clothes: '👔',
                    shoes: '👠',
                    shorts: '👖',
                    electronics: '💻',
                    other: '⌚'
                  };

                  const categoryNames = {
                    clothes: 'Fashion & Apparel',
                    shoes: 'Footwear',
                    shorts: 'Activewear',
                    electronics: 'Electronics',
                    other: 'Accessories'
                  };

                  const categoryDescriptions = {
                    clothes: 'Premium clothing for every occasion',
                    shoes: 'Stylish footwear for all seasons',
                    shorts: 'Comfortable active and casual wear',
                    electronics: 'Latest tech gadgets and devices',
                    other: 'Luxury accessories and essentials'
                  };

                  return (
                    <button
                      key={cat}
                      onClick={() => navigate(`/products?category=${cat}`)}
                      className={`group relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border overflow-hidden ${
                        selectedCategory === cat
                          ? 'ring-4 ring-blue-500 shadow-2xl border-blue-200'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Subtle Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Icon with Enhanced Animation */}
                      <div className="relative mb-6">
                        <div className={`text-6xl mb-3 transition-all duration-500 transform ${
                          selectedCategory === cat
                            ? 'scale-110 animate-pulse'
                            : 'group-hover:scale-110 group-hover:rotate-3'
                        }`}>
                          {categoryIcons[cat]}
                        </div>
                        <div className={`w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto transition-opacity duration-500 ${
                          selectedCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}></div>
                      </div>

                      {/* Category Name */}
                      <h3 className={`relative font-bold mb-2 transition-colors duration-300 text-lg ${
                        selectedCategory === cat
                          ? 'text-slate-900'
                          : 'text-slate-900 group-hover:text-slate-700'
                      }`}>
                        {categoryNames[cat]}
                      </h3>

                      {/* Category Description */}
                      <p className={`text-sm transition-colors duration-300 ${
                        selectedCategory === cat
                          ? 'text-slate-600'
                          : 'text-slate-600 group-hover:text-slate-500'
                      }`}>
                        {categoryDescriptions[cat]}
                      </p>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500"></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Products Section */}
        <div>
          {isCategorySelected && (
            <h3 className="text-xl font-bold mb-4 capitalize border-b pb-1 border-gray-200">
              {selectedCategory} Products
            </h3>
          )}

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
