import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { useCart } from '../contexts/CartContext';
import API_BASE_URL from '../api'; //

const Products = () => {
  const [products, setProducts] = useState([]);
  const { dispatch } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = category
      ? `${API_BASE_URL}/api/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/api/products`;

    fetch(url)
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
  }, [category]);

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All';

  return (
    <>
      <Helmet>
        <title>{categoryName} Products | NGM & Luxury Shop</title>
        <meta name="description" content={`Browse ${categoryName.toLowerCase()} luxury products at NGM & Luxury Shop. Shop premium ${categoryName.toLowerCase()}, shoes, electronics, and more at affordable prices.`} />
        <meta name="keywords" content={`luxury ${categoryName.toLowerCase()}, shop, ecommerce, clothes, shoes, electronics, online store, NGM luxury`} />
        <meta property="og:title" content={`${categoryName} Products | NGM & Luxury Shop`} />
        <meta property="og:description" content={`Browse ${categoryName.toLowerCase()} luxury products at NGM & Luxury Shop.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://ngm-adaeze-shop.vercel.app/products${category ? `?category=${category}` : ''}`} />
        <meta property="og:image" content="https://ngm-adaeze-shop.vercel.app/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="container mx-auto py-6 sm:py-8 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">{categoryName} Products</h2>

        <ProductList
          products={products}
          onAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
};

export default Products;
