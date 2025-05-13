'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const SidebarClient = ({ categories = [] }) => {
  // Initialize with collapsed state (true = collapsed, false = expanded)
  const [collapsed, setCollapsed] = useState(true);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get('categoryId');

  // Log initial state on component mount and set up event listener
  useEffect(() => {
    console.log('SidebarClient mounted, initial collapsed state:', collapsed);

    // Add event listener for toggling the sidebar
    const handleToggleSidebar = () => {
      console.log('Toggle sidebar event received, current state:', collapsed);
      setCollapsed(!collapsed);
    };

    // Create a custom event listener
    window.addEventListener('expandSidebar', handleToggleSidebar);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('expandSidebar', handleToggleSidebar);
    };
  }, [collapsed]);

  // Function to toggle sidebar collapsed state
  const toggleSidebar = () => {
    console.log('toggleSidebar called, current state:', collapsed);
    const newState = !collapsed;
    console.log('Setting new state to:', newState);
    setCollapsed(newState);
  };

  // Function to handle sidebar item click
  const handleSidebarItemClick = () => {
    // Collapse sidebar on all screen sizes
    setCollapsed(true);
  };

  // Find the active category index based on the URL
  const getActiveCategoryIndex = () => {
    // Special case for discount
    if (searchParams.get('discount') === 'true') {
      return categories.findIndex(category => category.slug === 'discount');
    }

    if (!currentCategoryId) {
      return -1; // No category selected
    }

    // Get the current category IDs as an array
    const currentIds = currentCategoryId.split(',').map(id => parseInt(id.trim(), 10));

    // Find the index of the category that matches the current IDs
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      // Check if the category ID matches any of the current IDs
      if (currentIds.includes(category.id)) {
        return i;
      }
    }

    return -1; // No match found
  };

  // Update document with custom property for sidebar width
  useEffect(() => {
    console.log('Sidebar collapsed state changed:', collapsed);

    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '5rem' : '16rem'
    );

    // Dispatch a custom event to notify other components of the sidebar state change
    const event = new CustomEvent('sidebarStateChanged', {
      detail: { collapsed: collapsed }
    });
    window.dispatchEvent(event);

    // Add a small delay to allow transitions to complete
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);

    return () => clearTimeout(timer);
  }, [collapsed]);

  // Function to create the URL for category filtering
  const getCategoryUrl = (category) => {
    const params = new URLSearchParams(searchParams);

    // Special case for discount items
    if (category.slug === 'discount') {
      // For discount, we might want to show all products with discounts
      // This would depend on how discounts are implemented in your system
      return '/products?discount=true&page=1';
    }

    // Fallback to using the category ID directly
    params.set('categoryId', category.id);
    params.set('page', '1');
    return `/products?${params.toString()}`;
  };

  return (
    <>
      {/* fake div to make the sidebar occupy width */}
      <div
        className="transition-all duration-300 w-[0px] sm:w-[55px]"
      ></div>
      <div
        className={`${collapsed ? 'w-[0px] sm:w-[55px]' : 'w-[16rem]'} h-screen bg-white sm:border-r sm:border-[#E3E3E3] fixed left-0 overflow-y-auto transition-all duration-300 ease-in-out z-10`}

      >
        {/* Menu Toggle Button */}
        <div className="px-3 py-6 flex items-center justify-start">
          <button
            type="button"
            className="p-2 h-10aspect-square rounded-full bg-[#372B86] flex items-center justify-center cursor-pointer  "
            onClick={toggleSidebar}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <div className="relative flex items-center justify-center duration-300">
              {collapsed ? (
                <Bars3Icon className="h-[15px] w-[15px] text-white" />
              ) : (
                <XMarkIcon className="h-[15px] w-[15px] text-white" />
              )}
            </div>
          </button>
        </div>

        {/* Categories */}
        <nav className="relative">
          <ul className="px-2 space-y-1 md:space-y-2 flex flex-col">
            {/* All Products option */}
            <li
              className={`
              relative flex items-center
              cursor-pointer hover:opacity-90 transition-all duration-300 rounded-md
              ${pathname === '/products' && !currentCategoryId ? 'bg-[#F2F7F2] border-l-2 border-[#3BB77E]' : ''}
            `}
              title={collapsed ? "All Products" : ''}
            >
              <Link
                href="/products"
                className="flex items-center w-full"
                onClick={handleSidebarItemClick}
              >
                <div className={`p-2 aspect-square h-10 p-2 shrink-0 relative rounded-md overflow-hidden  flex-shrink-0  `}>
                  <svg className="h-[px] w-[px] text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3H3V10H10V3Z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 3H14V10H21V3Z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 14H14V21H21V14Z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14H3V21H10V14Z" stroke="#3BB77E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={`transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-4'}`}>
                  <span className={`text-sm font-medium whitespace-nowrap ${pathname === '/products' && !currentCategoryId ? 'text-[#3BB77E]' : 'text-gray-800'}`}>
                    All Products
                  </span>
                </div>
              </Link>
            </li>

            {categories.map((category, index) => (
              <li
                key={category.id}
                className={`
                relative flex items-center
                cursor-pointer hover:opacity-90 transition-all duration-300 rounded-md
                ${getActiveCategoryIndex() === index ? 'bg-[#F2F7F2] border-l-2 border-[#3BB77E]' : ''}
              `}
                title={collapsed ? category.name : ''}
              >
                <Link
                  href={getCategoryUrl(category)}
                  className="flex items-center w-full"
                  onClick={handleSidebarItemClick}
                >
                  <div className={`p-2 aspect-square h-10 p-2 shrink-0 relative rounded-md overflow-hidden  flex-shrink-0  `}>
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
                    <span className={`text-sm font-medium whitespace-nowrap ${getActiveCategoryIndex() === index ? 'text-[#3BB77E]' : 'text-gray-800'}`}>
                      {category.name}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default SidebarClient;
