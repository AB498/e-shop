"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const PopularCategories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const totalCategories = 4;
  // Responsive visible categories based on screen size
  const [visibleCategories, setVisibleCategories] = useState(3);

  // Update visible categories based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCategories(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCategories(2);
      } else {
        setVisibleCategories(3);
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
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

  // Handle next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalCategories - visibleCategories ? 0 : prevIndex + 1
    );
  };

  // Handle previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalCategories - visibleCategories : prevIndex - 1
    );
  };

  // Update carousel position when currentIndex changes
  useEffect(() => {
    if (containerRef.current) {
      // Calculate the width of a single category card including gap
      const cardWidth = containerRef.current.offsetWidth / visibleCategories;
      const scrollAmount = currentIndex * cardWidth;
      containerRef.current.style.transform = `translateX(-${scrollAmount}px)`;
    }
  }, [currentIndex, visibleCategories]);

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Section title */}
      <div className="flex items-center justify-start mb-6 relative h-10 gap-4">
        <h2 className="text-2xl font-semibold">Popular Categories</h2>
      </div>

      {/* Categories Container with Overflow Hidden */}
      <div className="relative overflow-hidden">
        {/* Categories Grid */}
        <div
          ref={containerRef}
          className="grid gap-6 transition-transform duration-500 ease-in-out"
          style={{
            gridTemplateColumns: `repeat(${totalCategories}, minmax(0, 1fr))`,
            width: `calc(100% * ${totalCategories / visibleCategories})`,
          }}
        >
          {categories.map((category) => (
            <div key={category.id} className="flex bg-white rounded-[20px] shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
              {/* Category Image */}
              <div className="relative w-1/3 min-w-[120px]">
                <div className="absolute inset-0 bg-[#B74B4B] rounded-[10px]"></div>
                <div className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover rounded-[10px]"
                    sizes="(max-width: 768px) 33vw, 25vw"
                  />
                </div>
              </div>

              {/* Category Content */}
              <div className="p-5 flex-grow">
                <h3 className="font-semibold text-lg mb-3 ">{category.name}</h3>
                <ul className="space-y-1.5">
                  {category.subcategories.map((subcategory, index) => (
                    <li
                      key={index}
                      className="text-[#535353] text-base hover:text-black transition-colors cursor-pointer "
                    >
                      {subcategory}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-[7px] w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Previous categories"
        >
          <Image
            src="/images/categories/popular/chevron-left.png"
            alt="Previous"
            width={20}
            height={20}
          />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-[7px] w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Next categories"
        >
          <Image
            src="/images/categories/popular/chevron-right.png"
            alt="Next"
            width={20}
            height={20}
          />
        </button>
      </div>

      {/* Pagination indicator */}
      <div className="flex justify-center mt-6 gap-2">
        <div className="w-24 h-3 bg-white rounded-[6px] shadow-sm">
          <div
            className="h-full bg-[#D6E1DE] rounded-[3px]"
            style={{
              width: `${(currentIndex / (totalCategories - visibleCategories)) * 100}%`,
              minWidth: '20%',
              maxWidth: '100%',
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;