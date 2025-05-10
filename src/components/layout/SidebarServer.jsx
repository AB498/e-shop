import SidebarWrapper from './SidebarWrapper';
import { getAllCategories } from '@/lib/actions/categories';

// This is a Server Component that fetches categories from the database
export default async function SidebarServer() {
  // Fetch categories from the database
  const categories = await getAllCategories();

  // Pass the categories to the wrapper component with Suspense boundary
  return <SidebarWrapper categories={categories} />;
}
