'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // Fetch wishlist from API when session changes
  useEffect(() => {
    async function fetchWishlist() {
      if (status === 'loading') return;
      
      if (status === 'authenticated') {
        setIsLoading(true);
        try {
          const response = await fetch('/api/wishlist');
          if (!response.ok) {
            throw new Error('Failed to fetch wishlist');
          }
          const data = await response.json();
          setWishlist(data.wishlist || []);
          setWishlistCount(data.wishlist?.length || 0);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          setWishlist([]);
          setWishlistCount(0);
        } finally {
          setIsLoading(false);
        }
      } else {
        // If not authenticated, clear wishlist
        setWishlist([]);
        setWishlistCount(0);
        setIsLoading(false);
      }
    }

    fetchWishlist();
  }, [status, session]);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    if (status !== 'authenticated') {
      // If not authenticated, redirect to login or show message
      return { success: false, message: 'Please login to add items to your wishlist' };
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }

      const data = await response.json();
      
      // Refresh wishlist
      const refreshResponse = await fetch('/api/wishlist');
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setWishlist(refreshData.wishlist || []);
        setWishlistCount(refreshData.wishlist?.length || 0);
      }

      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (status !== 'authenticated') {
      return { success: false, message: 'Please login to manage your wishlist' };
    }

    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      // Update local state
      const updatedWishlist = wishlist.filter(item => item.product_id !== productId);
      setWishlist(updatedWishlist);
      setWishlistCount(updatedWishlist.length);

      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
