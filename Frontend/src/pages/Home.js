import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import bg1 from '../assets/images/bg1.jpg';
import bg2 from '../assets/images/bg2.jpg';
import bg3 from '../assets/images/bg3.jpg';
import ProductList from '../components/ProductList';
import API_BASE_URL from '../api';

const bannerImages = [bg1, bg2, bg3];
const bannerContent = [
  {
    title: "Welcome to NGM & Luxury! 👋",
    description: "Discover extraordinary luxury products, carefully curated just for you. Your journey to elegance starts here! ✨",
    buttonText: "Start Shopping 🛍️",
    link: "/products"
  },
  {
    title: "Elevate Your Style 🌟",
    description: "Experience timeless elegance with our exclusive collections. Make every moment unforgettable with premium quality.",
    buttonText: "Explore Collections 👗",
    link: "/products?category=watches"
  },
  {
    title: "Luxury Redefined 💎",
    description: "Indulge in sophistication and comfort. Your perfect style companion awaits in our premium selection.",
    buttonText: "Discover Luxury 👜",
    link: "/products?category=handbags"
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerIndex, setBannerIndex] = useState(0);

  const categories = [
    { name: 'All Products', value: 'all', icon: '🛍️' },
    { name: 'Clothing', value: 'clothes', icon: '👕' },
    { name: 'Shoes', value: 'shoes', icon: '👟' },
    { name: 'Phones', value: 'phone', icon: '📱' },
    { name: 'Electronics', value: 'electronics', icon: '💻' },
    { name: 'Accessories', value: 'other', icon: '⌚' }
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

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

const getRandomFeaturedProducts = (products, count) => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
        <meta property="og:url" content="https://ngm-luxury.com/" />
        <meta property="og:image" content="https://ngm-luxury.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100">
        {/* Hero Banner */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          {bannerImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                bannerIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={img}
                alt={`Banner ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
            </div>
          ))}
          
          {/* Banner Content */}
          <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl mx-auto">
              {bannerContent.map((content, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
                    bannerIndex === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 md:mb-6 leading-tight">
                    {content.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                    {content.description}
                  </p>
                  <Link
                    to={content.link}
                    className="btn-primary text-lg px-8 py-4 animate-bounce-gentle"
                  >
                    {content.buttonText}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Banner Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {bannerImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setBannerIndex(idx)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  bannerIndex === idx
                    ? 'bg-white scale-110 shadow-lg'
                    : 'bg-white/50 border border-white/30'
                }`}
              />
            ))}
          </div>
        </section>

         {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="section-title">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.value}
                  to={`/products?category=${category.value}`}
                  className="card p-6 text-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="section-title">Featured Products</h2>
            <ProductList products={getRandomFeaturedProducts(products, 3)} onAddToCart={() => {}} />
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
              <ProductList products={products} onAddToCart={() => {}} />
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
