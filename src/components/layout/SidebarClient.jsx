'use client'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const SidebarClient = ({ categories = [] }) => {
  // Initialize with collapsed state (true = collapsed, false = expanded)
  const [collapsed, setCollapsed] = useState(true);

  // Single timeout ref for all delayed actions
  const timeoutRef = useRef(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get('categoryId');

  // Single function to handle all sidebar state changes
  const setSidebarState = (newState, source = 'unknown', delay = 0) => {
    // Clear any pending state changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const executeStateChange = () => {
      setCollapsed(prevState => {
        // Only change state if it's actually different
        if (prevState !== newState) {
          console.log(`Sidebar ${source}: ${prevState ? 'collapsed' : 'expanded'} → ${newState ? 'collapsed' : 'expanded'}`);
          return newState;
        }
        return prevState;
      });
    };

    if (delay > 0) {
      timeoutRef.current = setTimeout(executeStateChange, delay);
    } else {
      executeStateChange();
    }
  };

  // Setup external event listener
  useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarState(!collapsed, 'external-event');
    };

    window.addEventListener('expandSidebar', handleToggleSidebar);
    return () => {
      window.removeEventListener('expandSidebar', handleToggleSidebar);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [collapsed]);

  // Event handlers using the unified pipeline
  const handleToggleClick = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setSidebarState(!collapsed, 'button-click');
  };

  const handleMouseEnter = () => {
    setSidebarState(false, 'mouse-enter');
  };

  const handleMouseLeave = () => {
    setSidebarState(true, 'mouse-leave', 150); // Small delay for mouse leave
  };

  const handleSidebarItemClick = () => {
    setSidebarState(true, 'item-click');
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
    console.log('Sidebar state effect triggered - collapsed:', collapsed);

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
            onClick={handleToggleClick}
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
        <nav
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
