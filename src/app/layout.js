import { Suspense } from "react";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import SidebarClient from "../components/layout/SidebarClient";
import TopBarClient from "../components/layout/TopBarClient";
import SessionProvider from "../components/providers/SessionProvider";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { Toaster } from "react-hot-toast";

import { ProductQuickViewProvider } from "@/context/ProductQuickViewContext";
import ProductQuickViewModal from "@/components/products/ProductQuickViewModal";
import Footer from "@/components/layout/Footer";
import Copyright from "@/components/layout/Copyright";
import AdminRedirectNotification from "@/components/auth/AdminRedirectNotification";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";

export const dynamic = 'force-dynamic';


export const metadata = {
  title: "Thai Bangla Store - Premium Thai Products in Bangladesh",
  description: "Thai Bangla Store offers premium Thai beauty, health, and lifestyle products in Bangladesh with fast delivery and secure payment options.",
  keywords: "Thai products, Bangladesh, beauty products, health products, online shopping, e-commerce",

  // Favicon and icon configuration
  icons: {
    // Default favicon
    icon: [
      { url: '/images/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    // Apple touch icon (for iOS devices)
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    // For Android devices
    shortcut: [
      { url: '/images/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    // For PWA manifest
    other: [
      { url: '/images/logo.png', sizes: '512x512', type: 'image/png' },
    ],
  },

  // App manifest for PWA
  manifest: '/manifest.json',

  // Theme color for browser UI
  themeColor: '#006B51',

  // Open Graph metadata
  openGraph: {
    title: "Thai Bangla Store - Premium Thai Products in Bangladesh",
    description: "Thai Bangla Store offers premium Thai beauty, health, and lifestyle products in Bangladesh with fast delivery and secure payment options.",
    type: "website",
    url: "https://thaibanglastore.com",
    siteName: "Thai Bangla Store",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "Thai Bangla Store Logo",
      },
    ],
  },

  // Twitter card metadata
  twitter: {
    card: "summary_large_image",
    title: "Thai Bangla Store - Premium Thai Products in Bangladesh",
    description: "Thai Bangla Store offers premium Thai beauty, health, and lifestyle products in Bangladesh with fast delivery and secure payment options.",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` `}>
      <body className="bg-gray-50 text-neutral-700 overflow-y-scroll">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`html, body {
            font-family: 'Poppins', sans-serif;
          }
          * {
          }
          `}
        </style>
        <ProductQuickViewProvider>
          <SessionProvider>
            <CartProvider>
              <WishlistProvider>
                <AdminRedirectNotification />
                <div className="flex w-full h-screen relative">
                  <div className="flex-none translate-0 relative z-10">
                    <ProductQuickViewModal />
                    <Suspense fallback={<SidebarClient categories={[]} />}>
                      <Sidebar />
                    </Suspense>
                  </div>
                  <div className="relative z-0 overflow-x-hidden flex-grow w-full min-h-screen transition-all duration-300">
                    <TopBarClient />
                    {children}
                    <Footer />
                    <Copyright />
                  </div>
                </div>
                <Toaster position="top-center" />
                <WhatsAppFAB />
              </WishlistProvider>
            </CartProvider>
          </SessionProvider>
        </ProductQuickViewProvider>
      </body>
    </html>
  );
}
