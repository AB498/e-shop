import LandingPage from "./LandingPage";

export const metadata = {
  title: "Thai Bangla Store - Premium Thai Products in Bangladesh",
  description: "Shop premium Thai beauty, health, and lifestyle products at Thai Bangla Store. Enjoy fast delivery, secure payment options, and excellent customer service.",
  keywords: "Thai Bangla Store, Thai products, Bangladesh, beauty products, health products, online shopping, e-commerce, premium products",
  openGraph: {
    title: "Thai Bangla Store - Premium Thai Products in Bangladesh",
    description: "Shop premium Thai beauty, health, and lifestyle products at Thai Bangla Store. Enjoy fast delivery, secure payment options, and excellent customer service.",
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
  twitter: {
    card: "summary_large_image",
    title: "Thai Bangla Store - Premium Thai Products in Bangladesh",
    description: "Shop premium Thai beauty, health, and lifestyle products at Thai Bangla Store. Enjoy fast delivery, secure payment options, and excellent customer service.",
    images: ["/images/logo.png"],
  },
};

export default function Home() {
  return <LandingPage />;
}
