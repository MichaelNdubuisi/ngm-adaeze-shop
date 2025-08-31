import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', id });
  };

  const handleIncrement = (id) => {
    const item = cart.items.find(i => i._id === id);
    if (item) {
      dispatch({ type: 'ADD_TO_CART', product: item });
    }
  };

  const handleDecrement = (id) => {
    const item = cart.items.find(i => i._id === id);
    if (item && item.quantity > 1) {
      dispatch({ type: 'DECREMENT_QUANTITY', id });
    } else {
      handleRemove(id);
    }
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (cart.items.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <div className="container mx-auto py-6 sm:py-8 px-2 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Your Cart</h2>
      {cart.items.length === 0 ? (
        <div className="text-center text-gray-600">Your cart is empty.</div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 sm:p-4 rounded shadow">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded" />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => handleDecrement(item._id)} className="px-2 py-1 bg-gray-200 rounded text-xs">-</button>
                      <span className="text-xs sm:text-sm">{item.quantity}</span>
                      <button onClick={() => handleIncrement(item._id)} className="px-2 py-1 bg-gray-200 rounded text-xs">+</button>
                    </div>
                    <div className="text-gray-800 font-bold text-sm sm:text-base mt-1">₦{item.price}</div>
                  </div>
                </div>
                <button onClick={() => handleRemove(item._id)} className="mt-2 sm:mt-0 bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 text-xs sm:text-base">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <div className="text-xl font-semibold">Total: <span className="text-black">₦{total.toFixed(2)}</span></div>
            <div className="flex gap-2">
              <button onClick={handleClearCart} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-black transition-colors">Clear Cart</button>
              <button onClick={handleProceedToCheckout} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
