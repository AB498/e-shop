'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import StarRating from '@/components/ui/StarRating';
import PriceRangeFilterWrapper from './PriceRangeFilterWrapper';
import CheckboxFilterWrapper from './CheckboxFilterWrapper';

const ProductSidebar = ({ category }) => {
  // Get search params for filtering
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get('categoryId');

  // Function to preserve existing query parameters when changing category
  const getCategoryUrl = (categoryId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('categoryId', categoryId);
    params.set('page', '1'); // Reset to page 1 when changing category
    return `/products?${params.toString()}`;
  };

  // State for categories and new products
  const [categories, setCategories] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // If we have a category prop but no categoryId in URL, find the matching category
  const [matchingCategoryId, setMatchingCategoryId] = useState(null);

  useEffect(() => {
    if (category && !currentCategoryId && categories.length > 0) {
      // Find the category ID that matches the category name
      const matchingCategory = categories.find(cat =>
        cat.name.toLowerCase() === category.toLowerCase()
      );

      if (matchingCategory) {
        setMatchingCategoryId(matchingCategory.id.toString());
      }
    }
  }, [category, categories, currentCategoryId]);



  // Color filter options
  const colorOptions = [
    { value: 'red', label: 'Red', count: 56 },
    { value: 'green', label: 'Green', count: 78 },
    { value: 'blue', label: 'Blue', count: 54 }
  ];

  // Condition filter options
  const conditionOptions = [
    { value: 'new', label: 'New', count: 1506 },
    { value: 'refurbished', label: 'Refurbished', count: 27 },
    { value: 'thai', label: 'Thai Products', count: 45 }
  ];

  // Fetch categories and new products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        setIsLoadingCategories(true);
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData || []);
        setIsLoadingCategories(false);

        // Fetch new products
        setIsLoadingProducts(true);
        const productsResponse = await fetch('/api/products/new?limit=3');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch new products');
        }
        const productsData = await productsResponse.json();
        setNewProducts(productsData.products || []);
        setIsLoadingProducts(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoadingCategories(false);
        setIsLoadingProducts(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-72 flex-shrink-0">

      {/* Category */}
      <div className="bg-white rounded-[15px] p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] mb-6 border border-[#ECECEC]">
        <div className="border-b border-[#ECECEC] mb-4">
          <h3 className="text-[#253D4E] text-2xl font-bold mb-2">Category</h3>
          <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
        </div>

        <div className="space-y-3">
          {isLoadingCategories ? (
            <div className="py-4 text-center text-[#7E7E7E]">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="py-4 text-center text-[#7E7E7E]">No categories found</div>
          ) : (
            categories.map((category, index) => {
              // Array of SVG icons to cycle through for categories
              const categoryIcons = [
                // Icon 1: Circle with inner circle
                <svg key="icon1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#3BB77E" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.93 19.07L7.76 16.24" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.24 7.76L19.07 4.93" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                // Icon 2: Briefcase with plus
                <svg key="icon2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11V17" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 14H15" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                // Icon 3: Bottle
                <svg key="icon3" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22H15C16.1046 22 17 21.1046 17 20V8L14 2H10L7 8V20C7 21.1046 7.89543 22 9 22Z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 8H17" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12V18" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 15H15" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                // Icon 4: Circle with plus
                <svg key="icon4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8V16" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 12H16" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>,
                // Icon 5: Connected circles
                <svg key="icon5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14C20.6569 14 22 12.6569 22 11C22 9.34315 20.6569 8 19 8C17.3431 8 16 9.34315 16 11C16 12.6569 17.3431 14 19 14Z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 22C6.65685 22 8 20.6569 8 19C8 17.3431 6.65685 16 5 16C3.34315 16 2 17.3431 2 19C2 20.6569 3.34315 22 5 22Z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 8C6.65685 8 8 6.65685 8 5C8 3.34315 6.65685 2 5 2C3.34315 2 2 3.34315 2 5C2 6.65685 3.34315 8 5 8Z" stroke="#FDC040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.13 16.03L18.87 13.96" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.13 7.96L18.87 10.04" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ];

              return (
                <Link
                  key={category.id}
                  href={getCategoryUrl(category.id)}
                  className="block"
                >
                  <div className={`flex justify-between items-center p-3 border border-[#F2F3F4] rounded-md hover:bg-[#F9F9F9] transition-colors ${currentCategoryId === category.id.toString() || matchingCategoryId === category.id.toString() ? 'bg-[#F9F9F9]' : ''
                    }`}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex-shrink-0">
                        {categoryIcons[index % categoryIcons.length]}
                      </div>
                      <span className={`text-[#253D4E] text-sm ${currentCategoryId === category.id.toString() || matchingCategoryId === category.id.toString() ? 'font-semibold text-[#006B51]' : ''
                        }`}>{category.name}</span>
                    </div>
                    <div className="bg-[#BCE3C9] text-[#253D4E] text-xs px-2 py-1 rounded-full">
                      {Math.floor(Math.random() * 30) + 5}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Filter by Price */}
      <div className="bg-white rounded-[15px] p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] mb-6 border border-[#ECECEC]">
        <div className="border-b border-[#ECECEC] mb-4">
          <h3 className="text-[#253D4E] text-2xl font-bold mb-2">Filter by price</h3>
          <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
        </div>

        {/* Price Range Filter Component */}
        <PriceRangeFilterWrapper />

        {/* Color Filter */}
        <div className="mb-6">
          <h4 className="text-[#7E7E7E] font-extrabold text-sm mb-3">Color</h4>
          <CheckboxFilterWrapper title="Color" type="color" options={colorOptions} />
        </div>

        {/* Item Condition Filter */}
        <div className="mb-4">
          <h4 className="text-[#7E7E7E] font-extrabold text-sm mb-3">Item Condition</h4>
          <CheckboxFilterWrapper title="Item Condition" type="condition" options={conditionOptions} />
        </div>

        {/* Clear All Filters Button */}
        <Link
          href={category ? `/products?categoryId=${currentCategoryId || matchingCategoryId || ''}` : '/products'}
          className="w-full bg-[#006B51] text-white font-bold text-xs tracking-wider py-2 px-4 rounded-full flex items-center justify-center hover:bg-[#005541] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          CLEAR FILTERS
        </Link>
      </div>


      {/* New Products */}
      <div className="bg-white rounded-[15px] p-5 shadow-[5px_5px_15px_0px_rgba(0,0,0,0.05)] mb-6 border border-[#ECECEC]">
        <div className="border-b border-[#ECECEC] mb-4">
          <h3 className="text-[#253D4E] text-2xl font-bold mb-2">New products</h3>
          <div className="w-12 h-1 bg-[#BCE3C9] mb-2"></div>
        </div>

        {isLoadingProducts ? (
          <div className="py-4 text-center text-[#7E7E7E]">Loading new products...</div>
        ) : newProducts.length === 0 ? (
          <div className="py-4 text-center text-[#7E7E7E]">No new products found</div>
        ) : (
          <>
            {newProducts.map((product, index) => (
              <div
                key={product.id}
                className={`${index < newProducts.length - 1
                    ? "border-b border-dashed border-[rgba(0,0,0,0.15)] pb-4 mb-4"
                    : ""
                  }`}
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-[#F0EEED] rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={product.image || "/images/product-image.png"} // fallback image
                      alt={product.name} // alt tag for accessibility
                      fill // this tells Next.js to fill the parent container
                      className="object-cover" // maintain aspect ratio and cover box
                    />
                  </div>


                  <div>
                    <Link href={`/products/${product.id}`}>
                      <h4 className="text-[#3BB77E] font-bold text-base mb-1 hover:underline">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-[#7E7E7E] text-base">${parseFloat(product.price).toFixed(2)}</p>
                    <div className="flex mt-1">
                      <StarRating
                        rating={parseFloat(product.rating) || 4.0}
                        reviewCount={product.reviewCount || 0}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSidebar;
