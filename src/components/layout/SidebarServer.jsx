import SidebarClient from './SidebarClient';

// This is a Server Component that defines the main categories
export default async function SidebarServer() {
  // Define the main categories based on the Figma design
  const mainCategories = [
    {
      id: 1,
      name: 'Vegetables & Fruits',
      slug: 'vegetables-fruits',
      image: '/images/sidebar/vegetables-fruits-icon.png',
    },
    {
      id: 2,
      name: 'Bakery',
      slug: 'bakery',
      image: '/images/sidebar/bakery-icon.png',
    },
    {
      id: 3,
      name: 'Beverages',
      slug: 'beverages',
      image: '/images/sidebar/beverages-icon.png',
    },
    {
      id: 4,
      name: 'Dairy',
      slug: 'dairy',
      image: '/images/sidebar/dairy-icon.png',
    },
    {
      id: 5,
      name: 'Seafood',
      slug: 'seafood',
      image: '/images/sidebar/seafood-icon.png',
    },
    {
      id: 6,
      name: 'Meat',
      slug: 'meat',
      image: '/images/sidebar/meat-icon.png',
    },
    {
      id: 7,
      name: 'Discount',
      slug: 'discount',
      image: '/images/sidebar/discount-icon.png',
    }
  ];

  // Pass the main categories to the client component
  return <SidebarClient categories={mainCategories} />;
}
