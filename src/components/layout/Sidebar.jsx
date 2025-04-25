'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = [
  {
    name: 'Vegetables & Fruits',
    image: '/images/sidebar/vegetables-fruits.png',
  },
  {
    name: 'Bakery',
    image: '/images/sidebar/bakery.png',
  },
  {
    name: 'Beverages',
    image: '/images/sidebar/beverages.png',
  },
  {
    name: 'Dairy',
    image: '/images/sidebar/dairy.png',
  },
  {
    name: 'Seafood',
    image: '/images/sidebar/seafood.png',
  },
  {
    name: 'Vegan & Meat',
    image: '/images/sidebar/vegan-meat.png',
  },
  {
    name: 'Discount',
    image: '/images/sidebar/discount.png',
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Update document with custom property for sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '5rem' : '16rem'
    );

    // Add a small delay to allow transitions to complete
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);

    return () => clearTimeout(timer);
  }, [collapsed]);

  return (
    <>
      {/* fake div to make the sidebar occupy width */}
      <div className={`transition-all duration-300 ${collapsed ? 'w-[70px]' : 'w-64'}`}></div>
      <div
        className={`${collapsed ? 'w-[70px]' : 'w-64'
          } h-screen bg-white border-r border-[#E3E3E3] fixed left-0 overflow-y-auto transition-all duration-300 ease-in-out z-10`}
      >
        {/* Menu Toggle Button */}
        <div className="px-3 py-6 flex items-center justify-start">
          <div
            className="w-10 h-10 rounded-full bg-[#372B86] flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={toggleSidebar}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <div className={`relative flex items-center justify-center duration-300 ${collapsed ? 'rotate-180' : ''}`}>
              <i className="fas fa-bars text-white text-xl"></i>
            </div>
          </div>
        </div>

        {/* Categories */}
        <nav className="relative">
          <ul className="space-y-6 px-3 flex flex-col">
            {categories.map((category, index) => (
              <li
                key={index}
                className={`
                relative flex items-center
                cursor-pointer hover:opacity-90 transition-all duration-300 rounded-md
                ${activeCategory === index ? 'bg-[#cccccc]' : ''}
              `}
                onClick={() => setActiveCategory(index)}
                title={collapsed ? category.name : ''}
              >
                <div className={`w-10 h-10 p-2 shrink-0 relative rounded-md overflow-hidden shadow-sm flex-shrink-0 hover:shadow-md transition-shadow `}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain' }}
                    className={`transition-transform duration-300`}
                  />
                </div>
                <div className={`transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-4'}`}>
                  <span className="text-sm text-gray-800 font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar; 