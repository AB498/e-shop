'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ProductLeftBar from './ProductLeftBar';
import { getAllCategories, getNewProducts } from '@/lib/actions/products';
import { getProductCountsByCategory } from '@/lib/actions/categories';

const MobileFilterButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [newProducts, setNewProducts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Fetch categories, category counts, and new products
    const fetchData = async () => {
      try {
        const [categoriesData, categoryCountsData, newProductsData] = await Promise.all([
          getAllCategories(),
          getProductCountsByCategory(),
          getNewProducts(3)
        ]);
        setCategories(categoriesData);
        setCategoryCounts(categoryCountsData);
        setNewProducts(newProductsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Prevent body scroll when sidebar is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={toggleSidebar}
        className="w-full bg-[#006B51] text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        FILTERS & CATEGORIES
      </button>

      {/* Mobile Sidebar */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={toggleSidebar}
          ></div>

          {/* Sidebar */}
          <div className="relative w-4/5 max-w-sm bg-white h-full overflow-y-auto shadow-xl transition-transform transform-gpu">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#253D4E]">Filters & Categories</h2>
              <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <ProductLeftBar
                categories={categories}
                categoryCounts={categoryCounts}
                newProducts={newProducts}
                isMobile={true}
              />
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={toggleSidebar}
                className="w-full bg-[#006B51] text-white font-bold py-2 px-4 rounded-lg"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default MobileFilterButton;
