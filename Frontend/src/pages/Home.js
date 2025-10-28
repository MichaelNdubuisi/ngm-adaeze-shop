import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import bg1 from '../assets/images/bg1.jpg';
import ProductList from '../components/ProductList';
import API_BASE_URL from '../api';
import { useCart } from '../contexts/CartContext';

export const categories = ['clothes', 'shoes', 'shorts', 'electronics', 'other'];

const bannerImages = [bg1];
const bannerContent = [
  {
    title: "Welcome to NGM & Luxury! 👋",
    description: "Discover extraordinary luxury products, carefully curated just for you. Your journey to elegance starts here! ✨",
    buttonText: "Start Shopping 🛍️",
    link: "/products"
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dispatch } = useCart();
  const categories = [
    { name: 'Clothing', value: 'clothes', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop' },
    { name: 'Shoes', value: 'shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop' },
    { name: 'Phones', value: 'shorts', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop' },
    { name: 'Electronics', value: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop' },
    { name: 'Accessories', value: 'other', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop' }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        // Handle the response structure from responseHelpers
        if (data.success && data.data && Array.isArray(data.data.products)) {
          setProducts(data.data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Oops! We\'re having trouble loading our products. Please refresh the page or try again in a moment. 🔄');
        setLoading(false);
      });
  }, []);



const getRandomFeaturedProducts = (products, count) => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };


  return (
    <>
      <Helmet>
        <title>NGM & Luxury | Premium E-commerce Store</title>
        <meta name="description" content="Shop the latest luxury products, premium clothing, designer accessories, and electronics at NGM & Luxury. Fast shipping, secure checkout, and exceptional quality." />
        <meta name="keywords" content="luxury ecommerce, premium products, designer fashion, electronics, watches, handbags, NGM, luxury brands" />
        <meta property="og:title" content="NGM & Luxury | Premium E-commerce Store" />
        <meta property="og:description" content="Discover exclusive luxury products and premium collections at NGM & Luxury." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ngm-adaeze-shop.vercel.app/" />
        <meta property="og:image" content="https://ngm-adaeze-shop.vercel.app/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Banner */}
        <section className="relative h-[425px] md:h-[400px] lg:h-[400px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={bannerImages[0]}
              alt="Banner 1"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Banner Content */}
          <div className="relative z-20 h-full flex items-center justify-center text-center px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6 leading-tight tracking-tight">
                  {bannerContent[0].title}
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
                  {bannerContent[0].description}
                </p>
                <Link
                  to={bannerContent[0].link}
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 font-semibold text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-slate-900 group-hover:text-white transition-colors duration-300">{bannerContent[0].buttonText}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

         {/* Categories Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-3xl font-playfair font-bold text-slate-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Discover our carefully curated collections, each designed to bring luxury and elegance to your lifestyle
              </p>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category.value}
                  to={`/products?category=${category.value}`}
                  className="group relative rounded-full text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-slate-100 hover:border-slate-200 overflow-hidden aspect-square max-w-[180px] md:max-w-[120px]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image covering the entire card */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/30 md:bg-black/20 rounded-full group-hover:bg-black/10 transition-colors duration-500"></div>

                  {/* Category Name */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="font-semibold text-sm text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/50 transition-all duration-500"></div>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="section-title">Featured Products</h2>
            <ProductList products={getRandomFeaturedProducts(products, 3)} onAddToCart={handleAddToCart} />
          </div>
        </section>

       
        {/* All Products Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title mb-0">All Products</h2>
              <div className="flex gap-4">
                <select className="input-field w-auto">
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="card p-4">
                    <div className="skeleton h-48 rounded-lg mb-4"></div>
                    <div className="skeleton h-6 rounded mb-2"></div>
                    <div className="skeleton h-4 rounded mb-2"></div>
                    <div className="skeleton h-8 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 text-lg mb-4 flex items-center justify-center gap-2">
                  <span className="text-2xl">😕</span>
                  {error}
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary transform hover:scale-105 transition-transform duration-200"
                >
                  Refresh & Try Again 🔄
                </button>
              </div>
            ) : (
              <ProductList products={products} onAddToCart={handleAddToCart} />
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Join Our Luxury Family💌
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Be the first to know about exclusive offers, new arrivals, and style inspiration delivered right to your inbox!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 placeholder-gray-400"
              />
              <button className="btn-primary bg-white text-white hover:bg-gray-100 transform hover:scale-105 transition-transform duration-200">
                Join Now!
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
