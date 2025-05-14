import { Suspense } from "react";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import SidebarClient from "../components/layout/SidebarClient";
import TopBarClient from "../components/layout/TopBarClient";
import SessionProvider from "../components/providers/SessionProvider";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import { Toaster } from "react-hot-toast";
import Navigation from "@/components/layout/Navigation";
import { ProductQuickViewProvider } from "@/context/ProductQuickViewContext";
import ProductQuickViewModal from "@/components/products/ProductQuickViewModal";
import Footer from "@/components/layout/Footer";
import Copyright from "@/components/layout/Copyright";
import AdminRedirectNotification from "@/components/auth/AdminRedirectNotification";

export const dynamic = 'force-dynamic';


export const metadata = {
  title: "Thai Bangla E-Shop",
  description: "Thai Bangla E-Commerce Platform",
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
          }`}
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
              </WishlistProvider>
            </CartProvider>
          </SessionProvider>
        </ProductQuickViewProvider>
      </body>
    </html>
  );
}
