import React from 'react';
import { getPromotionById } from '@/lib/actions/promotions';
import ActiveFiltersWrapper from './ActiveFiltersWrapper';

// This is a Server Component that fetches promotion data
export default async function ActiveFiltersServer({ promotionId }) {
  let promotionName = null;
  
  // If we have a promotion ID, fetch the promotion details
  if (promotionId) {
    try {
      const promotion = await getPromotionById(Number(promotionId));
      promotionName = promotion?.title || 'Promotion';
    } catch (error) {
      console.error('Error fetching promotion:', error);
      promotionName = 'Promotion';
    }
  }

  return <ActiveFiltersWrapper promotionName={promotionName} />;
}
