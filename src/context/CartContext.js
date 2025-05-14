'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on initial render (client-side only)
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          setCart([]);
        }
      }
    }
  }, []);

  // Update localStorage and cart metrics whenever cart changes
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Calculate cart count and total in one pass to optimize
      let count = 0;
      let total = 0;

      for (const item of cart) {
        count += item.quantity;
        // Use discounted price if available, otherwise use regular price
        const itemPrice = item.discountPrice ? parseFloat(item.discountPrice) : parseFloat(item.price || 0);
        total += itemPrice * item.quantity;
      }

      // Batch state updates
      setCartCount(count);
      setCartTotal(total);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1, showToast = true) => {
    setCart(prevCart => {
      // Normalize product structure - handle both direct items and items with nested product structure
      const normalizedProduct = product.product && typeof product.product === 'object'
        ? {
            id: product.product.id,
            name: product.product.name,
            price: product.product.price,
            image: product.product.image,
            category: product.product.category?.name || '',
            ...product
          }
        : product;

      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === normalizedProduct.id);

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };

        // Show toast notification for updating quantity if showToast is true
        if (showToast) {
          toast.success(`Updated ${normalizedProduct.name} quantity to ${updatedCart[existingItemIndex].quantity} in cart!`);
        }

        return updatedCart;
      } else {
        // Add new item if product doesn't exist in cart
        // Show toast notification for adding new item if showToast is true
        if (showToast) {
          toast.success(`${normalizedProduct.name} added to cart!`);
        }

        return [...prevCart, { ...normalizedProduct, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    // Find the item before removing it to get its name for the toast
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === productId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart!`);
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.id === productId);

      // Show toast notification for quantity update
      if (itemToUpdate) {
        toast.success(`Updated ${itemToUpdate.name} quantity to ${quantity}!`);
      }

      return prevCart.map(item => {
        if (item.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Clear cart
  const clearCart = () => {
    // Clear cart items
    setCart([]);

    // Reset cart metrics directly to avoid potential race conditions
    setCartCount(0);
    setCartTotal(0);

    // Clear localStorage if in browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }

    // Show toast notification for clearing cart
    toast.success('Cart has been cleared!');
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
