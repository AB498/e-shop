'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StarRating from '@/components/ui/StarRating';

const RatingFilterWrapper = ({ options = [] }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current rating filter from URL (single value)
    const currentRating = searchParams.get('rating') || '';

    const handleRatingChange = (ratingValue) => {
        const params = new URLSearchParams(searchParams);

        if (currentRating === ratingValue) {
            // If clicking the same rating, remove the filter
            params.delete('rating');
        } else {
            // Set new rating filter
            params.set('rating', ratingValue);
        }

        // Reset to page 1 when filters change
        params.set('page', '1');

        // Navigate with new parameters
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="space-y-3">
            {/* Add "All Ratings" option */}
            <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group" onClick={() => handleRatingChange('')}>
                    <div className="relative">
                        <div className={`w-4 h-4 border-2 rounded-full transition-all duration-200 ${
                            currentRating === ''
                                ? 'border-[#006B51] bg-[#006B51]'
                                : 'border-[#BCE3C9] bg-white group-hover:border-[#006B51]'
                        }`}></div>
                        {currentRating === '' && (
                            <div className="absolute inset-1 w-2 h-2 bg-white rounded-full"></div>
                        )}
                    </div>
                    <span className="ml-2 text-sm text-[#253D4E]">All Ratings</span>
                </label>
            </div>

            {options.map((option) => {
                const isSelected = currentRating === option.value;

                return (
                    <div key={option.value} className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer group" onClick={() => handleRatingChange(option.value)}>
                            <div className="relative">
                                <div className={`w-4 h-4 border-2 rounded-full transition-all duration-200 ${
                                    isSelected
                                        ? 'border-[#006B51] bg-[#006B51]'
                                        : 'border-[#BCE3C9] bg-white group-hover:border-[#006B51]'
                                }`}></div>
                                {isSelected && (
                                    <div className="absolute inset-1 w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </div>
                            <div className="ml-2 flex items-center gap-1">
                                <StarRating rating={parseInt(option.value)} size="xs" showCount={false} />
                                <span className="text-sm text-[#253D4E] ml-1">{option.label}</span>
                            </div>
                        </label>
                        <span className="text-xs text-[#7E7E7E]">({option.count})</span>
                    </div>
                );
            })}
        </div>
    );
};

export default RatingFilterWrapper;
