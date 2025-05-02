'use client';
import { createContext, useContext, useState } from 'react';

const ProductQuickViewContext = createContext();

export function ProductQuickViewProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('small');

  const openQuickView = (productData) => {
    setProduct(productData);
    setQuantity(1);
    setSelectedSize('small');
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const changeSize = (size) => {
    setSelectedSize(size);
  };

  return (
    <ProductQuickViewContext.Provider
      value={{
        isOpen,
        product,
        quantity,
        selectedSize,
        openQuickView,
        closeQuickView,
        increaseQuantity,
        decreaseQuantity,
        changeSize
      }}
    >
      {children}
    </ProductQuickViewContext.Provider>
  );
}

export function useProductQuickView() {
  const context = useContext(ProductQuickViewContext);
  if (context === undefined) {
    throw new Error('useProductQuickView must be used within a ProductQuickViewProvider');
  }
  return context;
}
