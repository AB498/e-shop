import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Topbar from '@/components/layout/Topbar';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Copyright from '@/components/layout/Copyright';
import Link from 'next/link';
import Image from 'next/image';
import ProfileContent from '@/components/profile/ProfileContent';

export const metadata = {
  title: 'My Orders - Thai Bangla Store',
  description: 'View and manage your orders from Thai Bangla Store',
};

export default async function OrdersPage() {
  // Get the session
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/auth/login');
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navigation />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 border-b border-[#ECECEC]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-[#3BB77E] font-semibold text-sm uppercase flex items-center">
            <Image src="/images/breadcrumb/home-icon.svg" alt="Home" width={14} height={14} className="mr-1" />
            Home
          </Link>
          <Image src="/images/breadcrumb/arrow-icon.svg" alt=">" width={3} height={6} className="mx-2" />
          <span className="text-[#7E7E7E] font-semibold text-sm uppercase">My Orders</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <ProfileContent user={session.user} defaultTab="orders" />
      </div>

      <Footer />
      <Copyright />
    </div>
  );
}
