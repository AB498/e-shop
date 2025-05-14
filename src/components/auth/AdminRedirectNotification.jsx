'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminRedirectNotification() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if the user was redirected from an admin page
    const adminRedirect = searchParams.get('adminRedirect');
    
    if (adminRedirect === 'true') {
      // Show a toast notification
      toast.error('Access denied. Admin privileges required.', {
        duration: 5000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  }, [searchParams]);
  
  // This component doesn't render anything
  return null;
}
