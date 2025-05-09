import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import AuthProvider from "../components/layout/AuthProvider";
import SessionProvider from "../components/providers/SessionProvider";
import { CartProvider } from "../context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Thai Bangla E-Shop",
  description: "Thai Bangla E-Commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-gray-50 text-neutral-700 overflow-y-scroll">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`html, body {
            font-family: 'Poppins', sans-serif;
          }`}
        </style>
        <SessionProvider>
          <CartProvider>
            <div className="flex w-full relative">
              <div className="flex-none translate-0 relative z-10">
                <Sidebar />
              </div>
              <div className="z-0 overflow-x-hidden flex-grow w-full min-h-screen transition-all duration-300">
                <AuthProvider />
                {children}
              </div>
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
