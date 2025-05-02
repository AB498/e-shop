import { Suspense } from 'react';
import AdminDashboardContent from './AdminDashboardContent';
import AdminDashboardSkeleton from './AdminDashboardSkeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminDashboard() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
