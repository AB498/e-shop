'use client'
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const Pagination = ({ pagination }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  // Adjust maxVisiblePages based on screen size
  const getMaxVisiblePages = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 3 : 5;
    }
    return 5; // Default for SSR
  };

  // Generate array of page numbers for pagination
  const pageNumbers = [];
  const maxVisiblePages = getMaxVisiblePages();

  if (totalPages <= maxVisiblePages) {
    // If we have fewer pages than the max visible, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always include first page
    pageNumbers.push(1);

    // Calculate start and end of visible page range
    const middlePages = maxVisiblePages - 2; // Subtract first and last page
    let startPage = Math.max(2, page - Math.floor(middlePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + middlePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage < middlePages - 1) {
      startPage = Math.max(2, endPage - (middlePages - 1));
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always include last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
  }

  // Navigate to a specific page
  const goToPage = (newPage) => {
    if (newPage === '...' || newPage === page) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    window.location.href = `/products?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-6 sm:mb-10">
      <button
        onClick={() => hasPrevPage && goToPage(page - 1)}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
          hasPrevPage
            ? 'bg-[#F2F3F4] hover:bg-[#E5E7E9] cursor-pointer'
            : 'bg-[#F2F3F4] opacity-50 cursor-not-allowed'
        } flex items-center justify-center transition-colors`}
        disabled={!hasPrevPage}
        aria-label="Previous page"
      >
        <Image src="/images/navigation/chevron-left.png" alt="Previous" width={12} height={12} className="sm:w-4 sm:h-4" />
      </button>

      {pageNumbers.map((pageNum, index) => (
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className="text-[#7E7E7E] font-bold tracking-widest text-xs sm:text-base">...</span>
        ) : (
          <button
            key={`page-${pageNum}`}
            onClick={() => goToPage(pageNum)}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
              pageNum === page
                ? 'bg-[#006B51] text-white'
                : 'bg-[#F2F3F4] text-[#7E7E7E] hover:bg-[#E5E7E9]'
            } flex items-center justify-center transition-colors`}
            aria-label={`Go to page ${pageNum}`}
            aria-current={pageNum === page ? 'page' : undefined}
          >
            <span className="font-bold text-xs sm:text-base">{pageNum}</span>
          </button>
        )
      ))}

      <button
        onClick={() => hasNextPage && goToPage(page + 1)}
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
          hasNextPage
            ? 'bg-[#F2F3F4] hover:bg-[#E5E7E9] cursor-pointer'
            : 'bg-[#F2F3F4] opacity-50 cursor-not-allowed'
        } flex items-center justify-center transition-colors`}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        <Image src="/images/navigation/chevron-right.png" alt="Next" width={12} height={12} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};

export default Pagination;
