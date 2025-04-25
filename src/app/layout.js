import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

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
    <html lang="en">
      <body className="bg-gray-50 text-neutral-700">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        <div className="flex w-full">
          {/* Sidebar - Fixed at the left */}
          <div className="flex-none">
            <Sidebar />
          </div>
          
          {/* Main Content - Adjusts based on sidebar width */}
          <div 
            className="flex-grow min-h-screen transition-all duration-300" 
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
