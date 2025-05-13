import { Suspense } from 'react';
import ContactMessagesContent from './ContactMessagesContent';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ContactMessagesPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <ContactMessagesContent />
    </Suspense>
  );
}
