import { getAllCategories } from '@/lib/actions/categories';
import PopularCategories from './PopularCategories';

// This is a Server Component that fetches categories from the database
export default async function PopularCategoriesServer() {
  // Fetch categories from the database
  const dbCategories = await getAllCategories();
  
  // Map database categories to the format expected by the client component
  const categories = dbCategories.map(category => ({
    id: category.id,
    name: category.name,
    image: category.image,
    // Generate some placeholder subcategories based on the category name
    subcategories: [
      `${category.name} Products`,
      `${category.name} Essentials`,
      `${category.name} Collections`,
      `${category.name} Bestsellers`,
      `${category.name} New Arrivals`
    ]
  }));

  // Pass the categories to the client component
  return <PopularCategories categories={categories} />;
}
