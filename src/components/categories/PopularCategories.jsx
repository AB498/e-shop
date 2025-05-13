"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

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

  // Category data with specific Unsplash images
  const categories = [
    {
      id: 1,
      name: "Hot Offers",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
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
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
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
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
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
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80",
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

  // No need to track total categories here

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
    <section className="container mx-auto py-2 sm:py-3 md:py-4">
      {/* Section title */}
      <div className="flex items-center justify-start mb-1 sm:mb-1.5 md:mb-2 relative h-4 sm:h-5 md:h-6 gap-0.5 md:gap-1">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold">Popular Categories</h2>
      </div>

      {/* Categories Container with Overflow Hidden */}
      <div className="relative">
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="relative w-full left-0 p-0.5 xs:p-0.5 sm:p-0.5 overflow-x-scroll webkit-scrollbar-hidden"
        >
          {/* Categories Flex Container */}
          <div
            ref={containerRef}
            className={`flex gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 flex-nowrap w-full`}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex w-[180px] sm:w-[200px] md:w-[220px] aspect-video bg-white rounded-[4px] xs:rounded-[5px] sm:rounded-[6px] shadow-sm overflow-hidden hover:shadow-md transition-shadow flex-none"
              >
                {/* Category Image */}
                <div className="relative p-2 w-2/5 h-full min-h-[80px] xs:min-h-[90px] sm:min-h-[100px] md:min-h-[110px]">
                  <div className="relative w-full h-full">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded-[4px] sm:rounded-[5px]"
                    />
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-0.5 xs:p-1 sm:p-1.5 md:p-2 grow">
                  <h3 className="text-[10px] xs:text-[11px] sm:text-xs font-semibold mb-0.5">{category.name}</h3>
                  <ul className="space-y-0">
                    {category.subcategories.slice(0, screenWidth < 480 ? 3 : category.subcategories.length).map((subcategory, index) => (
                      <li
                        key={index}
                        className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#535353] hover:text-black transition-colors cursor-pointer"
                      >
                        {subcategory}
                      </li>
                    ))}
                    {screenWidth > 0 && screenWidth < 480 && category.subcategories.length > 3 && (
                      <li className="text-[8px] xs:text-[9px] sm:text-[10px] text-[#B74B4B] font-medium cursor-pointer">
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
          className={`hidden sm:flex absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-sm sm:rounded-[3px] w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-sm transition-colors ${isAtStart ? 'cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
            }`}
          aria-label="Previous categories"
          disabled={isAtStart}
        >

          <svg xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className={`hidden sm:flex absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-sm sm:rounded-[3px] w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-sm transition-colors ${isAtEnd ? 'cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
            }`}
          aria-label="Next categories"
          disabled={isAtEnd}
        >

          <svg xmlns="http://www.w3.org/2000/svg" className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>


    </section>
  );
};

export default PopularCategories;