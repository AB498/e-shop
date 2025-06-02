'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CategoryChips = ({ categories: propCategories = null, size = 'medium', className = '', showOnMobile = true, showOnDesktop = true }) => {
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loading, setLoading] = useState(propCategories === null);
  const scrollContainerRef = useRef(null);

  // Determine which categories to use - props or fetched
  const categories = propCategories || fetchedCategories;

  // Fetch categories only if not provided as props
  useEffect(() => {
    if (propCategories === null) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories');
          if (response.ok) {
            const data = await response.json();
            setFetchedCategories(data);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCategories();
    }
  }, [propCategories]);

  // Ensure scrollbar is hidden immediately on mount and when categories change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Apply additional styles to ensure scrollbar is hidden
      container.style.scrollbarWidth = 'none';
      container.style.msOverflowStyle = 'none';
      // Add webkit scrollbar hiding
      container.style.setProperty('-webkit-overflow-scrolling', 'touch');
    }
  }, [loading, categories]);

  // Apply scrollbar hiding styles immediately on ref assignment
  const scrollContainerRefCallback = (element) => {
    scrollContainerRef.current = element;
    if (element) {
      element.style.scrollbarWidth = 'none';
      element.style.msOverflowStyle = 'none';
      element.style.setProperty('-webkit-overflow-scrolling', 'touch');
    }
  };

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'gap-1.5',
      chip: 'px-2.5 py-1 text-xs',
      text: 'text-xs',
      icon: 'w-3 h-3',
      iconGap: 'gap-1.5'
    },
    medium: {
      container: 'gap-2',
      chip: 'px-3 py-1.5 text-sm',
      text: 'text-sm',
      icon: 'w-4 h-4',
      iconGap: 'gap-2'
    },
    large: {
      container: 'gap-2.5',
      chip: 'px-4 py-2 text-base',
      text: 'text-base',
      icon: 'w-5 h-5',
      iconGap: 'gap-2'
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Responsive visibility classes
  const visibilityClasses = [];
  if (!showOnMobile) visibilityClasses.push('hidden md:flex');
  if (!showOnDesktop) visibilityClasses.push('md:hidden');
  if (showOnMobile && showOnDesktop) visibilityClasses.push('flex');

  if (loading) {
    return (
      <div
        ref={scrollContainerRefCallback}
        className={`${visibilityClasses.join(' ')} overflow-x-auto scrollbar-hide ${className}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className={`flex ${config.container} min-w-max`}>
          {/* Loading skeleton */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`${config.chip} bg-gray-200 rounded-full animate-pulse flex-shrink-0 flex items-center ${config.iconGap}`}
            >
              <div className={`${config.icon} bg-gray-300 rounded-full`}></div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollContainerRefCallback}
      className={`${visibilityClasses.join(' ')} overflow-x-auto scrollbar-hide ${className}`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className={`flex ${config.container} min-w-max`}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className={`
              ${config.chip}
              bg-white border border-[#E3E3E3] rounded-full
              hover:bg-[#006B51] hover:text-white hover:border-[#006B51]
              transition-all duration-200 ease-in-out
              font-medium text-[#253D4E]
              whitespace-nowrap
              shadow-sm hover:shadow-md
              flex-shrink-0
              flex items-center ${config.iconGap}
            `}
          >
            {category.image && (
              <div className={`${config.icon} relative flex-shrink-0`}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </div>
            )}
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;
