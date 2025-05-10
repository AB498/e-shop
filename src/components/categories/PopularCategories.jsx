"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { getResponsiveTextClass } from '@/utils/responsiveUtils';

const PopularCategories = () => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  // Responsive visible categories based on screen size
  const [visibleCategories, setVisibleCategories] = useState(3);
  // Track if we're at the beginning or end of the carousel
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  // Track screen width for responsive design
  const [screenWidth, setScreenWidth] = useState(0);
  // Number of cards to scroll at once (can be adjusted for smoother or faster scrolling)
  const scrollStep = 1; // Scroll one card at a time

  // Add CSS rule for WebKit browsers (Chrome, Safari)
  useEffect(() => {
    // Add a style tag to hide WebKit scrollbars
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .webkit-scrollbar-hidden::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      // Clean up on unmount
      document.head.removeChild(styleTag);
    };
  }, []);

  // Function to check and update scroll position state
  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;

      // Check if at start (with small buffer for rounding errors)
      setIsAtStart(scrollLeft <= 10);

      // Check if at end (with small buffer for rounding errors)
      setIsAtEnd(scrollLeft >= maxScroll - 10);
    }
  };

  // Update visible categories based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);

      if (width < 480) {
        // Show just 1 category on small mobile
        setVisibleCategories(1.2);
      } else if (width < 640) {
        // Show 1.5 categories on medium mobile
        setVisibleCategories(1.5);
      } else if (width < 768) {
        // Show 2 categories on larger mobile devices
        setVisibleCategories(2);
      } else if (width < 1024) {
        // Show 3 categories on tablets
        setVisibleCategories(3);
      } else {
        // Show 4 categories on desktop
        setVisibleCategories(4);
      }

      // Reset scroll position when window is resized to avoid invalid states
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
        updateScrollState();
      }
    };

    // Set initial screen width
    if (typeof window !== 'undefined') {
      // Initial call
      handleResize();

      // Add event listener
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Add scroll event listener to track scroll position
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        updateScrollState();
      };

      scrollContainer.addEventListener('scroll', handleScroll);

      // Initial check
      updateScrollState();

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  // Category data based on Figma design
  const categories = [
    {
      id: 1,
      name: "Hot Offers",
      image: "/images/categories/popular/hot-offers.png",
      subcategories: [
        "Offer 1",
        "Offer 2",
        "Offer 3",
        "Offer 4",
        "Offer 5"
      ]
    },
    {
      id: 2,
      name: "Top Brands",
      image: "/images/categories/popular/top-brands.png",
      subcategories: [
        "Brand 1",
        "Brand 2",
        "Brand 3",
        "Brand 4"
      ]
    },
    {
      id: 3,
      name: "Makeup",
      image: "/images/categories/popular/makeup.png",
      subcategories: [
        "Lipstick",
        "Foundation",
        "Mascara",
        "Eyeliner",
        "Blush",
        "Compact Powder"
      ]
    },
    {
      id: 4,
      name: "Health and beauty",
      image: "/images/categories/popular/health-beauty.png",
      subcategories: [
        "Skincare",
        "Supplements",
        "Hygiene Products",
        "Body Care",
        "Oral Care",
        "Wellness Essentials"
      ]
    }
  ];

  // Total number of categories
  const totalCategories = categories.length;

  // Handle next slide - scroll by a fixed distance
  const nextSlide = () => {
    if (scrollContainerRef.current && !isAtEnd) {
      // Calculate the width of a single card including gap
      const containerWidth = scrollContainerRef.current.clientWidth;
      const cardWidth = containerWidth / visibleCategories;
      const scrollDistance = cardWidth * scrollStep; // Scroll by scrollStep cards at once

      // Get the maximum scroll amount
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

      // Calculate new scroll position
      let newScrollPosition = scrollContainerRef.current.scrollLeft + scrollDistance;

      // If we're at the end, stop at the maximum scroll position
      if (newScrollPosition >= maxScroll - 10) { // Adding a small buffer for rounding errors
        newScrollPosition = maxScroll;
      }

      // Smooth scroll to the new position
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle previous slide - scroll by a fixed distance
  const prevSlide = () => {
    if (scrollContainerRef.current && !isAtStart) {
      // Calculate the width of a single card including gap
      const containerWidth = scrollContainerRef.current.clientWidth;
      const cardWidth = containerWidth / visibleCategories;
      const scrollDistance = cardWidth * scrollStep; // Scroll by scrollStep cards at once

      // Calculate new scroll position
      let newScrollPosition = scrollContainerRef.current.scrollLeft - scrollDistance;

      // If we're at the beginning, stop at position 0
      if (newScrollPosition <= 10) { // Adding a small buffer for rounding errors
        newScrollPosition = 0;
      }

      // Smooth scroll to the new position
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="container mx-auto py-4 sm:py-6 md:py-10">
      {/* Section title */}
      <div className="flex items-center justify-start mb-3 sm:mb-4 md:mb-6 relative h-7 sm:h-8 md:h-10 gap-2 md:gap-4">
        <h2 className={getResponsiveTextClass('xl', { weight: 'font-semibold' })}>Popular Categories</h2>
      </div>

      {/* Categories Container with Overflow Hidden */}
      <div className="relative">
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="relative w-full left-0 p-0.5 xs:p-1 sm:p-2 overflow-x-scroll webkit-scrollbar-hidden"
        >
          {/* Categories Flex Container */}
          <div
            ref={containerRef}
            className="flex gap-2 xs:gap-3 sm:gap-4 md:gap-6 flex-nowrap w-full"
            style={{
              width: `calc(${totalCategories} * (100% / ${visibleCategories}))`,
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="basis-[25%] flex flex-row bg-white rounded-[8px] xs:rounded-[10px] sm:rounded-[20px] shadow-md overflow-hidden hover:shadow-lg transition-shadow flex-none"
                style={{ width: `calc((100% / ${visibleCategories}) - ${(visibleCategories - 1) * 3 / visibleCategories}px)` }}
              >
                {/* Category Image */}
                <div className="relative w-1/3">
                  <div className="absolute inset-0 bg-[#B74B4B] rounded-[8px] sm:rounded-[10px]"></div>
                  <div className="relative w-full h-full min-h-[120px] xs:min-h-[140px] sm:min-h-[180px] md:min-h-[200px]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded-[8px] sm:rounded-[10px]"
                      sizes="(max-width: 480px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                    />
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-2 xs:p-3 sm:p-4 md:p-5 flex-grow">
                  <h3 className={getResponsiveTextClass('base', { weight: 'font-semibold' }) + ' mb-1 sm:mb-2 md:mb-3'}>{category.name}</h3>
                  <ul className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
                    {category.subcategories.slice(0, screenWidth < 480 ? 3 : category.subcategories.length).map((subcategory, index) => (
                      <li
                        key={index}
                        className={getResponsiveTextClass('xs', { color: 'text-[#535353]' }) + ' hover:text-black transition-colors cursor-pointer'}
                      >
                        {subcategory}
                      </li>
                    ))}
                    {screenWidth > 0 && screenWidth < 480 && category.subcategories.length > 3 && (
                      <li className={getResponsiveTextClass('xs', { color: 'text-[#B74B4B]', weight: 'font-medium' }) + ' cursor-pointer'}>
                        + {category.subcategories.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`hidden sm:flex absolute left-0 top-1/2 transform -translate-x-1/3 sm:-translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-[5px] sm:rounded-[7px] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md transition-colors ${
            isAtStart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
          }`}
          aria-label="Previous categories"
          disabled={isAtStart}
        >
          <Image
            src="/images/categories/popular/chevron-left.png"
            alt="Previous"
            width={16}
            height={16}
            className={`sm:w-5 sm:h-5 ${isAtStart ? 'opacity-50' : ''}`}
          />
        </button>

        <button
          onClick={nextSlide}
          className={`hidden sm:flex absolute right-0 top-1/2 transform translate-x-1/3 sm:translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-[5px] sm:rounded-[7px] w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md transition-colors ${
            isAtEnd ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
          }`}
          aria-label="Next categories"
          disabled={isAtEnd}
        >
          <Image
            src="/images/categories/popular/chevron-right.png"
            alt="Next"
            width={16}
            height={16}
            className={`sm:w-5 sm:h-5 ${isAtEnd ? 'opacity-50' : ''}`}
          />
        </button>
      </div>


    </section>
  );
};

export default PopularCategories;