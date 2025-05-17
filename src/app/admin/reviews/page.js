import { Suspense } from 'react';
import ReviewsContent from './ReviewsContent';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ReviewsPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <ReviewsContent />
    </Suspense>
  );
}
