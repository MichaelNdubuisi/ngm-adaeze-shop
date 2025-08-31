import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existing = state.items.find(i => i._id === action.product._id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.product._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(i => i._id !== action.id),
      };
    case 'DECREMENT_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.id ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ cart: state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
