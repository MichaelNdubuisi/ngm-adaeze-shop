import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCart }) => {
  // Defensive: always treat products as an array
  const safeProducts = Array.isArray(products) ? products : [];
  if (safeProducts.length === 0) {
    return (
      <div className="w-full text-center text-gray-500 py-8 text-lg">
        No products found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
      {safeProducts.map(product => (
        <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;
